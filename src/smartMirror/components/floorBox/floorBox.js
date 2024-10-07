import React from 'react';
import styles from './floorBox.module.css';  // CSS 파일을 모듈로 import

function FloorBox({ floor, rooms, isSelected }) {  // Added 'isSelected' prop for dynamic styling
  return (
    <div className={`${styles.container} ${!isSelected ? styles.redBorder : ''}`}>
      <div className={styles.floorInfo}>
        <img
          src={require("../../../assets/images/smartmirror/floor.png")}  // 층수 이미지를 사용
          alt="Floor Icon"
          className={styles.icon}
        />
        <div className={styles.floorName}>{floor} floor</div>
      </div>

      {/* Divider Line */}
      <div className={styles.divider}></div>

      <div className={styles.roomContainer}>
        {rooms.map((room, index) => (
          <div key={index} className={styles.roomButton}>{room}</div>
        ))}
      </div>
    </div>
  );
}

export default FloorBox;
