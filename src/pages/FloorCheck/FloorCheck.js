/*층별 강의실 수치 확인*/

import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useParams와 useNavigate 가져오기
import Header from "../../components/common/Header/Header";
import SideBar from "../../components/common/SideBar/SideBar";
import styles from "./FloorCheck.module.css";
import { SensorDataContext } from "../../API/SensorDataContext";
import AirQualityIndicator from "../../components/common/AirQualityIndicator/AirQualityIndicator";
import axios from "axios";
import api from "../../API/api";

function FloorCheck() {
  const { floor } = useParams(); // URL에서 floor 값을 가져옴
  const navigate = useNavigate(); // navigate 사용
  const currentFloor = parseInt(floor, 10); // floor 값을 정수로 변환
  const roomIds = ["3115", "3173", "4142", "5145", "5147", "6119", "6144"];
  const currentFloorRooms = roomIds.filter((Id) => Id.startsWith(currentFloor)); // 현재 층에 해당하는 강의실 필터링
  const [iaqValues, setIaqValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 강의실별 IAQ 데이터 가져오기
      const iaqData = await Promise.all(
        currentFloorRooms.map(async (roomId) => {
          const response = await api.get(
            `/api/sensorData/recent/classroom?building=신공학관&name=${encodeURIComponent(
              roomId
            )}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // 필요 시 인증 토큰 추가
              },
            }
          );
          const iaq = response.data.IAQIndex?.value || 0; // 데이터가 없으면 0으로 대체
          console.log(`Room ${roomId} IAQIndex:`, iaq);
          return { roomId, iaq };
        })
      );

      setIaqValues(iaqData); // 강의실별 IAQ 데이터 저장
    } catch (err) {
      console.error("API 호출 오류:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // 컴포넌트가 마운트될 때 데이터를 한 번 가져옵니다.

    const interval = setInterval(() => {
      fetchData(); // 10초마다 fetchData를 호출합니다.
    }, 5000); // 10,000ms = 10초

    return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 인터벌을 정리합니다.
  }, [currentFloorRooms]);

  const getImageSrc = (iaq) =>
    iaq >= 86
      ? require("../../assets/images/smartmirror/good.png")
      : iaq >= 71
      ? require("../../assets/images/smartmirror/average.png")
      : require("../../assets/images/smartmirror/bad.png");

  useEffect(() => {
    fetchData();
  }, [currentFloorRooms]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // token 없으면 '/'로 리다이렉트
    }
  }, [navigate]);

  // 좌표별 색상 결정 함수 추가
  const getColor = (iaq) => {
    if (iaq === null) return "gray";
    if (iaq >= 90) return "#5C82F5";
    if (iaq >= 80) return "#8BC34A";
    if (iaq >= 70) return "yellow";
    if (iaq >= 60) return "orange";
    else return "red";
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
      { id: "3115", x: 28, y: 212 },
      { id: "3173", x: 196, y: 172 },
    ],
    4: [{ id: "4142", x: 266, y: 482 }],
    5: [
      { id: "5145", x: 96, y: 482 },
      { id: "5147", x: 184, y: 482 },
    ],
    6: [
      { id: "6119", x: 306, y: 22 },
      { id: "6144", x: 208, y: 482 },
    ],
  };

  // 버튼 클릭 시 URL 변경
  const handleFloorChange = (selectedFloor) => {
    navigate(`/floorcheck/${selectedFloor}`); // 선택한 층으로 URL 변경
  };

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
                  src={floorImages[currentFloor]} // 현재 층 이미지
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
              {currentFloorRooms.map((roomId, index) => {
                // iaqValues에서 해당 roomId의 데이터를 찾기
                const roomData = iaqValues.find(
                  (data) => data.roomId === roomId
                );

                // iaq 값이 없을 경우 기본값 설정
                const iaq = roomData ? roomData.iaq : 0;
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
                        src={getImageSrc(iaq)} // 평균값에 따라 이미지 설정
                        alt={iaq >= 86 ? "good" : iaq >= 71 ? "average" : "bad"}
                        style={{ width: "40%" }}
                      />
                      <div
                        className={styles.IAQscore}
                        style={{ color: getColor(iaq) }}
                      >
                        {iaq}점
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
