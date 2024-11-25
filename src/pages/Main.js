/*Main.js*/
import React, { useState, useEffect, useRef } from "react";
import Header from "../components/common/Header/Header";
import styles from "./Main.module.css";
import { useNavigate } from "react-router-dom";
import API from "../API/api";
import SensorDetail from "../components/specific/sensorDetail/sensorDetail";
import WeatherInfo from "../components/specific/weatherInfo/weatherInfo";
/*images*/
import logsensor from "../assets/images/main/sensor_icon.png";
import currentbuilding from "../assets/images/main/currentBuilding_icon.png";
import floorplan from "../assets/images/main/floorplan.png";
import singong from "../assets/images/main/singong.png";
import wonheung from "../assets/images/main/wonheung.png";
import jungbo from "../assets/images/main/jungboP.png";
import Popup from "../components/common/Popup/Popup";

function Main() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showPopup, setShowPopup] = useState(false);
  const [showNoSensorPopup, setshowNoSensorPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [dateTime] = useState(new Date());
  const [forecast] = useState(null);
  const [forecast2] = useState(null);
  const [loadingdata] = useState(true);
  const [hoveredFloor, setHoveredFloor] = useState(null);
  const [allSensorData, setAllSensorData] = useState([]);
  const [nickname, setNickname] = useState("사용자");
  const [sensorLogs, setSensorLogs] = useState([]);
  const navigate = useNavigate();

  const getLevelColor = (level) => {
    switch (level) {
      case "RED":
        return "#F44336";
      case "ORANGE":
        return "#FF9800";
      case "YELLOW":
        return "#FFBD2E";
      default:
        return "black";
    }
  };

  const fetchSensorLogs = async () => {
    if (!token) {
      console.error("토큰이 없습니다. 로그인 후 다시 시도하세요.");
      return;
    }
    try {
      const response = await API.get("/api/sensorData/abnormalValues", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSensorLogs(response.data);
    } catch (error) {
      console.error("Error fetching sensor logs:", error.response || error);
    }
  };

  useEffect(() => {
    fetchSensorLogs();
  }, []);
  const openPopup = () => {
    setShowPopup(true);
  };
  const closePopupHandler = () => {
    setShowPopup(false);
  };
  const openshowNoSensorPopup = () => {
    setshowNoSensorPopup(true);
  };
  const closeshowNoSensorPopupHandler = () => {
    setshowNoSensorPopup(false);
  };

  const renderSensorLogs = () => (
    <div
      style={{
        maxHeight: "200px",
        overflowY: "auto",
      }}
    >
      {sensorLogs.length > 0 ? (
        sensorLogs.map((log, index) => {
          const date = new Date(log.timestamp);
          const formattedDate = `${date.getFullYear()}. ${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}. ${date
            .getDate()
            .toString()
            .padStart(2, "0")}. ${date
            .getHours()
            .toString()
            .padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${date
            .getSeconds()
            .toString()
            .padStart(2, "0")}`;

          const getUnit = (sensorType) => {
            switch (sensorType) {
              case "Temperature":
                return "°C";
              case "Humidity":
                return "%";
              case "TVOC":
              case "PM2_5MASSCONCENTRATION":
                return "㎍/m³";
              case "AmbientNoise":
                return "dB";
              default:
                return "";
            }
          };

          const unit = getUnit(log.sensorType);

          return (
            <div key={index} style={{ marginBottom: "10px" }}>
              <strong>[{formattedDate}]</strong>
              <br />
              <span>
                {log.building} {log.name}
                <span
                  style={{
                    color: getLevelColor(log.level),
                    fontWeight: "bold",
                    marginLeft: "10px",
                  }}
                >
                  {log.sensorType} {log.value}
                  {unit && `${unit}`}
                </span>
              </span>
              <br />
            </div>
          );
        })
      ) : (
        <div>로그인하시면 이상 수치 로그를 확인할 수 있습니다</div>
      )}
    </div>
  );

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
    fetchNickname();
  }, []);

  const handleBuildingClick = (building, buildingInfo) => {
    if (building == "신공학관") {
      setIsFadingOut(true);
      setFadeOut(true);
      setTimeout(() => {
        setSelectedBuilding(building);
        setFadeOut(false);
        setIsFadingOut(false);
        setShowMessage(false);
      }, 1000);
    }
    setPopupContent(buildingInfo);
  };
  const closePopup = () => {
    setPopupContent(null);
    setSelectedBuilding(null);
  };

  const imageRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const coordinates = [
    { building: "신공학관", id: "3115", x: 464, y: 442 },
    { building: "신공학관", id: "3173", x: 488, y: 482 },
    { building: "신공학관", id: "4142", x: 262, y: 388 },
    { building: "신공학관", id: "5145", x: 192, y: 237 },
    { building: "신공학관", id: "5147", x: 184, y: 213 },
    { building: "신공학관", id: "6119", x: 366, y: 125 },
    { building: "신공학관", id: "6144", x: 137, y: 116 },
  ];

  const handleClick = (id) => {
    navigate(`/figures/${id}`);
  };
  const floorcoordinates = [
    { floor: 3, top: "480px" },
    { floor: 4, top: "350px" },
    { floor: 5, top: "220px" },
    { floor: 6, top: "90px" },
  ];
  const handleFloorClick = (floor) => {
    navigate(`/floorcheck/${floor}`);
  };

  useEffect(() => {
    const fetchAllSensorData = async () => {
      try {
        const responses = await Promise.all(
          coordinates.map(async (coord) => {
            const endpoint = `/api/sensorData/recent/classroom?building=${encodeURIComponent(
              coord.building
            )}&name=${encodeURIComponent(coord.id)}`;
            const response = await API.get(endpoint);
            return {
              id: coord.id,
              IAQIndex: response.data?.IAQIndex?.value || "--",
            };
          })
        );
        setAllSensorData(responses);
      } catch (error) {
        // console.error("Error fetching all sensor data:", error);
      }
    };
    fetchAllSensorData();
  }, []);

  useEffect(() => {
    const fetchSensorData = async () => {
      if (hoveredIndex !== null) {
        const hoveredCoord = coordinates[hoveredIndex];
        if (!hoveredCoord) return;
        try {
          const endpoint = `/api/sensorData/recent/classroom?building=${encodeURIComponent(
            hoveredCoord.building
          )}&name=${encodeURIComponent(hoveredCoord.id)}`;
          const response = await API.get(endpoint);
          setSensorData(response.data);
        } catch (error) {
          // console.error("Error fetching sensor data:", error);
          setSensorData(null);
        }
      } else {
        setSensorData(null);
      }
    };
    fetchSensorData();
  }, [hoveredIndex]);

  const getIAQColor = (value) => {
    if (value > 90) return "#5C82F5";
    if (value > 80 && value <= 90) return "#8BC34A";
    if (value > 70 && value <= 80) return "#FFEB3B";
    if (value > 60 && value <= 70) return "#FF9800";
    return "#F44336";
  };

  const getSensorIAQValue = (id) => {
    const sensor = allSensorData.find((data) => data.id === id);
    if (!sensor || sensor.IAQIndex === "--") {
      console.warn(`ID: ${id}에 대한 IAQIndex 데이터 없음.`);
      return "--";
    }
    console.log(`강의실 ID: ${id}, IAQIndex:`, sensor.IAQIndex);
    return sensor.IAQIndex;
  };

  const renderShapes = () => {
    return coordinates.map((coord, index) => {
      const IAQIndex = getSensorIAQValue(coord.id);
      const ringColor = getIAQColor(IAQIndex);
      return (
        <div
          key={`coord-${index}`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => {
            if (token) {
              handleClick(coord.id);
            } else {
              openPopup();
            }
          }}
          style={{
            position: "absolute",
            top: `${coord.y}px`,
            left: `${coord.x}px`,
            width: "16px",
            height: "16px",
            backgroundColor: ringColor,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            cursor: "pointer",
            zIndex: "11",
          }}
          className="animated-shape"
        >
          <div
            className={styles.ring}
            style={{
              borderColor: ringColor,
            }}
          ></div>
          <div
            className={styles.ring}
            style={{
              borderColor: ringColor,
            }}
          ></div>
          {hoveredIndex === index && (
            <div
              className={styles.hoverBox}
              style={{
                [coord.id === "6144" ||
                coord.id === "6119" ||
                coord.id === "3173" ||
                coord.id === "3115"
                  ? "bottom"
                  : "top"]:
                  coord.id === "5147" || coord.id === "4142" ? "20%" : "-100%",
              }}
            >
              <div className={styles.roomName}>{coord.id} 강의실</div>
              <hr
                style={{
                  margin: "4px 4px 20px 4px",
                }}
              />
              <SensorDetail
                coord={coordinates[hoveredIndex]}
                hoveredIndex={hoveredIndex}
              />
            </div>
          )}
        </div>
      );
    });
  };
  const renderFloorCoordinates = () => {
    return floorcoordinates.map(({ floor, top, left }, index) => (
      <div
        key={`floor-${index}`}
        onMouseEnter={() => setHoveredFloor(floor)}
        onMouseLeave={() => setHoveredFloor(null)}
        onClick={() => {
          if (token) {
            handleFloorClick(floor);
          } else {
            openPopup();
          }
        }}
        className={styles.hovered}
        style={{
          top: top,
          left: left,
        }}
        title={`Go to Floor ${floor}`}
      >
        {hoveredFloor === floor && (
          <div className={styles.hoveredFloor}>{floor}층으로 이동하기</div>
        )}
      </div>
    ));
  };

  return (
    <div>
      <Header />
      <div className={styles.mainContainer}>
        {showMessage && (
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
        {selectedBuilding === "신공학관" && (
          <div className={styles.topMessage} style={{ width: "400px" }}>
            <img
              src={currentbuilding}
              alt="현재 건물"
              style={{ width: "80px", height: "84px", marginRight: "16px" }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className={styles.topMessageDetail}>신공학관</div>
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
          <div className={styles.buildings}>
            <div
              className={`${styles.building} ${
                selectedBuilding === "신공학관" ? styles.fadeOut : ""
              }`}
              onClick={() => openshowNoSensorPopup()}
            >
              <img src={jungbo} alt="정보문화관 P" />
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
                selectedBuilding !== null && selectedBuilding !== "신공학관"
                  ? styles.fadeOut
                  : ""
              } ${selectedBuilding === "신공학관" ? styles.moveLeft : ""}`}
              onClick={() => handleBuildingClick("신공학관", null)}
              onMouseEnter={(e) => {
                if (selectedBuilding === "신공학관") {
                  e.preventDefault();
                }
              }}
            >
              <img src={singong} alt="신공학관" />
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
              onClick={() => openshowNoSensorPopup()}
            >
              <img src={wonheung} alt="원흥관" />
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

            {selectedBuilding === "신공학관" && (
              <div className={styles.additionalContent}>
                <div className={styles.selectedBuildingImage}>
                  <img
                    src={floorplan}
                    alt="신공학관 도면도"
                    ref={imageRef}
                    style={{
                      width: "640px",
                      height: "640px",
                    }}
                  />
                  {renderShapes()}
                  {renderFloorCoordinates()}
                </div>
              </div>
            )}
          </div>
          <div
            className={styles.weatherAndLogs}
            style={{ position: "relative" }}
          >
            <WeatherInfo
              forecast={forecast}
              forecast2={forecast2}
              loading={loadingdata}
              dateTime={dateTime}
            />
            <div className={styles.sensorLogs}>
              <h3
                style={{
                  fontSize: "clamp(15px, 1.6vw, 20px)",
                }}
              >
                <img
                  src={logsensor}
                  alt="센서 아이콘"
                  className={styles.icons}
                />
                센서 수치 이상 로그 기록
              </h3>
              {renderSensorLogs()}
            </div>
          </div>
        </div>
        {popupContent && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <h2>알 림</h2>
              <div className={styles.dividers}></div>
              <p>{popupContent}</p>
              <div className={styles.divider}></div>
              <p className={styles.signupText}>
                <button
                  onClick={() => (window.location.href = "/contact")}
                  className={styles.popupButton}
                >
                  등록하기
                </button>
                <button onClick={closePopup} className={styles.popupButton}>
                  닫기
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
      {showPopup && (
        <Popup
          popupContent="로그인이 필요한 서비스입니다."
          onClose={closePopupHandler}
          registerLink="/login"
          buttonText="로그인"
        />
      )}

      {showNoSensorPopup &&
        (token ? (
          <Popup
            popupContent="해당 건물에 등록된 센서가 없습니다.등록하시겠습니까?"
            onClose={closeshowNoSensorPopupHandler}
            registerLink="/manager"
            buttonText="등록하기"
          />
        ) : (
          <Popup
            popupContent="해당 건물에 등록된 센서가 없습니다.등록을 원하시면 로그인해주세요."
            onClose={closeshowNoSensorPopupHandler}
            registerLink="/login"
            buttonText="로그인"
          />
        ))}
    </div>
  );
}
export default Main;
