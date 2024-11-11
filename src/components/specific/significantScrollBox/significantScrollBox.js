import React from 'react';
import styles from '../alarmScrollBox/alarmScrollBox.module.css'; // CSS 모듈 import

const significantScrollBox = ({ title }) => {
  const formatMessage = (message) => {
    return message.split("\n").map((line, index) => (
      <span key={index}>{line}<br /></span>
    ));
  };

  return (
    <div className={styles.Container}>
      <div style={{ marginLeft: '5%' }}>{title}</div>
      <div className={styles.scrollableContainer}>
        {/* 스크롤할 내용 */}
        <div>{formatMessage("[07.20 PM 23:56]\n PM2.5 수치 이상")}</div>
        <div>{formatMessage("[07.20 PM 23:56]\n PM2.5 수치 이상")}</div>
        <div>{formatMessage("[07.20 PM 23:56]\n PM2.5 수치 이상")}</div>
        <div>{formatMessage("[07.20 PM 23:56]\n PM2.5 수치 이상")}</div>
        <div>{formatMessage("[07.20 PM 23:56]\n PM2.5 수치 이상")}</div>
        <div>{formatMessage("[07.20 PM 23:56]\n PM2.5 수치 이상")}</div>
      </div>
    </div>
  );
};

export default significantScrollBox;
