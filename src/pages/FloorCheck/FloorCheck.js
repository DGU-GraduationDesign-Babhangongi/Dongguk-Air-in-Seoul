/*층별 강의실 수치 확인*/
import React, { useState } from "react";
import Header from "../../components/common/Header/Header";
import SideBar from "../../components/common/SideBar/SideBar";
import style from "./FloorCheck.module.css";

const floorData = [
  {
    roomNumber: "3147",
    temperature: "31°C",
    humidity: "56%",
    tvoc: "23",
    pm25: "150",
    noise: "89데시벨",
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
    noise: "75데시벨",
    sensorStatus: "정상",
    score1: 80,
    score2: 55,
  },
  // 필요한 만큼 데이터 추가
];

const FloorCheck = () => {
  return (
    <div className={style.container}>
      <Header /> {/* 상단 헤더 */}
      <div className={style.content}>
        <SideBar /> {/* 왼쪽 사이드바 */}
        <div className={style.main}>
          <div className={style.floorMapContainer}>
            <div className={style.floorMap}>
              {/* 도면 이미지 */}
              <img
                src="../3층.png"
                alt="신공학관 구조도"
                className={style.mapImage}
              />
              <div
                className={style.roomPin}
                style={{ top: "20%", left: "30%" }}
              >
                3183
              </div>
              <div
                className={style.roomPin}
                style={{ top: "60%", left: "40%" }}
              >
                3115
              </div>
            </div>
            <h2 className={style.floorTitle}>신공학관 구조도</h2>{" "}
            {/* 도면 아래 문구 */}
          </div>

          <div className={style.infoPanels}>
            {floorData.map((room, index) => (
              <div className={style.infoPanel} key={index}>
                <h2>{room.roomNumber} 강의실</h2>
                <div className={style.infoItem}>
                  <span>온도</span> <span>{room.temperature}</span>
                  <span className={style.redDot} />
                </div>
                <div className={style.infoItem}>
                  <span>습도</span> <span>{room.humidity}</span>
                  <span className={style.greenDot} />
                </div>
                <div className={style.infoItem}>
                  <span>TVOC</span> <span>{room.tvoc}</span>
                  <span className={style.greenDot} />
                </div>
                <div className={style.infoItem}>
                  <span>PM 2.5</span> <span>{room.pm25}</span>
                  <span className={style.greenDot} />
                </div>
                <div className={style.infoItem}>
                  <span>소음</span> <span>{room.noise}</span>
                  <span className={style.greenDot} />
                </div>
                <div className={style.infoItem}>
                  <span>센서 상태</span> <span>{room.sensorStatus}</span>
                  <span className={style.greenDot} />
                </div>
                <div className={style.infoScore}>
                  <span>{room.score1}</span>
                </div>
                <div className={style.infoScore}>
                  <span>{room.score2}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FloorCheck;
