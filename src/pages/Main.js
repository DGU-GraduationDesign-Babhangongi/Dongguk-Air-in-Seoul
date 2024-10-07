import React, { useState } from "react";
import Header from "../components/common/Header/Header";
import { Link } from "react-router-dom";
import styles from "./Main.module.css";
import { FaMapMarkedAlt } from "react-icons/fa";

function Main() {
  const [popupContent, setPopupContent] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);

  const handleBuildingClick = (building, buildingInfo) => {
    setFadeOut(true); // 나머지 건물들을 fade out 시킴
    setTimeout(() => {
      setSelectedBuilding(building);
      setFadeOut(false);
    }, 1000);
    setPopupContent(buildingInfo);
  };

  const resetBuildings = () => {
    setSelectedBuilding(null);
    setFadeOut(false);
  };

  const closePopup = () => {
    setPopupContent(null);
    setSelectedBuilding(null);
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
              className={`${styles.building} ${
                selectedBuilding === "신공학관" ? styles.fadeOut : ""
              }`}
              onClick={() =>
                handleBuildingClick(
                  "정보문화관 P",
                  <>
                    현재 정보문화관 P에는
                    <br />
                    등록된 센서가 없습니다.
                    <br />
                    센서를 등록하시겠습니까?
                  </>
                )
              }
            >
              <img src="/Main/jungboP.png" alt="정보문화관 P" />
              <h2>정보문화관 P</h2>
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
              className={`${styles.building} ${
                selectedBuilding !== "신공학관" && selectedBuilding
                  ? styles.fadeOut
                  : ""
              } ${selectedBuilding === "신공학관" ? styles.moveLeft : ""}`}
              onClick={() => handleBuildingClick("신공학관")}
            >
              <img src="/Main/singong.png" alt="신공학관" />
              <h2>신공학관</h2>
              <div className={styles.sensorInfo}>
                <p>설치된 센서</p>
                <p>
                  7 <span className={styles.greenLight}></span>
                </p>
                <p>
                  0 <span className={styles.redLight}></span>
                </p>
              </div>
            </div>

            <div
              className={`${styles.building} ${
                selectedBuilding === "신공학관" ? styles.fadeOut : ""
              }`}
              onClick={() =>
                handleBuildingClick(
                  "원흥관",
                  <>
                    현재 원흥관에는
                    <br />
                    등록된 센서가 없습니다.
                    <br />
                    센서를 등록하시겠습니까?
                  </>
                )
              }
            >
              <img src="/Main/wonheung.png" alt="원흥관" />
              <h2>원흥관</h2>
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
              <h3>
                <FaMapMarkedAlt className={styles.pingIcon} />
                서울 중구 필동
              </h3>
              <p>32°C 강수: 0</p>
              <p>습도: </p>
              <p>하늘상태: 맑음</p>
              <p>최고온도 : 34°C</p>
              <p>최저온도 : 14°C</p>
              <p>
                오늘은 하루종일 비 소식이 있으니 실내 습도 조절에 유의하세요
              </p>
            </div>

            <div className={styles.sensorLogs}>
              <h3>센서 수치 이상 로그 기록</h3>
              <p>
                [2024.07.20 PM23:56]
                <br />
                신공학관 4147 PM 2.5 수치 이상
              </p>
              <p>
                [2024.07.21 AM02:23]
                <br />
                신공학관 3173 PM 2.5, 소음 수치 이상
              </p>
              <p>
                [2024.07.21 AM08:18]
                <br />
                신공학관 3173 소음 수치 이상
              </p>
            </div>
            {/* 신공학관이 선택되었을 때 이미지 표시 */}
            {selectedBuilding === "신공학관" && (
              <div className={styles.additionalContent}>
                <div className={styles.selectedBuildingImage}>
                  <img src="/Main/floorplan.png" alt="신공학관 도면도" />
                </div>
              </div>
            )}
          </div>
        </div>
        {popupContent && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <h2>알림</h2>
              <p>{popupContent}</p>
              <Link to="/contact" className={styles.popupButton}>
                등록하기
              </Link>
              <div className={styles.divider}></div>
              <button onClick={closePopup} className={styles.popupButton}>
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
