import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import API from "../../../API/api";
import alarmRed from "../../../assets/images/alarmred.png"; // 빨간색 아이콘
import alarmGray from "../../../assets/images/Header/alarm.png"; // 기본 회색 아이콘

const Header = ({ i }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token")); // token 상태 관리
  const [nickname, setNickname] = useState("");
  const [hasAlert, setHasAlert] = useState(
    JSON.parse(localStorage.getItem("hasAlert")) || false // localStorage에서 알림 상태 가져오기
  );
  const [showToast, setShowToast] = useState(false); // Toast 상태 관리
  const [alertMessage, setAlertMessage] = useState({}); // Toast에 표시할 메시지
  const [sensorLogs, setSensorLogs] = useState([]); // 센서 로그 데이터 관리
  const [toastDismissed, setToastDismissed] = useState(false); // 사용자가 Toast를 닫았는지 여부

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    // localStorage 변경 감지
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const GoToRoot = () => {
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const fetchSensorLogs = async () => {
      try {
        const response = await API.get(
          "https://donggukseoul.com/api/sensorData/abnormalValues",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setSensorLogs(response.data); // 센서 로그 데이터 저장

          if (response.data.length > 0) {
            const latestLog = response.data[0]; // 가장 최신 데이터

            // 새로운 이상 수치값이 들어왔을 경우 Toast 업데이트
            if (
              (!toastDismissed && showToast === false) || // 사용자가 Toast를 닫지 않았을 때
              alertMessage.timestamp !== latestLog.timestamp ||
              alertMessage.sensorType !== latestLog.sensorType
            ) {
              setHasAlert(true);
              setShowToast(true); // 새로운 값이 들어오면 Toast 표시
              setAlertMessage(latestLog); // 최신 데이터를 Toast 메시지로 설정
              setToastDismissed(false); // Toast가 새로 표시되면 dismissed 상태를 초기화
              localStorage.setItem("hasAlert", true);

              // 1분 후 Toast 자동 닫힘
              setTimeout(() => setShowToast(false), 15000);
            }
          }
        }
      } catch (error) {
        console.error("센서 로그 데이터를 불러오는데 실패했습니다.", error);
      }
    };

    const interval = setInterval(() => {
      if (token) {
        fetchSensorLogs();
      }
    }, 30000); // 30초마다 호출

    fetchSensorLogs(); // 컴포넌트 로드 시 첫 호출

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, [token, alertMessage, toastDismissed]);

  const handleAlertClick = () => {
    setHasAlert(false); // 알림 상태 해제
    setShowToast(false); // Toast 숨김
    setToastDismissed(true); // 사용자가 Toast를 닫았음을 기록
    localStorage.setItem("hasAlert", false); // localStorage 상태도 false로 변경
  };

  return (
    <div className={styles.all}>
      <header className={styles.header}>
        <img
          src={require("../../../assets/images/logo.png")}
          alt="logo"
          className={styles.logo}
          style={{ cursor: "pointer" }}
          onClick={GoToRoot}
        />

        {!token ? (
          <div className={styles.noTokenMessage}>
            <Link to="/login" className={styles.navLink}>
              <img
                src={require("../../../assets/images/Header/person.png")}
                alt="user"
                className={styles.icon}
              />
              <div
                className={styles.font}
                style={{ fontWeight: i === "0" ? "bold" : "normal" }}
              >
                로그인
              </div>
            </Link>
          </div>
        ) : (
          <nav className={styles.nav}>
            <div style={{ position: "relative" }}>
              {/* Toast가 버튼 아래에 위치하도록 설정 */}
              <Link to="/alarm" className={styles.navLink} onClick={handleAlertClick}>
                <div className={styles.alarmContainer}>
                  <img
                    src={hasAlert ? alarmRed : alarmGray}
                    alt="alarm"
                    className={styles.icon}
                  />
                </div>
                <div
                  className={styles.font}
                  style={{ fontWeight: i === "1" ? "bold" : "normal" }}
                >
                  이상 수치값 조회
                </div>
              </Link>
              {showToast && !toastDismissed && (
                <div className={styles.toast}>
                  <div className={styles.toastHeader}>
                    <span>상태 알림 </span>
                    <span>{new Date(alertMessage.timestamp).toLocaleString()}</span>
                  </div>
                  <hr className={styles.toastSeparator} />
                  <div className={styles.toastContent}>
                    <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
                      {alertMessage.building} {alertMessage.name} 강의실
                      <br />
                      {alertMessage.sensorType} {alertMessage.value}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <Link to="/log" className={styles.navLink}>
              <img
                src={require("../../../assets/images/Header/log.png")}
                alt="/log"
                className={styles.icon}
              />
              <div
                className={styles.font}
                style={{ fontWeight: i === "2" ? "bold" : "normal" }}
              >
                강의실 로그
              </div>
            </Link>
            <Link to="/manager" className={styles.navLink}>
              <img
                src={require("../../../assets/images/Header/person.png")}
                alt="user"
                className={styles.icon}
              />
              <div
                className={styles.font}
                style={{ fontWeight: i === "3" ? "bold" : "normal" }}
              >
                {nickname} 관리자
              </div>
            </Link>
          </nav>
        )}
      </header>
      <hr className={styles.separator} />
    </div>
  );
};

export default Header;
