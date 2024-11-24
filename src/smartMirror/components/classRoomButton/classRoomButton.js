import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from './classRoomButton.module.css';  

function ClassRoomButton({ i }) {
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate(`/smartMirror/ClassRoom/${i}`);  // 해당 강의실 페이지로 이동
  };

  return (
    <div className={styles.container} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div style={{ width: '100%', textAlign: 'center', margin:'auto'}}>
        {i}  
      </div>
    </div>
  );
}

export default ClassRoomButton;
