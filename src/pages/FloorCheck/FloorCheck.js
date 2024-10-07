/*층별 강의실 수치 확인*/
/*사진 위치 C:\Dongguk-Air-in-Seoul\src\assets\images\AirQualityIndicator\humidity.png*/
import React, { useState } from "react";
import Header from "../../components/common/Header/Header";
import SideBar from "../../components/common/SideBar/SideBar";
import styles from "./FloorCheck.module.css";

function FloorCheck() {
  const floorData = [
    {
      roomNumber: "3147",
      temperature: "31°C",
      humidity: "56%",
      tvoc: "23",
      pm25: "150",
      noise: "89dB",
      sensorStatus: "정상",
      score1: 87,
      score2: 52,
    },
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
    // 필요한 만큼 데이터 추가
  ];

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <SideBar />
        <div className={styles.content}>
          <div className={styles.main}>
            <div className={styles.floorMapContainer}>
              <div className={styles.floorMap}>
                <img
                  src="/FloorPlan/3층.png"
                  alt="신공학관 구조도"
                  className={styles.mapImage}
                />
                <div
                  className={styles.roomPin}
                  style={{ top: "20%", left: "30%" }}
                >
                  3183
                </div>
                <div
                  className={styles.roomPin}
                  style={{ top: "60%", left: "40%" }}
                >
                  3115
                </div>
              </div>
              <h2 className={styles.floorTitle}>신공학관 구조도</h2>{" "}
              {/* 도면 아래 문구 */}
            </div>

            <div className={styles.infoPanels}>
              {floorData.map((room, index) => (
                <div className={styles.infoPanel} key={index}>
                  <h2>{room.roomNumber} 강의실</h2>
                  <div className={styles.infoItem}>
                    <span>온도</span> <span>{room.temperature}</span>
                    <span className={styles.redDot} />
                  </div>
                  <div className={styles.infoItem}>
                    <span>습도</span> <span>{room.humidity}</span>
                    <span className={styles.greenDot} />
                  </div>
                  <div className={styles.infoItem}>
                    <span>TVOC</span> <span>{room.tvoc}</span>
                    <span className={styles.greenDot} />
                  </div>
                  <div className={styles.infoItem}>
                    <span>PM 2.5</span> <span>{room.pm25}</span>
                    <span className={styles.greenDot} />
                  </div>
                  <div className={styles.infoItem}>
                    <span>소음</span> <span>{room.noise}</span>
                    <span className={styles.greenDot} />
                  </div>
                  <div className={styles.infoItem}>
                    <span>센서 상태</span> <span>{room.sensorStatus}</span>
                    <span className={styles.greenDot} />
                  </div>
                  <div className={styles.infoScore}>
                    <span>{room.score1}</span>
                  </div>
                  <div className={styles.infoScore}>
                    <span>{room.score2}</span>
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
