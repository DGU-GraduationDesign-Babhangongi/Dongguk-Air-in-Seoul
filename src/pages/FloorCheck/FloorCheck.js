/*층별 강의실 수치 확인*/
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/common/Header/Header";
import SideBar from "../../components/common/SideBar/SideBar";
import styles from "./FloorCheck.module.css";
import AirQualityIndicator from "../../components/common/AirQualityIndicator/AirQualityIndicator";
import API from "../../API/api";
/*images*/
import goodImg from "../../assets/images/smartmirror/good.png";
import averageImg from "../../assets/images/smartmirror/average.png";
import badImg from "../../assets/images/smartmirror/bad.png";
import loadingImg from "../../assets/images/smartmirror/loading.png";

function FloorCheck() {
  const { floor } = useParams(); // URL에서 floor 값을 가져옴
  const navigate = useNavigate(); // navigate 사용
  const currentFloor = parseInt(floor, 10); // floor 값을 정수로 변환
  const roomIds = ["3115", "3173", "4142", "5145", "5147", "6119", "6144"];
  const currentFloorRooms = roomIds.filter((Id) => Id.startsWith(currentFloor)); // 현재 층에 해당하는 강의실 필터링
  const [allSensorData, setAllSensorData] = useState([]);

  const getImageSrc = (iaq) => {
    if (iaq === "loading . . .") {
      return loadingImg;
    }
    return iaq >= 86 ? goodImg : iaq >= 71 ? averageImg : badImg;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // 좌표별 색상 결정 함수
  const getColor = (iaq) => {
    if (iaq === null) return "#9E9E9E";
    if (iaq >= 90) return "#5C82F5";
    if (iaq >= 80) return "#8BC34A";
    if (iaq >= 70) return "#FFEB3B";
    if (iaq >= 60) return "#FF9800";
    else return "#9E9E9E";
  };

  const floorImages = {
    3: "/FloorPlan/3층.png",
    4: "/FloorPlan/4층.png",
    5: "/FloorPlan/5층.png",
    6: "/FloorPlan/6층.png",
  };

  const coordinates = {
    3: [
      { id: "3115", x: 0, y: 212 },
      { id: "3173", x: 168, y: 172 },
    ],
    4: [{ id: "4142", x: 238, y: 482 }],
    5: [
      { id: "5145", x: 68, y: 482 },
      { id: "5147", x: 156, y: 482 },
    ],
    6: [
      { id: "6119", x: 278, y: 32 },
      { id: "6144", x: 180, y: 482 },
    ],
  };
  useEffect(() => {
    const fetchAllSensorData = async () => {
      try {
        const allCoords = Object.values(coordinates).flat();
        const responses = await Promise.all(
          allCoords.map(async (coord) => {
            const endpoint = `/api/sensorData/recent/classroom?building=신공학관&name${encodeURIComponent()}&name=${encodeURIComponent(
              coord.id
            )}`;
            const response = await API.get(endpoint);
            return {
              roomId: coord.id,
              IAQIndex: response.data?.IAQIndex?.value || "loading . . .",
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

  const getSensorIAQValue = (roomId) => {
    if (!Array.isArray(allSensorData)) return "--";
    const sensor = allSensorData.find((data) => data.roomId === roomId);
    return sensor?.IAQIndex || "loading . . .";
  };

  const handleFloorChange = (selectedFloor) => {
    navigate(`/floorcheck/${selectedFloor}`);
  };

  return (
    <div>
      <Header />
      <div style={{ display: "flex" }}>
        <SideBar i="3" />
        <div className={styles.container}>
          <div className={styles.floorTitle}>
            {currentFloor}층 강의실 구조도
          </div>
          <div className={styles.main}>
            <div className={styles.floorMapContainer}>
              <div className={styles.floorMap}>
                <img
                  src={floorImages[currentFloor]}
                  alt={`${currentFloor}층 구조도`}
                  className={styles.mapImage}
                />
                <div style={{ position: "absolute", top: 0, left: 0 }}>
                  {coordinates[currentFloor]?.map(({ id, x, y }) => (
                    <div
                      key={id}
                      className={styles.coordinateDot}
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        zIndex: 10,
                      }}
                    >
                      <div className={styles.ring} s></div>
                      <div className={styles.ring}></div>
                      <div className={styles.dot}></div>
                      <span className={styles.roomId}>{id}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.floorButtons}>
                  {[3, 4, 5, 6].map((floor) => (
                    <button
                      key={floor}
                      className={styles.floorButton}
                      onClick={() => handleFloorChange(floor)}
                      style={{
                        backgroundColor:
                          currentFloor === floor ? "#FFC557" : "#FFEAC2",
                        color: currentFloor === floor ? "black" : "#5f5f5f",
                      }}
                    >
                      {floor}층
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.infoPanels}>
              {currentFloorRooms.map((roomId) => {
                const IAQIndex = getSensorIAQValue(roomId);
                return (
                  <div className={styles.infoPanel} key={roomId}>
                    <h2
                      style={{
                        margin: "8px 8px 24px 8px",
                        fontSize: "28px",
                      }}
                    >
                      {roomId} 강의실
                    </h2>
                    <hr
                      style={{
                        margin: "8px 8px 24px 8px",
                      }}
                    />
                    <div
                      style={{
                        width: "180%",
                        margin: "6%",
                      }}
                    >
                      <AirQualityIndicator classRoom={roomId} />
                    </div>
                    <hr
                      style={{
                        margin: "24px 4px 12px 4px",
                      }}
                    />
                    <div className={styles.averageIAQ}>
                      <img
                        src={getImageSrc(IAQIndex)}
                        alt={
                          IAQIndex === "loading . . ."
                            ? "loading"
                            : IAQIndex >= 86
                            ? "good"
                            : IAQIndex >= 71
                            ? "average"
                            : "bad"
                        }
                        style={{ width: "40%" }}
                      />
                      <div
                        className={styles.IAQscore}
                        style={{ color: getColor(IAQIndex) }}
                      >
                        {IAQIndex === "loading . . ." ? (
                          <span style={{ fontSize: "12px", color: "gray" }}>
                            {IAQIndex}
                          </span>
                        ) : (
                          `${IAQIndex}점`
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloorCheck;
