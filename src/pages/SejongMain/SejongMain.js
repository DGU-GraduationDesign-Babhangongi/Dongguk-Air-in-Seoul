/* Main.js */
import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/common/Header/Header";
import styles from "./SejongMain.module.css";
import { useNavigate } from "react-router-dom";
import API from "../../API/api";
import WeatherInfo from "../../components/specific/weatherInfo2/weatherInfoSEJONG";
import AbnormalLog from "../../components/specific/abnormalLog2/abnormalLogSEJONG";
import Popup from "../../components/common/Popup/Popup";

/*images*/
import addBuilding from "../../assets/images/addBuilding.png";
import currentbuilding from "../../assets/images/main/currentBuilding_icon.png";

function Main() {
  const [token] = useState(localStorage.getItem("token"));
  const [showPopup, setShowPopup] = useState(false);
  const [buildingList, setBuildingList] = useState([]); // 건물 리스트 상태
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [currentBuildingName, setCurrentBuildingName] = useState("");
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true); // 환영 메시지 상태
  const [isFadingOut, setIsFadingOut] = useState(false); // 애니메이션 상태
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
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

  const handleBuildingClick = (buildingId) => {
    setIsFadingOut(true); // 애니메이션 트리거

    // 애니메이션이 끝난 후 상태 업데이트
    setTimeout(() => {
      setSelectedBuilding(buildingId);
      setShowWelcomeMessage(false); // 환영 메시지 숨기기
      setIsFadingOut(false);
    }, 1000);

    const clickedBuilding = buildingList.find(
      (building) => building.id === buildingId
    );
    if (clickedBuilding) {
      setCurrentBuildingName(clickedBuilding.name);
    }
  };

  return (
    <div>
      <Header />
      {showWelcomeMessage && (
        <div
          className={`${styles.welcomeMessage} ${
            isFadingOut ? styles.fadeOut : styles.fadeIn
          }`}
          style={{
            position: "absolute",
            top: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "20px",
            zIndex: 100,
          }}
        >
          <h2 style={{ fontSize: "clamp(18px, 2vw, 28px)" }}>
            사용자님 환영합니다!
          </h2>
          <p style={{ fontSize: "clamp(12px, 1.5vw, 20px)" }}>
            공기질을 확인할 강의실을 선택해주세요.
          </p>
        </div>
      )}
      <div
        className={styles.mainContainer}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {selectedBuilding && (
          <div
            className={styles.topMessage}
            style={{
              width: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              marginBottom: "16px", // 건물 리스트와 간격 추가
              position: "absolute", // 문구를 건물 리스트 위로 배치
              top: "280px", // 원하는 위치로 조정
              left: "10px",
            }}
          >
            <img
              src={currentbuilding}
              alt="현재 건물"
              style={{
                width: "80px",
                height: "84px",
                marginRight: "16px",
                marginBottom: "16px",
              }}
            />
            <div
              style={{
                width: "300px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className={styles.topMessageDetail}
                style={{ fontSize: "40px" }}
              >
                {currentBuildingName}
              </div>
              <p className={styles.another}>
                <span
                  onClick={() => (window.location.href = "/")}
                  onMouseEnter={(e) => {
                    e.target.style.color = "black";
                    e.target.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "gray";
                    e.target.style.textDecoration = "none";
                  }}
                  style={{
                    color: "gray",
                    cursor: "pointer",
                  }}
                >
                  다른 건물의 공기질을 확인하려면
                  <br />
                  여기를 누르세요{" "}
                </span>
              </p>
            </div>
          </div>
        )}

        <div
          className={styles.content}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "flex-start",
            padding: "10px",
            marginTop: selectedBuilding ? "100px" : "0", // 선택된 건물 문구로 인해 건물 리스트가 밀리지 않도록 설정
          }}
        >
          <div
            ref={containerRef}
            className={styles.buildingsList}
            style={{
              display: "flex",
              gap: "6%",
              overflowX: selectedBuilding ? "hidden" : "auto", // 스크롤 제거
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
                    alt="건물 추가"
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
                  onClick={() => handleBuildingClick(building.id)}
                  style={{
                    flex: "0 0 auto",
                    scrollSnapAlign: "center",
                    minWidth: "200px",
                    textAlign: "center",
                    transform:
                      selectedBuilding === building.id
                        ? `translateX(calc(-150% + ${
                            containerRef.current?.offsetLeft || 0
                          }px))`
                        : "translateX(0)", // 선택된 건물은 일정한 위치로 이동
                    opacity:
                      selectedBuilding && selectedBuilding !== building.id
                        ? 0
                        : 1,
                    transition: "all 1.5s ease",
                  }}
                >
                  <img
                    src={building.imageUrl}
                    alt={building.name}
                    className={styles.buildingImage}
                  />
                  <h2
                    style={{
                      fontSize: "20px",
                      textShadow: "3px 3px 1.5px #d3d3d3",
                    }}
                  >
                    {building.name}
                  </h2>
                  <p>
                    {building.sensorCount}
                    <span className={styles.greenLight}></span>
                  </p>
                </div>
              ))
            )}
          </div>
          <div
            className={styles.weatherAndLogs}
            style={{
              width: "25%",
              flexShrink: 0,
              transform: selectedBuilding
                ? "translateY(-50px)"
                : "translateY(0)", // 선택된 건물에 따라 아래로 이동
              position: "relative",
            }}
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
