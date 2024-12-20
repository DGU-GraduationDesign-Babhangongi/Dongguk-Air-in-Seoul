/* Main.js */
import React, { useState, useEffect } from "react";
import Header from "../../components/common/Header/Header";
import styles from "./SejongMain.module.css";
import { useNavigate } from "react-router-dom";
import API from "../../API/api";
import WeatherInfo from "../../components/specific/weatherInfo/weatherInfo";
import AbnormalLog from "../../components/specific/abnormalLog/abnormalLog";
import Popup from "../../components/common/Popup/Popup";
import addBuilding from "../../assets/images/addBuilding.png";

function Main() {
  const [token] = useState(localStorage.getItem("token"));
  const [showPopup, setShowPopup] = useState(false);
  const [buildingList, setBuildingList] = useState([]); // 건물 리스트 상태
  const navigate = useNavigate();

  useEffect(() => {
    // API를 통해 건물 리스트 가져오기
    const fetchBuildings = async () => {
      try {
        const response = await API.get("/api/buildings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBuildingList(response.data); // API 응답 데이터 설정
        console.log("건물 리스트:", response.data);
      } catch (error) {
        console.error("건물 리스트를 가져오는 중 오류 발생:", error);
        setBuildingList([]); // 오류 발생 시 빈 리스트로 설정
      }
    };

    fetchBuildings();
  }, [token]);

  const handleAddBuildingClick = () => {
    if (!token) {
      setShowPopup(true); // 로그인 팝업 띄우기
    } else {
      navigate("/add-building"); // 건물 추가 페이지로 이동
    }
  };

  const closePopupHandler = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <Header />
      <div
        className={styles.mainContainer}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          className={styles.content}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "flex-start",
            padding: "10px",
          }}
        >
          <div
            className={styles.buildingsList}
            style={{
              display: "flex",
              gap: "6%",
              overflowX: "auto",
              padding: "10px",
              maxWidth: "70%",
              scrollSnapType: "x mandatory",
              marginTop: "8%",
            }}
          >
            {buildingList.length === 0 ? (
              <div
                className={styles.noBuildingsMessage}
                style={{ textAlign: "center" }}
              >
                <h2 className={styles.welcomeTitle}>
                  {token ? "사용자님 환영합니다!" : "환영합니다!"}
                </h2>
                <p style={{ marginBottom: "20%" }}>
                  현재 등록된 건물이 없습니다.
                </p>
                <div className={styles.welcomeMessage}>
                  <img
                    src={addBuilding}
                    alt="환영 이미지"
                    className={styles.addBuilding}
                  />
                  <p style={{ marginBottom: "20%" }}>
                    건물 등록하기 버튼을 클릭해 시작해보세요!
                  </p>
                  <button
                    onClick={handleAddBuildingClick}
                    className={styles.addBuildingButton}
                  >
                    건물 등록하기
                  </button>
                </div>
              </div>
            ) : (
              buildingList.map((building) => (
                <div
                  key={building.id}
                  className={styles.building}
                  onClick={() => navigate(`/buildings/${building.id}`)}
                  style={{
                    flex: "0 0 auto",
                    scrollSnapAlign: "center",
                    minWidth: "200px",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={building.imageUrl}
                    alt={building.name}
                    className={styles.buildingImage}
                  />
                  <h2>{building.name}</h2>
                  <p>최대 층수: {building.maxFloor}</p>
                  <p>센서 개수: {building.sensorCount}</p>
                </div>
              ))
            )}
          </div>
          <div
            className={styles.weatherAndLogs}
            style={{ width: "25%", flexShrink: 0 }}
          >
            <div className={styles.weatherLogs}>
              <WeatherInfo />
            </div>
            <div className={styles.sensorLogs}>
              <AbnormalLog token={token} />
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <Popup
          popupContent="로그인이 필요한 서비스입니다."
          onClose={closePopupHandler}
          registerLink="/login"
          buttonText="로그인"
        />
      )}
    </div>
  );
}

export default Main;
