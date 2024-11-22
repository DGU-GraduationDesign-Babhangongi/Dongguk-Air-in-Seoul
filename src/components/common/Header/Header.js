import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import API from "../../../API/api";
import alarmRed from "../../../assets/images/alarmred.png"; // 빨간색 알림 아이콘
import alarmGray from "../../../assets/images/Header/alarm.png"; // 기본 알림 아이콘

const Header = ({ i }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token")); // token 상태
  const [nickname, setNickname] = useState(""); // 사용자 닉네임 상태
  const [hasAlert, setHasAlert] = useState(JSON.parse(localStorage.getItem("hasAlert")) || false); // 알림 상태
  const [showToast, setShowToast] = useState(false); // Toast 상태
  const [alertMessage, setAlertMessage] = useState({}); // Toast에 표시할 알림 메시지
  const [toastDismissed, setToastDismissed] = useState(false); // Toast 닫힘 상태

  // localStorage 변경 감지
  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 홈페이지로 이동
  const GoToRoot = () => {
    navigate("/");
    window.location.reload();
  };

  // 센서 로그 데이터를 주기적으로 불러옴
  useEffect(() => {
    const fetchSensorLogs = async () => {
      try {
        const response = await API.get("/api/sensorData/abnormalValues", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {

          if (response.data.length > 0) {
            const latestLog = response.data[0]; // 최신 데이터

            // 새로운 이상 수치가 있을 경우 Toast 표시
            if ((!toastDismissed && !showToast) || alertMessage.timestamp !== latestLog.timestamp || alertMessage.sensorType !== latestLog.sensorType) {
              setHasAlert(true);
              setShowToast(true);
              setAlertMessage(latestLog);
              setToastDismissed(false);
              localStorage.setItem("hasAlert", true);

              // 15초 후 Toast 자동 닫기
              setTimeout(() => setShowToast(false), 15000);
            }
          }
        }
      } catch (error) {
        console.error("센서 로그 불러오기 실패", error);
      }
    };

    const interval = setInterval(() => { if (token) fetchSensorLogs(); }, 30000); // 30초마다 호출
    fetchSensorLogs(); // 컴포넌트 로드 시 첫 호출
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, [token, alertMessage, toastDismissed]);

  // 알림 클릭 시 처리
  const handleAlertClick = () => {
    setHasAlert(false); 
    setShowToast(false); 
    setToastDismissed(true);
    localStorage.setItem("hasAlert", false);
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
              <img src={require("../../../assets/images/Header/person.png")} alt="user" className={styles.icon} />
              <div className={styles.font} style={{ fontWeight: i === "0" ? "bold" : "normal" }}>로그인</div>
            </Link>
          </div>
        ) : (
          <nav className={styles.nav}>
            <div style={{ position: "relative" }}>
              {/* 이상 수치값 알림 */}
              <Link to="/alarm" className={styles.navLink} onClick={handleAlertClick}>
                <div className={styles.alarmContainer}>
                  <img src={hasAlert ? alarmRed : alarmGray} alt="alarm" className={styles.icon} />
                </div>
                <div className={styles.font} style={{ fontWeight: i === "1" ? "bold" : "normal" }}>이상 수치값 조회</div>
              </Link>
              {/* Toast 알림 표시 */}
              {showToast && !toastDismissed && (
                <div className={styles.toast}>
                  <div className={styles.toastHeader}>
                    <span>상태 알림 </span>
                    <span>{new Date(alertMessage.timestamp).toLocaleString()}</span>
                  </div>
                  <hr className={styles.toastSeparator} />
                  <div className={styles.toastContent}>
                    <p>{alertMessage.building} {alertMessage.name} 강의실 <br />{alertMessage.sensorType} {alertMessage.value}</p>
                  </div>
                </div>
              )}
            </div>

            <Link to="/log" className={styles.navLink}>
              <img src={require("../../../assets/images/Header/log.png")} alt="log" className={styles.icon} />
              <div className={styles.font} style={{ fontWeight: i === "2" ? "bold" : "normal" }}>강의실 로그</div>
            </Link>
            <Link to="/manager" className={styles.navLink}>
              <img src={require("../../../assets/images/Header/person.png")} alt="user" className={styles.icon} />
              <div className={styles.font} style={{ fontWeight: i === "3" ? "bold" : "normal" }}>{nickname} 관리자</div>
            </Link>
          </nav>
        )}
      </header>
      <hr className={styles.separator} />
    </div>
  );
};

export default Header;
