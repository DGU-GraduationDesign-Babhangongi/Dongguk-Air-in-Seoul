import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/common/Header/Header";
import SideBar from "../../components/common/SideBar/SideBar";
import styles from "./FloorCheck.module.css";
import API from "../../API/api";

function FloorCheck() {
  const [currentFloor, setCurrentFloor] = useState(3);
  const [roomSensorData, setRoomSensorData] = useState({}); // 모든 강의실 센서 데이터를 저장할 객체
  const roomIds = ["3115", "3173", "4142", "5145", "5147", "6119", "6144"];
  const currentFloorRooms = roomIds.filter((Id) => Id.startsWith(currentFloor));
  const canvasRef = useRef(null);

  // 특정 강의실 ID에 대한 센서 데이터를 가져오는 함수
  const fetchSensorData = async (roomId) => {
    try {
      const response = await API.get(`/api/sensor/recent${roomId}`); // roomId를 포함하여 API 호출
      const data = await response.json();
      setRoomSensorData((prevData) => ({ ...prevData, [roomId]: data })); // 기존 데이터에 병합하여 저장
    } catch (error) {
      console.error(`Failed to fetch data for room ${roomId}:`, error);
    }
  };

  // 현재 층의 각 강의실 ID에 대해 데이터를 개별적으로 요청
  useEffect(() => {
    currentFloorRooms.forEach((roomId) => {
      fetchSensorData(roomId); // 각 강의실 ID에 대해 fetchSensorData 호출
    });
  }, [currentFloor]);

  // Room ID별 센서 데이터를 가져오는 함수
  const getRoomSensorData = (roomId) => roomSensorData[roomId] || {};

  // 캔버스에 각 강의실 위치와 이름 표시
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const coordinates = {
      3: [
        { id: "3115", x: 36, y: 220 },
        { id: "3173", x: 205, y: 180 },
      ],
      4: [{ id: "4142", x: 270, y: 500 }],
      5: [
        { id: "5145", x: 19, y: 500 },
        { id: "5147", x: 104, y: 500 },
      ],
      6: [
        { id: "6119", x: 318, y: 40 },
        { id: "6144", x: 216, y: 500 },
      ],
    };

    const floorCoordinates = coordinates[currentFloor] || [];
    floorCoordinates.forEach(({ id, x, y }) => {
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();

      ctx.font = "16px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(`${id}`, x + 15, y);
    });
  }, [currentFloor]);

  return (
    <div>
      <Header /> {/* 헤더 */}
      <div style={{ display: "flex" }}>
        <SideBar /> {/* 사이드바 */}
        <div className={styles.container}>
          <h2 className={styles.floorTitle}>{currentFloor}층 강의실 구조도</h2>
          <div className={styles.main}>
            <div className={styles.floorMapContainer}>
              <div className={styles.floorMap}>
                <img
                  src={`/FloorPlan/${currentFloor}층.png`}
                  alt={`${currentFloor}층 구조도`}
                  className={styles.mapImage}
                />
                <canvas
                  ref={canvasRef}
                  width={440}
                  height={602.63}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "none",
                  }}
                />
                <div
                  className={styles.floorButtons}
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginLeft: "8%",
                    marginTop: "6%",
                  }}
                >
                  {[3, 4, 5, 6].map((floor) => (
                    <button
                      key={floor}
                      className={styles.floorButton}
                      onClick={() => setCurrentFloor(floor)}
                      style={{
                        backgroundColor:
                          currentFloor === floor ? "#ffd690" : "#fff1d9",
                        width: "20%",
                        fontSize: "90%",
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#5f5f5f",
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
                const roomData = getRoomSensorData(roomId); // 각 강의실의 센서 데이터 가져오기
                return (
                  <div className={styles.infoPanel} key={roomId}>
                    <h2>{roomId} 강의실</h2>
                    {roomData ? (
                      <>
                        <p>온도: {roomData.Temperature?.value || "--"}°C</p>
                        <p>습도: {roomData.Humidity?.value || "--"}%</p>
                        <p>TVOC: {roomData.TVOC?.value || "--"} ㎍/㎥</p>
                        <p>
                          PM 2.5:{" "}
                          {roomData.PM2_5MassConcentration?.value || "--"} ㎛
                        </p>
                        <p>소음: {roomData.AmbientNoise?.value || "--"} dB</p>
                      </>
                    ) : (
                      <p>Loading...</p>
                    )}
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
