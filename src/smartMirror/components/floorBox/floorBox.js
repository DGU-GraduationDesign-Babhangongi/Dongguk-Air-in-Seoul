import React, { useContext, useEffect, useState } from 'react';
import styles from './floorBox.module.css';
import { useNavigate } from 'react-router-dom';
import API from '../../../API/api';

function FloorBox({ floor, rooms, click = false }) {
  const [averageIAQ, setAverageIAQ] = useState(0);

  useEffect(() => {
    const fetchIAQData = async () => {
      const encodedBuilding = encodeURIComponent('신공학관');
      try {
        const promises = rooms.map(room => {
          const endpoint = `/api/sensorData/recent/classroom?building=${encodedBuilding}&name=${encodeURIComponent(room)}`;
          return API.get(endpoint);
        });

        const responses = await Promise.all(promises);
        const iaqValues = responses.map(response => response?.data?.IAQIndex?.value || 0);
        const avg = iaqValues.reduce((sum, value) => sum + value, 0) / iaqValues.length;

        setAverageIAQ(avg);

      } catch (e) {
        console.error("API 오류: ", e);
      }
    };

    fetchIAQData();
  }, [rooms]);

  // 조건에 따라 border 색상 설정
  const borderColor = (() => {
    if (averageIAQ >= 90) {
      return styles.Border1; 
    } else if (averageIAQ >= 80) {
      return styles.Border2;
    } else if (averageIAQ >= 70) {
      return styles.Border3; 
    } else if (averageIAQ >= 60) {
      return styles.Border4; 
    } else if (averageIAQ === 0) {
      return null;
    }
    else {
      return styles.Border5; 
    }
  })();

  const handleRoomClick = (room) => {
    window.location.href = `https://donggukseoul.com/smartmirror/classroom/${room}`;
  };

  return (
    <div className={`${styles.container} ${borderColor}`}>
      <div className={styles.floorInfo}>
        <img
          src={require("../../../assets/images/smartmirror/floor.png")}
          alt="Floor Icon"
          className={styles.icon}
          style={{ width: "6vw" }}
        />
        <div className={styles.floorName}>{floor} floor</div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.roomContainer}>
        {rooms.map((room, index) => (
          <div
            key={index}
            className={styles.roomButton}
            onClick={() => handleRoomClick(room)}
          >
            {room}
          </div>

        ))}
        {click && (
          <div class="blinking-icon">
            <img src={require("../../../assets/images/smartmirror/Click.png")} alt="Selection Icon" style={{ position: 'absolute', top: '77vw', left: '37vw', width: '6vw' }} />
          </div>

        )}

      </div>
    </div>
  );
}

export default FloorBox;
