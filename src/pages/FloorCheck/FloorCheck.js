/*층별 강의실 수치 확인*/

import React, { useContext, useState, useEffect, useRef } from "react";
import Header from "../../components/common/Header/Header";
import SideBar from "../../components/common/SideBar/SideBar";
import styles from "./FloorCheck.module.css";
import { SensorDataContext } from "../../API/SensorDataContext";

function FloorCheck() {
  const [currentFloor, setCurrentFloor] = useState(3);
  const roomIds = ["3115", "3173", "4142", "5145", "5147", "6119", "6144"];
  const currentFloorRooms = roomIds.filter((Id) => Id.startsWith(currentFloor)); // 현재 층에 해당하는 강의실 필터링
  const {
    data: sensorData,
    setSelectedSensorName,
    loading,
    error,
  } = useContext(SensorDataContext);

  // 여러 Room ID의 데이터를 수집하기 위한 객체 상태 생성
  const [roomSensorData, setRoomSensorData] = useState({});

  // 각 Room ID의 데이터를 받아와 저장
  useEffect(() => {
    currentFloorRooms.forEach((roomId) => {
      setSelectedSensorName(roomId); // Room ID 설정
    });
    console.log("Room IDs Set for Sensor Data:", currentFloorRooms);
  }, [currentFloorRooms, setSelectedSensorName]);

  // sensorData 업데이트 시 roomSensorData에 Room ID별로 저장
  useEffect(() => {
    if (sensorData?.name) {
      setRoomSensorData((prevData) => ({
        ...prevData,
        [sensorData.name]: sensorData, // Room ID별 데이터 저장
      }));
    }
  }, [sensorData]);

  const getRoomSensorData = (roomId) => {
    const data = roomSensorData[roomId];
    console.log(`Room Data for ${roomId}:`, data);
    return data || {};
  };

  const coordinates = {
    3: [
      { id: "3115", x: 32, y: 220 },
      { id: "3173", x: 200, y: 180 },
    ],
    4: [{ id: "4142", x: 270, y: 490 }],
    5: [
      { id: "5145", x: 100, y: 490 },
      { id: "5147", x: 188, y: 490 },
    ],
    6: [
      { id: "6119", x: 310, y: 30 },
      { id: "6144", x: 212, y: 490 },
    ],
  };

  // IAQIndex 값을 기반으로 이미지 경로 결정
  const iaqImageSrc =
    sensorData.IAQIndex?.value >= 86
      ? require("../../assets/images/smartmirror/good.png")
      : sensorData.IAQIndex?.value >= 71
      ? require("../../assets/images/smartmirror/average.png")
      : require("../../assets/images/smartmirror/bad.png");

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
                <div
                  className={styles.coordinatesContainer}
                  style={{ position: "absolute", top: 0, left: 0 }}
                >
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
                      <div className={styles.ring}></div>
                      <div className={styles.ring}></div>
                      <div className={styles.dot}></div>
                      <span className={styles.roomId}>{id}</span>
                    </div>
                  ))}
                </div>
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
              {currentFloorRooms.map((roomId, index) => {
                const roomSensorData = getRoomSensorData(roomId); // 각 강의실에 맞는 센서 데이터 가져오기
                return (
                  <div className={styles.infoPanel} key={index}>
                    <h2
                      style={{
                        margin: "8px 8px 20px 8px",
                        fontSize: "28px",
                      }}
                    >
                      {roomId} 강의실
                    </h2>
                    <hr
                      style={{
                        border: "0.5px solid black",
                        margin: "8px 8px 24px 8px",
                      }}
                    />
                    <div
                      className={styles.infoItem}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <img
                        src="/Icons/img_temp.png"
                        alt="온도"
                        style={{
                          width: "36px",
                          marginRight: "8px",
                          marginBottom: "4px",
                        }}
                      />
                      <span>온도</span>
                      <span style={{ marginLeft: "auto" }}>
                        {loading ? "--" : `${sensorData.Temperature?.value}°C`}
                      </span>
                      <span
                        className={styles.greenDot}
                        style={{ marginLeft: "auto" }}
                      />
                    </div>
                    <div
                      className={styles.infoItem}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <img
                        src="/Icons/img_mois.png"
                        alt="습도"
                        style={{
                          width: "36px",
                          marginRight: "8px",
                          marginBottom: "4px",
                        }}
                      />
                      <span>습도</span>
                      <span style={{ marginLeft: "auto" }}>
                        {loading
                          ? "--"
                          : `${sensorData.Humidity?.value || "--"}%`}
                      </span>
                      <span
                        className={styles.greenDot}
                        style={{ marginLeft: "auto" }}
                      />
                    </div>

                    <div
                      className={styles.infoItem}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <img
                        src="/Icons/img_tvoc.png"
                        alt="TVOC"
                        style={{
                          width: "36px",
                          marginRight: "8px",
                          marginBottom: "4px",
                        }}
                      />
                      <span>TVOC</span>
                      <span style={{ marginLeft: "auto" }}>
                        {loading
                          ? "--"
                          : `${sensorData.TVOC?.value || "--"} ㎍/㎥`}
                      </span>
                      <span
                        className={styles.greenDot}
                        style={{ marginLeft: "auto" }}
                      />
                    </div>

                    <div
                      className={styles.infoItem}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <img
                        src="/Icons/img_pm2.5.png"
                        alt="PM2.5"
                        style={{
                          width: "36px",
                          marginRight: "8px",
                          marginBottom: "4px",
                        }}
                      />
                      <span>PM 2.5</span>
                      <span style={{ marginLeft: "auto" }}>
                        {loading
                          ? "--"
                          : `${
                              sensorData.PM2_5MassConcentration?.value || "--"
                            } ㎛`}
                      </span>
                      <span
                        className={styles.greenDot}
                        style={{ marginLeft: "auto" }}
                      />
                    </div>

                    <div
                      className={styles.infoItem}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <img
                        src="/Icons/img_noise.png"
                        alt="소음"
                        style={{
                          width: "36px",
                          marginRight: "8px",
                          marginBottom: "4px",
                        }}
                      />
                      <span>소음</span>
                      <span style={{ marginLeft: "auto" }}>
                        {loading
                          ? "--"
                          : `${sensorData.AmbientNoise?.value || "--"} dB`}
                      </span>
                      <span
                        className={styles.greenDot}
                        style={{ marginLeft: "auto" }}
                      />
                    </div>
                    <div
                      className={styles.infoItem}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "6px",
                      }}
                    >
                      <img
                        src="/Icons/img_sensor.png"
                        alt="센서 상태"
                        style={{
                          width: "36px",
                          marginRight: "8px",
                          marginBottom: "4px",
                        }}
                      />
                      <span>센서 상태</span>
                      <span style={{ marginLeft: "auto" }}>
                        {loading ? "--" : "ON"}
                      </span>
                      <span
                        className={styles.greenDot}
                        style={{ marginLeft: "auto" }}
                      />
                    </div>
                    <hr
                      style={{
                        border: "0.5px solid #9c9c9c",
                        margin: "24px 4px 12px 4px",
                      }}
                    />
                    <div
                      className={styles.infoScore}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "4%",
                      }}
                    >
                      <span>{}</span>
                      <img
                        src="/Icons/good.png"
                        alt="평균값"
                        style={{
                          width: "120px",
                          marginRight: "1%",
                          marginLeft: "4%",
                          marginBottom: "4px",
                        }}
                      />
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
