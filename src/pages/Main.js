import React, { useState } from "react";
import Header from "../components/common/Header/Header";
import { useNavigate } from "react-router-dom";
import styles from "./Main.module.css";

/*처음 들어가면 나오는 화면*/

function Main() {
  const [popupContent, setPopupContent] = useState(null);

  const handleBuildingClick = (buildingInfo) => {
    setPopupContent(buildingInfo);
  };

  const closePopup = () => {
    setPopupContent(null);
  };

  return (
    <div>
      <Header />
      <div className={styles.mainContainer}>
        <div className={styles.welcomeMessage}>
          <h2>이수민 관리자님 환영합니다!</h2>
          <p>공기질을 확인할 강의실을 선택해주세요</p>
        </div>
        <div className={styles.content}>
          {/* 건물 섹션 */}
          <div className={styles.buildings}>
            <div
              className={styles.building}
              onClick={() =>
                handleBuildingClick(
                  "현재 정보문화관 P에는 등록된 센서가 없습니다. 센서를 등록하시겠습니까?"
                )
              }
            >
              <img src="/Main/jungboP.png" alt="정보문화관 P" />
              <p>정보문화관 P</p>
              <div className={styles.sensorInfo}>
                <p>설치된 센서</p>
                <p>
                  0 <span className={styles.greenLight}></span>
                </p>
                <p>
                  0 <span className={styles.redLight}></span>
                </p>
              </div>
            </div>
            <div
              className={styles.building}
              //onClick={() => handleBuildingClick("신공학관의 팝업 정보")}
            >
              <img src="/Main/singong.png" alt="신공학관" />
              <p>신공학관</p>
              <div className={styles.sensorInfo}>
                <p>설치된 센서</p>
                <p>
                  13 <span className={styles.greenLight}></span>
                </p>
                <p>
                  0 <span className={styles.redLight}></span>
                </p>
              </div>
            </div>
            <div
              className={styles.building}
              onClick={() =>
                handleBuildingClick(
                  "현재 원흥관에는 등록된 센서가 없습니다. 센서를 등록하시겠습니까?"
                )
              }
            >
              <img src="/Main/wonheung.png" alt="원흥관" />
              <p>원흥관</p>
              <div className={styles.sensorInfo}>
                <p>설치된 센서</p>
                <p>
                  0 <span className={styles.greenLight}></span>
                </p>
                <p>
                  0 <span className={styles.redLight}></span>
                </p>
              </div>
            </div>
          </div>

          {/* 오른쪽 날씨 및 로그 섹션 */}
          <div className={styles.weatherAndLogs}>
            <div className={styles.weatherInfo}>
              <h3>서울 중구 필동 1가</h3>
              <p>32°C 흐리고 비</p>
              <p>체감온도: 34°C/24°C</p>
              <p>
                오늘은 하루종일 비 소식이 있으니 실내 습도 조절에 유의하세요
              </p>
            </div>

            <div className={styles.sensorLogs}>
              <h3>센서 수치 이상 로그 기록</h3>
              <p>[2024.07.20 PM23:56] 신공학관 4147 PM 2.5 수치 이상</p>
              <p>[2024.07.21 AM02:23] 신공학관 3173 PM 2.5, 소음 수치 이상</p>
              <p>[2024.07.21 AM08:18] 신공학관 3173 소음 수치 이상</p>
            </div>
          </div>
        </div>

        {popupContent && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <h3>알림</h3>
              <p>{popupContent}</p>
              <button onClick={closePopup}>닫기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
