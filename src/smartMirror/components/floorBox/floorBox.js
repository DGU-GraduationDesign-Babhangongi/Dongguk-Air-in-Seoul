import React from 'react';
import styles from './floorBox.module.css';
import { useNavigate } from 'react-router-dom'; // assuming you're using react-router-dom for navigation

function FloorBox({ floor, rooms, isSelected }) {
  const navigate = useNavigate();  // To navigate to a new URL
  
  const handleRoomClick = (room) => {
    if (room === '3115') {
      window.location.href = 'https://donggukseoul.com/smartmirror/classroom/3115';  // Redirect to the target URL
    }
    else if (room === '3173') {
      window.location.href = 'https://donggukseoul.com/smartmirror/classroom/3173';  // Redirect to the target URL
    }
    else if (room === '4142') {
      window.location.href = 'https://donggukseoul.com/smartmirror/classroom/4142';  // Redirect to the target URL
    }
    else if (room === '5145') {
      window.location.href = 'https://donggukseoul.com/smartmirror/classroom/5145';  // Redirect to the target URL
    }
    else if (room === '5147') {
      window.location.href = 'https://donggukseoul.com/smartmirror/classroom/5147';  // Redirect to the target URL
    }
    else if (room === '6119') {
      window.location.href = 'https://donggukseoul.com/smartmirror/classroom/6119';  // Redirect to the target URL
    }
    else if (room === '6144') {
      window.location.href = 'https://donggukseoul.com/smartmirror/classroom/6144';  // Redirect to the target URL
    }
  };

  return (
    <div className={`${styles.container} ${!isSelected ? styles.greenBorder : ''}`}>
      <div className={styles.floorInfo}>
        <img
          src={require("../../../assets/images/smartmirror/floor.png")}
          alt="Floor Icon"
          className={styles.icon}
          style={{ width: "6vw" }}
        />
        <div className={styles.floorName}>{floor} floor</div>
      </div>

      {/* Divider Line */}
      <div className={styles.divider}></div>

      <div className={styles.roomContainer}>
        {rooms.map((room, index) => (
          <div
            key={index}
            className={styles.roomButton}
            onClick={() => handleRoomClick(room)}  // Add onClick handler here
          >
            {room}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FloorBox;
