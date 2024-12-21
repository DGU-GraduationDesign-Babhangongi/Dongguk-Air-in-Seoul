import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import API from "../../../API/api";
import alarmRed from "../../../assets/images/alarmred.png";
import alarmGray from "../../../assets/images/Header/alarm.png";

const Header = ({ i }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [nickname, setNickname] = useState(localStorage.getItem("name"));
  const [hasAlert, setHasAlert] = useState(JSON.parse(localStorage.getItem("hasAlert")) || false);
  const [showToast, setShowToast] = useState(false);
  const [alertMessage, setAlertMessage] = useState({});
  const [toastDismissed, setToastDismissed] = useState(false);
  const school = localStorage.getItem("schoolEname");
  const schoollogo= localStorage.getItem("schoolLogo");
  
  const getUnit = (sensorType) => {
    switch (sensorType) {
      case "Temperature":
        return "°C";
      case "Humidity":
        return "%";
      case "TVOC":
        return "㎍/m³";
      case "PM2_5MASSCONCENTRATION":
        return "㎍/m³";
      case "AmbientNoise":
        return "dB";
      default:
        return "";
    }
  };

  useEffect(() => { const fetchNickname = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await API.get("/api/user/nickname", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          const nickname = response.data; // 서버에서 닉네임 데이터 가져오기
          setNickname(nickname);
          localStorage.setItem("name", nickname);

          // 'storage' 이벤트 트리거
          window.dispatchEvent(new Event("storage"));

          navigate("/");
        }
      } catch (error) {
        // console.error("닉네임을 불러오는 데 실패했습니다:", error);
      }
    }
  };


    const handleStorageChange = () => {
      const updatedNickname = localStorage.getItem("name");
      if (updatedNickname !== nickname) {
        setNickname(updatedNickname);
      }
    };
  
    // storage 이벤트 리스너 등록
    window.addEventListener("storage", handleStorageChange);
  
    return () => {
      // 컴포넌트가 언마운트될 때 리스너 제거
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [nickname]);
   
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
        {/*<img
          src={require("../../../assets/images/logo1.png")}
          alt="logo"
          className={styles.logo}
          style={{ cursor: "pointer" }}
          onClick={GoToRoot}
        />*/}
    
    <div style={{ display: 'flex', alignItems: 'center' }}>
  <img src={schoollogo} alt={school} style={{ width: '10%' }} />
  <div style={{ marginLeft: '10px' }}>
    <div>CLEAN AIR</div>
    <div>In {school}</div>
  </div>
</div>

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
                    <span>상태 알림 {new Date(alertMessage.timestamp).toLocaleString()}
                      <button
                        onClick={() => setShowToast(false)}
                        className={styles.toastCloseButton}
                        aria-label="닫기"
                      >×</button></span>
                  </div>
                  <hr className={styles.toastSeparator} />
                  <div className={styles.toastContent}>
                    <p>
                      {alertMessage.building} {alertMessage.name} 강의실 <br />
                      {alertMessage.sensorType} {alertMessage.value}
                      {getUnit(alertMessage.sensorType)}
                    </p>
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
