/*층별 강의실 수치 확인*/
/*사진 위치 C:\Dongguk-Air-in-Seoul\src\assets\images\AirQualityIndicator\humidity.png*/
import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/common/Header/Header";
import SideBar from "../../components/common/SideBar/SideBar";
import styles from "./FloorCheck.module.css";

function FloorCheck() {
  const loading = null;
  const [currentFloor, setCurrentFloor] = useState(3);
  const floorData = {
    3: [
      {
        roomNumber: "3115",
        temperature: "29°C",
        humidity: "60%",
        tvoc: "20",
        pm25: "120",
        noise: "75dB",
        sensorStatus: "정상",
        score1: 80,
        score2: 55,
      },
    ],
    4: [
      {
        roomNumber: "4142",
        temperature: "28°C",
        humidity: "55%",
        tvoc: "25",
        pm25: "110",
        noise: "72dB",
        sensorStatus: "정상",
        score1: 82,
        score2: 60,
      },
    ],
    5: [
      {
        roomNumber: "5145",
        temperature: "30°C",
        humidity: "50%",
        tvoc: "22",
        pm25: "130",
        noise: "80dB",
        sensorStatus: "정상",
        score1: 85,
        score2: 58,
      },
    ],
    6: [
      {
        roomNumber: "6119",
        temperature: "32°C",
        humidity: "53%",
        tvoc: "18",
        pm25: "100",
        noise: "78dB",
        sensorStatus: "정상",
        score1: 90,
        score2: 63,
      },
    ],
  };
  const currentFloorData = floorData[currentFloor] || [];

  const canvasRef = useRef(null);
  const coordinates = {
    3: [
      { id: "3115", x: 36, y: 240 },
      { id: "3173", x: 205, y: 200 },
    ],
    4: [{ id: "4142", x: 260, y: 300 }],
    5: [
      { id: "5145", x: 140, y: 270 },
      { id: "5177", x: 190, y: 300 },
    ],
    6: [
      { id: "6119", x: 160, y: 320 },
      { id: "6144", x: 210, y: 350 },
    ],
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const floorCoordinates = coordinates[currentFloor] || [];
    floorCoordinates.forEach(({ id, x, y }) => {
      // 동그라미 도형 그리기
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();

      // 좌표 값 및 강의실 이름 표시
      ctx.font = "16px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(`${id} (${x}, ${y})`, x + 15, y);
    });
  }, [currentFloor]);

  return (
    <div>
      <Header /> {/* 헤더 */}
      <div style={{ display: "flex" }}>
        <SideBar /> {/* 사이드바 */}
        <div className={styles.container}>
          <div className={styles.main}>
            <h2 className={styles.floorTitle}>
              {currentFloor}층 강의실 구조도
            </h2>
            <div className={styles.floorMapContainer}>
              <div className={styles.floorMap}>
                <img
                  src={`/FloorPlan/${currentFloor}층.png`}
                  alt={`${currentFloor}층 구조도`}
                  className={styles.mapImage}
                />
                <canvas
                  ref={canvasRef}
                  width={600} // 이미지 크기와 맞추기
                  height={400} // 이미지 크기와 맞추기
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "none", // 마우스 이벤트가 이미지로 전달되도록 설정
                  }}
                />
                <div
                  className={styles.floorButtons}
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginLeft: "12%",
                    marginTop: "1%",
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
                        width: "80px",
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
              {currentFloorData.map((room, index) => (
                <div className={styles.infoPanel} key={index}>
                  <h2
                    style={{
                      margin: "8px 8px 20px 8px",
                      fontSize: "28px",
                    }}
                  >
                    {room.roomNumber} 강의실
                  </h2>
                  <hr
                    style={{
                      border: "0.5px solid #9c9c9c",
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
                      {loading ? "--" : "24°C"}
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
                      {loading ? "--" : "56%"}
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
                      {loading ? "--" : "23"}
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
                      {loading ? "--" : "150um"}
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
                      {loading ? "--" : "89dB"}
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
                    <span>{room.score1}</span>
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FloorCheck;
