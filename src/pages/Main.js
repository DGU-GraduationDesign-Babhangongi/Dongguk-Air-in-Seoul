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

function Main() {
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
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("사용자"); // 닉네임 기본값 설정

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
          console.error("닉네임을 불러오는 데 실패했습니다:", error);
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
        console.error("Error fetching weather data: ", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const location = useLocation();
  const Id = location.pathname.split("/").pop(); // URL에서 ID 가져오기

  const imageRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [sensorData, setSensorData] = useState(null); // 센서 데이터 상태 추가

  const { data, setSelectedSensorName, loading, error } =
    useContext(SensorDataContext);

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
    { floor: 3, x: 28, y: 520 },
    { floor: 4, x: 28, y: 390 },
    { floor: 5, x: 28, y: 260 },
    { floor: 6, x: 28, y: 128 },
  ];
  const handleFloorClick = (floor) => {
    navigate(`/floorcheck/${floor}`);
  };

  useEffect(() => {
    const fetchSensorData = async () => {
      if (hoveredIndex !== null) {
        const hoveredCoord = coordinates[hoveredIndex];
        if (!hoveredCoord) return; // hoveredCoord가 없을 경우 반환
        try {
          const endpoint = `/api/sensorData/recent/classroom?building=${encodeURIComponent(
            hoveredCoord.building
          )}&name=${encodeURIComponent(hoveredCoord.id)}`;
          console.log("API 요청 URL: ", endpoint);
          const response = await API.get(endpoint);
          setSensorData(response.data); // API에서 가져온 데이터 설정
          console.log(
            `Fetched sensor data for ${hoveredCoord.id}`,
            response.data
          );
        } catch (error) {
          console.error("Error fetching sensor data:", error);
          setSensorData(null);
        }
      } else {
        setSensorData(null);
      }
    };
    fetchSensorData();
  }, [hoveredIndex]); // hoveredIndex 변경 시마다 데이터 요청

  const getTemperatureColor = (value) => {
    if (value < 16.5 || value > 27.5) return "red";
    if ((value >= 16.5 && value < 17.6) || (value > 26.4 && value <= 27.5))
      return "orange";
    if ((value >= 17.6 && value < 18.7) || (value > 25.3 && value <= 26.4))
      return "yellow";
    if ((value >= 18.7 && value < 19.8) || (value > 24.2 && value <= 25.3))
      return "green";
    return "blue";
  };

  const getHumidityColor = (value) => {
    if (value < 10 || value > 90) return "red";
    if ((value >= 10 && value < 20) || (value > 80 && value <= 90))
      return "orange";
    if ((value >= 20 && value < 30) || (value > 70 && value <= 80))
      return "yellow";
    if ((value >= 30 && value < 40) || (value > 60 && value <= 70))
      return "green";
    return "blue";
  };

  const getTVOCColor = (value) => {
    if (value > 10000) return "red";
    if (value > 3000 && value <= 10000) return "orange";
    if (value > 1000 && value <= 3000) return "yellow";
    if (value > 300 && value <= 1000) return "green";
    return "blue";
  };

  const getPM25Color = (value) => {
    if (value > 64) return "red";
    if (value > 53 && value <= 64) return "orange";
    if (value > 41 && value <= 53) return "yellow";
    if (value > 23 && value <= 41) return "green";
    return "blue";
  };

  const getNoiseColor = (value) => {
    if (value > 80) return "red";
    if (value > 70 && value <= 80) return "orange";
    if (value > 60 && value <= 70) return "yellow";
    if (value > 50 && value <= 60) return "green";
    return "blue";
  };

  // 센서 타입에 따라 적절한 색상 반환
  const getStatusColor = (value, type) => {
    if (type === "temperature") return getTemperatureColor(value);
    if (type === "humidity") return getHumidityColor(value);
    if (type === "tvoc") return getTVOCColor(value);
    if (type === "pm25") return getPM25Color(value);
    if (type === "noise") return getNoiseColor(value);
    return "blue"; // 기본값
  };

  // 각 항목에 해당하는 상태 색상을 가져오는 함수
  const renderSensorItem = (label, value, iconSrc, type) => (
    <div className={styles.sensorText}>
      <img src={iconSrc} alt={label} className={styles.sensorImg} />
      <span>{label}</span>
      <span style={{ marginLeft: "auto" }}>{value ?? "--"}</span>
      <span
        className={styles.statusLight}
        style={{
          backgroundColor: getStatusColor(value, type), // 상태에 따라 색상 변경
        }}
      ></span>
    </div>
  );

  const getSensorIAQValue = (id) => {
    if (!Array.isArray(data)) {
      console.warn("data가 배열이 아님:", data);
      return "--";
    }
    const sensor = data.find((sensor) => sensor.name === id); // `name` 속성으로 매칭
    console.log(`강의실 ID: ${id}, 센서 데이터:`, sensor); // 각 강의실 ID별 데이터 확인
    return sensor ? sensor.IAQIndex?.value || "--" : "--"; // 데이터가 없으면 "--" 반환
  };

  // 좌표별 색상 결정 함수 추가
  const getColor = (IAQvalue) => {
    if (IAQvalue === null) return "gray";
    if (IAQvalue >= 90) return "green";
    if (IAQvalue >= 80) return "orange";
    else return "red";
  };

  // 도형을 표시하는 함수
  const renderShapes = () => {
    return coordinates.map((coord, index) => {
      const IAQvalue = getSensorIAQValue(coord.id); // 강의실 번호에 맞는 IAQ 값 가져오기
      const ringColor = getStatusColor(IAQvalue, "iaq"); // IAQ 값에 따라 링 색상 설정

      return (
        <div
          key={`coord-${index}`}
          onMouseEnter={() => setHoveredIndex(index)} // 마우스 진입 시 인덱스 설정
          onMouseLeave={() => setHoveredIndex(null)} // 마우스 나가면 초기화
          onClick={() => handleClick(coord.id)}
          style={{
            position: "absolute",
            top: `${coord.y}px`,
            left: `${coord.x}px`,
            width: "16px",
            height: "16px",
            backgroundColor: getStatusColor(IAQvalue, "iaq"),
            borderRadius: "50%",
            transform: "translate(-50%, -50%)", // 중앙 정렬
            cursor: "pointer",
            zIndex: "11",
          }}
          className="animated-shape"
        >
          <div
            className={styles.ring}
            style={{
              borderColor: ringColor, // IAQ 값에 맞는 색상 적용
            }}
          ></div>
          <div
            className={styles.ring}
            style={{
              borderColor: ringColor, // IAQ 값에 맞는 색상 적용
              width: "52px",
              height: "52px",
              animationDelay: "0.75s",
            }}
          ></div>
          {/* 호버 시 표시할 박스 */}
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
              {/* 강의실 이름 */}
              <div
                style={{
                  fontWeight: "500",
                  textShadow: "1.5px 1.5px 1.5px lightgray",
                  fontSize: "1.5rem",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                {coord.id} 강의실
              </div>
              <hr
                style={{
                  margin: "4px 4px 20px 4px",
                }}
              />
              {/* 각 항목 표시 */}
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
                          "pm2.5"
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
                    <span
                      style={{
                        backgroundColor: "green",
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        marginLeft: "16px", // 왼쪽에 간격 추가
                        boxShadow:
                          "0 4px 8px rgba(0, 0, 0, 0.261)" /* 부드러운 그림자 */,
                      }}
                    ></span>
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
    return floorcoordinates.map(({ floor, x, y }, index) => (
      <div
        key={`floor-${index}`}
        onMouseEnter={() => setHoveredFloor(floor)} // 호버 시 층 설정
        onMouseLeave={() => setHoveredFloor(null)} // 호버 종료 시 초기화
        onClick={() => handleFloorClick(floor)}
        style={{
          position: "absolute",
          top: `${y}px`,
          left: `${x}px`,
          width: "20px",
          height: "20px",
          cursor: "pointer",
          zIndex: "101",
        }}
        title={`Go to Floor ${floor}`}
      >
        {hoveredFloor === floor && (
          <div
            style={{
              position: "absolute",
              top: "-30px", // 좌표 기준 위에 표시
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "black",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          >
            {floor}층으로 이동하기
          </div>
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
              <div
                className={styles.topMessageDetail}
                style={{
                  fontSize: "44px",
                  textShadow: "3px 3px 1.5px lightgray",
                  marginTop: "44px",
                }}
              >
                신공학관
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "16px",
                  marginTop: "10px",
                  zIndex: 10,
                }}
              >
                <span
                  onClick={() => (window.location.href = "/")}
                  onMouseEnter={(e) => {
                    e.target.style.color = "black"; // 호버 시 색상 변경
                    e.target.style.textDecoration = "underline"; // 호버 시 밑줄 추가
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "gray"; // 원래 색상으로 복원
                    e.target.style.textDecoration = "none"; // 밑줄 제거
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
          {/* 건물 섹션 */}
          <div className={styles.buildings}>
            <div
              className={`${styles.building} ${
                selectedBuilding === "신공학관" ? styles.fadeOut : ""
              }`}
              onClick={() =>
                handleBuildingClick(
                  "정보문화관 P",
                  <p>
                    현재 정보문화관 P에는
                    <br />
                    등록된 센서가 없습니다.
                    <br />
                    센서를 등록하시겠습니까?
                  </p>
                )
              }
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
                  e.preventDefault(); // hover 방지
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
              onClick={() =>
                handleBuildingClick(
                  "원흥관",
                  <p>
                    현재 원흥관에는
                    <br />
                    등록된 센서가 없습니다.
                    <br />
                    센서를 등록하시겠습니까?
                  </p>
                )
              }
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
            {/* 신공학관이 선택되었을 때 이미지 표시 */}
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

          {/* 오른쪽 날씨 및 로그 섹션 */}
          <div
            className={styles.weatherAndLogs}
            style={{ position: "relative" }}
          >
            <div className={styles.weatherInfo}>
              <h2
                style={{
                  fontSize: "clamp(15px, 1.6vw, 20px)",
                }}
              >
                <img
                  src={weatherlocation}
                  alt="위치 아이콘"
                  style={{
                    fontSize: "clamp(15px, 1.6vw, 25px)",
                    width: "clamp(20px, 2vw, 50px)",
                    marginRight: "0.5vw",
                    marginBottom: "-4px",
                  }} // 이미지 크기와 간격 조절
                />
                서울 중구 필동
              </h2>

              {loadingdata ? (
                <p>Loading weather data...</p>
              ) : forecast && forecast2 ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
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
                      style={{
                        width: "clamp(70px, 7vw, 200px)", // 이미지 크기 조정
                        filter: "drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.2))",
                      }}
                    />
                    <h1
                      className={styles.weatherTemperature}
                      style={{
                        fontSize: "clamp(25px, 3vw, 100px)",
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      {forecast.temperature}°C
                    </h1>
                  </div>

                  <p
                    className={styles.weatherRain}
                    style={{
                      fontSize: "2vw",
                      textAlign: "center",
                      color: "black",
                    }}
                  >
                    {forecast.rain >= "1"
                      ? "흐리고 비"
                      : forecast.cloudy === "1"
                      ? "맑음"
                      : forecast.cloudy === "3"
                      ? "구름많음"
                      : "흐림"}
                  </p>
                  <p
                    className={styles.weatherMinMax}
                    style={{
                      fontSize: "clamp(9px, 1vw, 13px)",
                      textAlign: "right",
                      fontWeight: "600",
                      marginTop: "10px",
                      color: "black",
                    }}
                  >
                    최고 {forecast2.maxTemp}°C / 최저 {forecast2.minTemp}°C
                    <span style={{ marginLeft: "0.5vw" }}>
                      습도 {forecast.humidity}%
                    </span>
                  </p>
                  <p
                    style={{
                      textAlign: "right",
                      fontSize: "clamp(9px, 1vw, 13px)",
                      marginBottom: "10px",
                      color: "black",
                    }}
                  >
                    {" "}
                    {formatDate(dateTime)}
                  </p>
                  <p
                    className={styles.weatherAdvice}
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <p
                      className={styles.weatherAdvice}
                      style={{
                        textAlign: "right",
                        whiteSpace: "pre-line", // 줄바꿈 적용
                        fontSize: "clamp(11px, 1.2vw, 18px)",
                        color: "black",
                      }}
                    >
                      {getWeatherAdvice()}
                    </p>
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
                  }} // 이미지 크기와 간격 조절
                />
                센서 수치 이상 로그 기록
              </h3>
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
          </div>
        </div>
        {popupContent && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <h2>알 림</h2>
              <div className={styles.dividers}></div>
              <p>{popupContent}</p>
              <div className={styles.divider}></div>
              <p
                className={styles.signupText}
                style={{
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  marginLeft: "16px",
                }}
              >
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
    </div>
  );
}

export default Main;
