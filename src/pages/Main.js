/*Main.js*/
import React, { useState, useEffect } from "react";
import Header from "../components/common/Header/Header";
import styles from "./Main.module.css";
import addInage from '../assets/images/addBuilding.png'
import { useNavigate } from "react-router-dom";
import API from "../API/api";
import WeatherInfo from "../components/specific/weatherInfo/weatherInfo";
import AbnormalLog from "../components/specific/abnormalLog/abnormalLog";
import Popup from "../components/common/Popup/Popup";
/*images*/
import currentbuilding from "../assets/images/main/currentBuilding_icon.png";
import FloorPlans from "./SejongMain/components/FloorPlanGroup";
import { Link } from 'react-router-dom';

function Main() {
  const color2 = localStorage.getItem("schoolColor");

  const [buildingList, setBuildingList] = useState([]); // 상태로 관리
  const [loading, setLoading] = useState(true); // Start with loading set to true
  const [nickname, setNickname] = useState(true); // Start with loading set to true
  
  const [token] = useState(localStorage.getItem("token"));
  const [showPopup, setShowPopup] = useState(false);
  const [showNoSensorPopup, setShowNoSensorPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [dateTime] = useState(new Date());
  const [forecast] = useState(null);
  const [forecast2] = useState(null);
  const [loadingdata] = useState(true);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideCount = 3;

  // Next button handler to move the slide right
  const handleNext = () => {
    if (currentIndex + slideCount < buildingList.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Prev button handler to move the slide left
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleAddBuildingClick = () => {
 
      navigate("/contact"); // 건물 추가 페이지로 이동
    
  };
  const closePopupHandler = () => {
    setShowPopup(false);
  };
  const openshowNoSensorPopup = () => {
    setShowNoSensorPopup(true);
  };
  const closeshowNoSensorPopupHandler = () => {
    setShowNoSensorPopup(false);
  };

  useEffect(() => {
    const fetchNickname = async () => {
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

            navigate("/main");
          }
        } catch (error) {
          // console.error("닉네임을 불러오는 데 실패했습니다:", error);
        }
      }
    };

    const fetchBuildings = async () => {
      try {
        const response = await fetch('https://donggukseoul.com/api/buildings', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const options = data.map((building) => ({
            id: building.id,  // assuming `id` is a unique identifier for the building
            name: building.name, // assuming `name` is the label you want to display
            maxFloor: building.maxFloor, 
            imageUrl: building.imageUrl, 
            sensorCount: building.sensorCount, 
          }));
          setBuildingList(options);  // Update the state with building options
        } else {
          console.error('Failed to fetch building data');
        }
      } catch (error) {
        console.error('Error fetching building data:', error);
      } finally {
        setLoading(false); // Stop loading after the fetch completes
      }
    };

    fetchBuildings();
    fetchNickname();
  
  }, [token, navigate]);

  const currentBuildings = buildingList.slice(currentIndex, currentIndex + slideCount);

  return (
    <div>
      <Header />
      <div className={styles.mainContainer}>
        {(selectedBuilding?.sensorCount < 1 || selectedBuilding==null) && (
          <div
            className={`${styles.welcomeMessage} ${
              isFadingOut ? styles.fadeOutMessage : ""
            }`}
          >
            <h2 style={{ fontSize: "clamp(18px, 2vw, 28px)" }}>
              {nickname}님 환영합니다!
            </h2>
            <p style={{ fontSize: "clamp(12px, 1.5vw, 20px)" }}>
              공기질을 확인할 강의실을 선택해주세요.
            </p>
          </div>
        )}

        {selectedBuilding?.sensorCount > 0 && (
          <div className={styles.topMessage} style={{ width: "400px" }}>
            <img
              src={currentbuilding}
              alt="현재 건물"
              style={{ width: "80px", height: "84px", marginRight: "16px" }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className={styles.topMessageDetail}>{selectedBuilding?.name}</div>
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

        <div className={styles.content}>
        {buildingList.length === 0 && (
  <div style={{
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center', 
    textAlign: 'center',
    marginLeft: '26%',
    height: '100vh'  // 화면 전체 높이를 차지하도록 설정
  }}>
    <Link to="/contact">
    <img 
      src={addInage} 
      alt="Add Building" 
 
      style={{
        width: '50%', 
        cursor: 'pointer' // 마우스를 올렸을 때 클릭 모양 변경
      }} 
    /></Link>
    <p style={{
      width: '80%', 
      fontSize: '24px', 
      fontWeight: 'bold'
    }}>
      건물 등록하러 가기
    </p>
  </div>
)}




        {(selectedBuilding?.sensorCount < 1 || selectedBuilding==null) ? (
  <div className={styles.buildings}>
    <div className={styles.buildingsContainer}>
      {currentBuildings.map((building, index) => (
        <div
          key={index}
          className={styles.building}
          onClick={() => { setSelectedBuilding(building); if(building.sensorCount===0){setShowNoSensorPopup(true)}}}
        >
          <img src={building.imageUrl} alt={building.name} />
          <h2>{building.name}</h2>
          <div className={styles.sensorInfo}>
            <p>설치된 센서</p>
            <p>
              {building.sensorCount}{" "}
              <span className={styles.greenLight}></span>
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
) : (
<div className={styles.buildings}>
  <div className={styles.buildingsContainer}>
    <div className={styles.building}>
      <img src={selectedBuilding.imageUrl} alt={selectedBuilding.name} />
      <h2>{selectedBuilding.name}</h2>
      <div className={styles.sensorInfo}>
        <p>설치된 센서</p>
        <p>
          {selectedBuilding.sensorCount}{" "}
          <span className={styles.greenLight}></span>
        </p>
      </div>
    </div>
    <div
  style={{
    width: "40%",
    height: "100%",
    position: "relative", // 부모 요소를 기준으로 위치 설정
  }}
>
  <FloorPlans
    width="100%"
    buildingName={selectedBuilding?.name}
    maxFloor={selectedBuilding?.maxFloor}

  />
</div>


  </div>
</div>

)}

          <div className={styles.weatherAndLogs} style={{ position: "relative" }}>
            <div className={styles.weatherLogs} style={{backgroundColor:`${color2}50`}}>
              <WeatherInfo
                forecast={forecast}
                forecast2={forecast2}
                loading={loadingdata}
                dateTime={dateTime}
              />
            </div>
            <div className={styles.sensorLogs} style={{backgroundColor:`${color2}20`}}>
              <AbnormalLog token={token} />
            </div>
          </div>
        </div>
        {(selectedBuilding?.sensorCount < 1 || selectedBuilding==null) &&(buildingList.length>0) &&(
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "50%" }}>
    <button className={styles.arrowLeft} onClick={handlePrev}>
      &lt;
    </button>
    <button className={styles.arrowRight} onClick={handleNext}>
      &gt;
    </button>
  </div>
)}

      </div>



      {showNoSensorPopup &&
        (token ? (
          <Popup
            popupContent="해당 건물에 등록된 센서가 없습니다. 등록하시겠습니까?"
            onClose={closeshowNoSensorPopupHandler}
            registerLink="/contact"
            buttonText="등록하기"
          />
        ) : (
          <Popup
            popupContent="로그인이 필요합니다. 로그인 후 센서를 확인하세요."
            onClose={closeshowNoSensorPopupHandler}
            registerLink="/login"
            buttonText="로그인"
          />
        ))}
    </div>

 
  );
}

export default Main;
