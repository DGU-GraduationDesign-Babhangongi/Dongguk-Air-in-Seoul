import React, { useContext, useEffect, useState } from 'react';
import styles from './floorBox.module.css';
import { useNavigate } from 'react-router-dom';
import API from '../../../API/api';

function FloorBox({ floor, rooms, click=false }) {
  const navigate = useNavigate();
  const [averageIAQ, setAverageIAQ] = useState(0);

  // SensorDataContext에서 데이터를 가져와 평균 IAQ 계산


  // API를 통해 평균 IAQ 계산
  useEffect(() => {
    const fetchIAQData = async () => {
      const encodedBuilding = encodeURIComponent('신공학관');
      try {
        const promises = rooms.map(room => {
          const endpoint = `/api/sensorData/recent/classroom?building=${encodedBuilding}&name=${encodeURIComponent(room)}`;
          return API.get(endpoint);
        });

        const responses = await Promise.all(promises);

        // 응답 데이터를 합산하여 평균 IAQ 계산
        const iaqValues = responses.map(response => response?.data?.IAQIndex?.value || 0);
        const avg = iaqValues.reduce((sum, value) => sum + value, 0) / iaqValues.length;

        setAverageIAQ(avg);
        //console.log("Average IAQ from API:", avg);
      } catch (e) {
        console.error("API 오류: ", e);
      }
    };

    fetchIAQData();
  }, [rooms]);

// 조건에 따라 border 색상 설정(기준 변경 자유)
const borderColor = (() => {
  if (averageIAQ >= 90) {
    return styles.Border1; // 95 이상
  } else if (averageIAQ >= 80) {
    return styles.Border2; // 85 ~ 94
  } else if (averageIAQ >= 65) {
    return styles.Border3; // 70 ~ 84
  } else if (averageIAQ >= 50) {
    return styles.Border4; // 50 ~ 69
  }else if(averageIAQ===0){
    return null;
  } 
  else {
    return styles.Border5; // 50 미만
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
        {click&&(
          <div class="blinking-icon">
          <img src={require("../../../assets/images/smartmirror/Click.png")} alt="Selection Icon" style={{position: 'absolute', top:'77vw', left: '37vw', width:'6vw'}}/>
        </div>
        
      )}
        
      </div>
    </div>
  );
}

export default FloorBox;
