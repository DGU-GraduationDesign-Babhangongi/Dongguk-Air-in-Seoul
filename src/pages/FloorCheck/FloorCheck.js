/*층별 강의실 수치 확인*/
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useParams와 useNavigate 가져오기
import Header from "../../components/common/Header/Header";
import SideBar from "../../components/common/SideBar/SideBar";
import styles from "./FloorCheck.module.css";
import AirQualityIndicator from "../../components/common/AirQualityIndicator/AirQualityIndicator";
import API from "../../API/api";

function FloorCheck() {
  const { floor } = useParams(); // URL에서 floor 값을 가져옴
  const navigate = useNavigate(); // navigate 사용
  const currentFloor = parseInt(floor, 10); // floor 값을 정수로 변환
  const roomIds = ["3115", "3173", "4142", "5145", "5147", "6119", "6144"];
  const currentFloorRooms = roomIds.filter((Id) => Id.startsWith(currentFloor)); // 현재 층에 해당하는 강의실 필터링
  const [iaqValues, setIaqValues] = useState([]);
  const [allSensorData, setAllSensorData] = useState([]); // 모든 강의실 데이터 저장

  const getImageSrc = (iaq) =>
    iaq >= 86
      ? require("../../assets/images/smartmirror/good.png")
      : iaq >= 71
      ? require("../../assets/images/smartmirror/average.png")
      : require("../../assets/images/smartmirror/bad.png");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // token 없으면 '/'로 리다이렉트
    }
  }, [navigate]);

  // 좌표별 색상 결정 함수 추가
  const getColor = (iaq) => {
    if (iaq === null) return "#9E9E9E";
    if (iaq >= 90) return "#5C82F5";
    if (iaq >= 80) return "#8BC34A";
    if (iaq >= 70) return "#FFEB3B";
    if (iaq >= 60) return "#FF9800";
    else return "#F44336";
  };

  // 층별 이미지 경로 정의
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
        // 모든 강의실 데이터를 가져오기
        const allCoords = Object.values(coordinates).flat(); // 모든 좌표를 하나의 배열로 합침
        const responses = await Promise.all(
          allCoords.map(async (coord) => {
            const endpoint = `/api/sensorData/recent/classroom?building=신공학관&name${encodeURIComponent()}&name=${encodeURIComponent(
              coord.id
            )}`;
            const response = await API.get(endpoint);
            return {
              roomId: coord.id,
              IAQIndex: response.data?.IAQIndex?.value || "--",
            };
          })
        );
        setAllSensorData(responses);
        console.log("모든 센서 데이터:", responses);
      } catch (error) {
        console.error("Error fetching all sensor data:", error);
      }
    };

    fetchAllSensorData();
  }, []);

  const getSensorIAQValue = (roomId) => {
    const sensor = allSensorData.find((data) => data.roomId === roomId);
    if (!sensor || sensor.IAQIndex === "--") {
      console.warn(`ID: ${roomId}에 대한 IAQIndex 데이터 없음.`);
      return "--";
    }

    console.log(`강의실 ID: ${roomId}, IAQIndex:`, sensor.IAQIndex);
    return sensor.IAQIndex;
  };

  // 버튼 클릭 시 URL 변경
  const handleFloorChange = (selectedFloor) => {
    navigate(`/floorcheck/${selectedFloor}`); // 선택한 층으로 URL 변경
  };

  return (
    <div>
      <Header />
      <div style={{ display: "flex" }}>
        <SideBar i="3" /> {/* 사이드바 */}
        <div className={styles.container}>
          <div className={styles.floorTitle}>
            {currentFloor}층 강의실 구조도
          </div>
          <div className={styles.main}>
            <div className={styles.floorMapContainer}>
              <div className={styles.floorMap}>
                <img
                  src={floorImages[currentFloor]} // 현재 층 이미지
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
                        zIndex: 10, // 이미지 위에 표시되도록 설정
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
                      onClick={() => handleFloorChange(floor)} // 버튼 클릭 시 URL 변경
                      style={{
                        backgroundColor:
                          currentFloor === floor ? "#ffd690" : "#fff1d9",
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
                // iaqValues에서 해당 roomId의 데이터를 찾기
                const roomData = iaqValues.find(
                  (data) => data.roomId === roomId
                );
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
                        src={getImageSrc(IAQIndex)} // 평균값에 따라 이미지 설정
                        alt={
                          IAQIndex >= 86
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
                        {IAQIndex}점
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
