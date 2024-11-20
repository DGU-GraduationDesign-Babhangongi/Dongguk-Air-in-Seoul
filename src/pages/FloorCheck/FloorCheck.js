/*층별 강의실 수치 확인*/

import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useParams와 useNavigate 가져오기
import Header from "../../components/common/Header/Header";
import SideBar from "../../components/common/SideBar/SideBar";
import styles from "./FloorCheck.module.css";
import { SensorDataContext } from "../../API/SensorDataContext";
import AirQualityIndicator from "../../components/common/AirQualityIndicator/AirQualityIndicator";

function FloorCheck() {
  const { floor } = useParams(); // URL에서 floor 값을 가져옴
  const navigate = useNavigate(); // navigate 사용
  const currentFloor = parseInt(floor, 10); // floor 값을 정수로 변환
  const roomIds = ["3115", "3173", "4142", "5145", "5147", "6119", "6144"];
  const currentFloorRooms = roomIds.filter((Id) => Id.startsWith(currentFloor)); // 현재 층에 해당하는 강의실 필터링
  const [averageIAQ, setAverageIAQ] = useState(null);
  const [iaqValues, setIaqValues] = useState([]); // IAQ 점수 저장

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // token 없으면 '/'로 리다이렉트
    }
  }, [navigate]);
  const {
    data: sensorData,
    setSelectedSensorName,
    loading,
  } = useContext(SensorDataContext);

  // 평균 IAQ 계산
  useEffect(() => {
    if (!sensorData || loading || !currentFloorRooms.length) return;

    const values = currentFloorRooms.map((roomId) => {
      const iaq = sensorData[roomId]?.IAQIndex?.value || 0; // 데이터가 없으면 0으로 대체
      console.log(`Room ${roomId} IAQIndex value:`, iaq);
      return iaq;
    });

    if (values.length > 0) {
      setIaqValues(values);
      const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
      setAverageIAQ(avg);
      console.log(`Average IAQ for floor ${floor}:`, avg);
    } else {
      setAverageIAQ(null);
    }
  }, [sensorData, loading, currentFloorRooms]);

  // 좌표별 색상 결정 함수 추가
  const getColor = (IAQvalue) => {
    if (IAQvalue === null) return "gray";
    if (IAQvalue >= 90) return "green";
    if (IAQvalue >= 80) return "orange";
    else return "red";
  };

  useEffect(() => {
    if (!loading) {
      console.log("sensorData:", sensorData);
      console.log("IAQIndex value:", sensorData?.IAQIndex?.value);
    }
  }, [sensorData, loading]);

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

  // 버튼 클릭 시 URL 변경
  const handleFloorChange = (selectedFloor) => {
    navigate(`/floorcheck/${selectedFloor}`); // 선택한 층으로 URL 변경
  };

  // IAQIndex 값을 기반으로 이미지 경로 결정
  const iaqImageSrc = loading
    ? ". . .Loading . . ."
    : sensorData.IAQIndex?.value >= 86
    ? require("../../assets/images/smartmirror/good.png")
    : sensorData.IAQIndex?.value >= 71
    ? require("../../assets/images/smartmirror/average.png")
    : require("../../assets/images/smartmirror/bad.png");

  return (
    <div>
      <Header /> {/* 헤더 */}
      <div style={{ display: "flex" }}>
        <SideBar i="3" /> {/* 사이드바 */}
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
                      onClick={() => handleFloorChange(floor)} // 버튼 클릭 시 URL 변경
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
              {currentFloorRooms.map((roomId, index) => (
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
                    style={{
                      width: "180%",
                      margin: "5%",
                    }}
                  >
                    <AirQualityIndicator classRoom={roomId} />
                  </div>
                  <hr
                    style={{
                      border: "0.5px solid #9c9c9c",
                      margin: "24px 4px 12px 4px",
                    }}
                  />
                  {/* <div
                    className={styles.infoScore}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "4%",
                    }}
                  >
                    <span>
                      {loading
                        ? "--"
                        : sensorData[roomId]?.IAQIndex?.value || "데이터 없음"}
                    </span>
                  </div> */}
                </div>
              ))}
              {/* <div className={styles.averageIAQ}>
                <h3>평균 IAQ 값</h3>
                <span>
                  {loading
                    ? "로딩 중..."
                    : averageIAQ !== null
                    ? averageIAQ.toFixed(2)
                    : "데이터 없음"}
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloorCheck;
