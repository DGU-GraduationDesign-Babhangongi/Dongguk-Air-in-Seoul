import React, { useEffect, useState } from "react";
import styles from "./abnormalLog.module.css";
import sensor from "../../../assets/images/main/sensor_icon.png";
import API from "../../../API/api";

const AbnormalLogSEJONG = () => {
  return (
    <div>
      <h3 style={{ fontSize: "clamp(15px, 1.6vw, 20px)" }}>
        <img src={sensor} alt="센서 아이콘" className={styles.icons} />
        센서 수치 이상 로그 기록
      </h3>
      <div className={styles.scrollableContainer}>
        <div>현재 이상 로그 값이 없습니다.</div>
      </div>
    </div>
  );
};

export default AbnormalLogSEJONG;
