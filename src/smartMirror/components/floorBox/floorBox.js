import React, { useContext, useEffect, useState } from 'react';
import styles from './floorBox.module.css';
import { useNavigate } from 'react-router-dom';
import { SensorDataContext } from '../../../API/SensorDataContext';

function FloorBox({ floor, rooms }) {
  const navigate = useNavigate();
  const { data, loading } = useContext(SensorDataContext);
  const [averageIAQ, setAverageIAQ] = useState(null);

  useEffect(() => {
    if (!data) return;

    const iaqValues = rooms.map(room => {
      const iaqValue = data[room]?.IAQIndex?.value || 0;
      console.log(`Room ${room} IAQIndex value:`, iaqValue); // 각 방의 IAQIndex 값 로깅
      return iaqValue;
    });

    if (iaqValues.length > 0) {
      const avg = iaqValues.reduce((sum, value) => sum + value, 0) / iaqValues.length;
      setAverageIAQ(avg);
      console.log(`Average IAQ for ${floor} floor:`, avg); // 평균 IAQ 값 로깅
    }
  }, [rooms, data]);

  const borderColor = averageIAQ !== null && averageIAQ < 70 ? styles.redBorder : styles.greenBorder;

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
      </div>
    </div>
  );
}

export default FloorBox;
