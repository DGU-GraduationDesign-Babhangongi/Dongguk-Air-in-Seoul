/*Main.js*/
import React, { useState, useEffect, useRef, useContext } from "react";
import Header from "../components/common/Header/Header";
import styles from "./Main.module.css";
import { fetchForeCast, fetchForeCast2 } from "../pages/forecast";
import { SensorDataContext } from "./../API/SensorDataContext";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../API/api";
/*images*/
import sunIcon from "../assets/images/main/sun_icon.png";
import cloudyIcon from "../assets/images/main/cloudy_icon.png";
import semicloudyIcon from "../assets/images/main/semicloudy_icon.png";
import cloudyrainIcon from "../assets/images/main/cloudyrain_icon.png";
import moisture from "../assets/images/main/hoverBoxIcons/img_mois.png";
import noise from "../assets/images/main/hoverBoxIcons/img_noise.png";
import pm25 from "../assets/images/main/hoverBoxIcons/img_pm2.5.png";
import sensor from "../assets/images/main/hoverBoxIcons/img_sensor.png";
import temperature from "../assets/images/main/hoverBoxIcons/img_temp.png";
import tvoc from "../assets/images/main/hoverBoxIcons/img_tvoc.png";
import weatherlocation from "../assets/images/main/location_icon.png";
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
  const [dateTime, setDateTime] = useState(new Date());
  const [forecast, setForecast] = useState(null);
  const [forecast2, setForecast2] = useState(null);
  const [loadingdata, setLoading] = useState(true);
  const [hoveredFloor, setHoveredFloor] = useState(null); // 현재 호버 중인 층
  const [allSensorData, setAllSensorData] = useState([]); // 모든 강의실 데이터 저장
  const [nickname, setNickname] = useState("사용자"); // 닉네임 기본값 설정
  const [sensorLogs, setSensorLogs] = useState([]); //이상수치값
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
        return "black"; // 기본 색상
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

  // 컴포넌트가 마운트될 때 데이터 가져오기
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

  // 센서 수치 이상 로그 렌더링 함수
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

          // 센서 타입에 따른 단위 설정
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
                return ""; // 단위가 없는 경우
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
                    color: getLevelColor(log.level), // level에 따른 색상 적용
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
            setNickname(response.data || "사용자");
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
      setFadeOut(true); // 나머지 건물들을 fade out 시킴
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
  // 날씨 안내 멘트 생성 함수
  const getWeatherAdvice = () => {
    if (!forecast || !forecast2) {
      return "날씨 데이터를 불러오는 중입니다.";
    }
    if (forecast.rain === "1") {
      return "오늘은 하루 종일 비가 예상됩니다\n외출 시 우산을 챙기세요";
    } else if (forecast.rain === "3") {
      return "눈이 오는 날입니다\n외출 시 따뜻하게 입으세요";
    } else if (forecast.rain === "2") {
      return "오늘은 비와 눈이 섞여 내릴 수 있습니다\n미끄럼에 주의하세요";
    } else if (forecast.cloudy === "1") {
      return "맑은 날씨입니다\n야외 활동을 즐기기 좋은 날이에요!";
    } else if (forecast.cloudy === "3") {
      return "햇살이 구름 사이로 드문드문 비추고 있어요\n산책이나 가벼운 야외 활동을 즐겨보세요!";
    } else if (forecast.cloudy === "4") {
      return "흐린 날씨입니다\n실내 활동을 계획해보세요";
    } else if (forecast.humidity < 30) {
      return "건조한 날씨입니다\n수분 보충에 유의하세요";
    } else if (forecast2.maxTemp >= 30) {
      return "무더운 날씨가 예상됩니다\n시원한 곳에서 휴식을 취하세요";
    } else if (forecast2.minTemp <= 5) {
      return "추운 날씨입니다\n따뜻한 옷차림을 준비하세요";
    } else {
      return "오늘의 날씨에 맞게 계획을 세워보세요!";
    }
  };
  // Format the date and time
  const formatDate = (date) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = days[date.getDay()];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}년 ${month}월 ${day}일 ${dayOfWeek} KST ${hours}:${minutes}`;
  };
  // Fetch weather data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const weatherData = await fetchForeCast(60, 127);
        const weatherData2 = await fetchForeCast2(60, 127);
        setForecast(weatherData);
        setForecast2(weatherData2);
        setLoading(false);
      } catch (error) {
        // console.error("Error fetching weather data: ", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const imageRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [sensorData, setSensorData] = useState(null); // 센서 데이터 상태 추가

  const { loading } = useContext(SensorDataContext);

  // 좌표 저장
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
    // 클릭 시 해당 강의실 페이지로 이동
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
        // 모든 강의실 ID에 대한 데이터를 요청
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

  const getTemperatureColor = (value) => {
    if (value < 16.5 || value > 27.5) return "#F44336";
    if ((value >= 16.5 && value < 17.6) || (value > 26.4 && value <= 27.5))
      return "#FF9800";
    if ((value >= 17.6 && value < 18.7) || (value > 25.3 && value <= 26.4))
      return "#FFEB3B";
    if ((value >= 18.7 && value < 19.8) || (value > 24.2 && value <= 25.3))
      return "#8BC34A";
    return "#5C82F5";
  };

  const getHumidityColor = (value) => {
    if (value < 10 || value > 90) return "#F44336";
    if ((value >= 10 && value < 20) || (value > 80 && value <= 90))
      return "#FF9800";
    if ((value >= 20 && value < 30) || (value > 70 && value <= 80))
      return "#FFEB3B";
    if ((value >= 30 && value < 40) || (value > 60 && value <= 70))
      return "#8BC34A";
    return "#5C82F5";
  };

  const getTVOCColor = (value) => {
    if (value > 10000) return "#F44336";
    if (value > 3000 && value <= 10000) return "#FF9800";
    if (value > 1000 && value <= 3000) return "#FFEB3B";
    if (value > 300 && value <= 1000) return "#8BC34A";
    return "#5C82F5";
  };

  const getPM25Color = (value) => {
    if (value > 64) return "#F44336";
    if (value > 53 && value <= 64) return "#FF9800";
    if (value > 41 && value <= 53) return "#FFEB3B";
    if (value > 23 && value <= 41) return "#8BC34A";
    return "#5C82F5";
  };

  const getNoiseColor = (value) => {
    if (value > 80) return "#F44336";
    if (value > 70 && value <= 80) return "#FF9800";
    if (value > 60 && value <= 70) return "#FFEB3B";
    if (value > 50 && value <= 60) return "#8BC34A";
    return "#5C82F5";
  };

  const getIAQColor = (value) => {
    if (value > 90) return "#5C82F5";
    if (value > 80 && value <= 90) return "#8BC34A";
    if (value > 70 && value <= 80) return "#FFEB3B";
    if (value > 60 && value <= 70) return "#FF9800";
    return "#F44336";
  };

  // 센서 타입에 따라 적절한 색상 반환
  const getStatusColor = (value, type) => {
    if (type === "temperature") return getTemperatureColor(value);
    if (type === "humidity") return getHumidityColor(value);
    if (type === "tvoc") return getTVOCColor(value);
    if (type === "pm25") return getPM25Color(value);
    if (type === "noise") return getNoiseColor(value);
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
              {sensorData ? (
                <>
                  <div className={styles.sensorText}>
                    <img
                      src={temperature}
                      alt="온도"
                      className={styles.sensorImg}
                    />
                    <span>온도</span>
                    <span style={{ marginLeft: "auto" }}>
                      {loading ? "--" : `${sensorData.Temperature?.value}°C`}
                    </span>
                    <span
                      className={styles.statusLight}
                      style={{
                        backgroundColor: getStatusColor(
                          sensorData.Temperature?.value,
                          "temperature"
                        ),
                      }}
                    ></span>
                  </div>
                  <div className={styles.sensorText}>
                    <img
                      src={moisture}
                      alt="습도"
                      className={styles.sensorImg}
                    />
                    <span>습도</span>
                    <span style={{ marginLeft: "auto" }}>
                      {loading ? "--" : `${sensorData.Humidity?.value}%`}
                    </span>
                    <span
                      className={styles.statusLight}
                      style={{
                        backgroundColor: getStatusColor(
                          sensorData.Humidity?.value,
                          "humidity"
                        ),
                      }}
                    ></span>
                  </div>
                  <div className={styles.sensorText}>
                    <img src={tvoc} alt="TVOC" className={styles.sensorImg} />
                    <span>TVOC</span>
                    <span style={{ marginLeft: "auto" }}>
                      {loading ? "--" : `${sensorData.TVOC?.value}㎍/m³`}
                    </span>
                    <span
                      className={styles.statusLight}
                      style={{
                        backgroundColor: getStatusColor(
                          sensorData.TVOC?.value,
                          "tvoc"
                        ),
                      }}
                    ></span>
                  </div>
                  <div className={styles.sensorText}>
                    <img src={pm25} alt="PM2.5" className={styles.sensorImg} />
                    <span>PM 2.5</span>
                    <span style={{ marginLeft: "auto" }}>
                      {loading
                        ? "--"
                        : `${sensorData.PM2_5MassConcentration?.value}㎍/m³`}
                    </span>
                    <span
                      className={styles.statusLight}
                      style={{
                        backgroundColor: getStatusColor(
                          sensorData.PM2_5MassConcentration?.value,
                          "pm25"
                        ),
                      }}
                    ></span>
                  </div>
                  <div className={styles.sensorText}>
                    <img src={noise} alt="소음" className={styles.sensorImg} />
                    <span>소음</span>
                    <span style={{ marginLeft: "auto" }}>
                      {loading ? "--" : `${sensorData.AmbientNoise?.value}db`}
                    </span>
                    <span
                      className={styles.statusLight}
                      style={{
                        backgroundColor: getStatusColor(
                          sensorData.AmbientNoise?.value,
                          "noise"
                        ),
                      }}
                    ></span>
                  </div>
                  <div className={styles.sensorText}>
                    <img
                      src={sensor}
                      alt="센서 상태"
                      className={styles.sensorImg}
                    />
                    <span>센서 상태</span>
                    <span style={{ marginLeft: "auto" }}>
                      {loading ? "--" : "ON"}
                    </span>
                    <span className={styles.sensorStatus}></span>
                  </div>
                </>
              ) : (
                <>센서 값을 불러오는 중 . . .</>
              )}
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
        {/* 환영 메시지 */}
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
            <div className={styles.weatherInfo}>
              <h3
                style={{
                  fontSize: "clamp(15px, 1.6vw, 20px)",
                }}
              >
                <img
                  src={weatherlocation}
                  alt="현재 위치"
                  style={{
                    width: "clamp(20px, 2vw, 50px)",
                    marginRight: "8px",
                    marginBottom: "-8px",
                  }}
                />
                서울 중구 필동
              </h3>

              {loadingdata ? (
                <p>Loading weather data...</p>
              ) : forecast && forecast2 ? (
                <>
                  <div className={styles.weatherloading}>
                    {/* 날씨 상태에 따른 이미지 */}
                    <img
                      src={
                        forecast.rain >= "1"
                          ? cloudyrainIcon
                          : forecast.cloudy === "1"
                          ? sunIcon
                          : forecast.cloudy === "3"
                          ? semicloudyIcon
                          : cloudyIcon
                      }
                      alt="날씨 이미지"
                      className={styles.weatherImg}
                    />
                    <h1 className={styles.weatherTemperature}>
                      {forecast.temperature}°C
                    </h1>
                  </div>
                  <p className={styles.weatherRain}>
                    {forecast.rain >= "1"
                      ? "흐리고 비"
                      : forecast.cloudy === "1"
                      ? "맑음"
                      : forecast.cloudy === "3"
                      ? "구름많음"
                      : "흐림"}
                  </p>
                  <p className={styles.weatherMinMax}>
                    최고 {forecast2.maxTemp}°C / 최저 {forecast2.minTemp}°C
                    <span style={{ marginLeft: "0.5vw" }}>
                      습도 {forecast.humidity}%
                    </span>
                  </p>
                  <p className={styles.weatherMinMax2}>
                    {" "}
                    {formatDate(dateTime)}
                  </p>
                  <p
                    className={styles.weatherAdvice}
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <p className={styles.weatherAdvice}>{getWeatherAdvice()}</p>
                  </p>
                </>
              ) : (
                <p>데이터를 불러오는 중입니다.</p>
              )}
            </div>

            <div className={styles.sensorLogs}>
              <h3
                style={{
                  fontSize: "clamp(15px, 1.6vw, 20px)",
                }}
              >
                <img
                  src={logsensor}
                  alt="센서 아이콘"
                  style={{
                    width: "clamp(20px, 2vw, 50px)",
                    marginRight: "8px",
                    marginBottom: "-8px",
                  }}
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
          onClose={closePopupHandler} // 팝업 닫기 함수
          registerLink="/login"
          buttonText="로그인"
        />
      )}

      {showNoSensorPopup &&
        (token ? (
          <Popup
            popupContent="해당 건물에 등록된 센서가 없습니다.등록하시겠습니까?"
            onClose={closeshowNoSensorPopupHandler} // 팝업 닫기 함수
            registerLink="/manager" // 센서 등록 페이지로 링크
            buttonText="등록하기"
          />
        ) : (
          <Popup
            popupContent="해당 건물에 등록된 센서가 없습니다.등록을 원하시면 로그인해주세요."
            onClose={closeshowNoSensorPopupHandler} // 팝업 닫기 함수
            registerLink="/login" // 홈 페이지로 링크
            buttonText="로그인"
          />
        ))}
    </div>
  );
}
export default Main;
