import React, { useState } from 'react';
import styles from './ControlBoxMg.module.css';
import ToggleButton from '../ToggleButton/ToggleButton';
import ControlList from '../ControlBox/ControlList';
import { IoMdSettings } from "react-icons/io";

function ControlBoxMg({ width, height, title, color, maxWidth, room }) {
  // 여러 개의 ToggleButton 상태를 배열로 관리
  const [toggleStatuses, setToggleStatuses] = useState([false, false, false]);

  // 각 ToggleButton에 대한 이름을 배열로 저장
  const deviceNames = ['Air conditioner', 'Ventilator', 'Air cleaner'];

  // Toggle 상태가 변경될 때 호출되는 함수
  const handleToggleChange = (index, newStatus) => {
    // 상태 배열을 복사하여 변경
    const updatedStatuses = [...toggleStatuses];
    updatedStatuses[index] = newStatus;
    setToggleStatuses(updatedStatuses);
    console.log(`Toggle ${index} status changed:`, newStatus);
  };

  return (
    <div className={styles.Container} style={{width:`${width}`, height:`${height}`, maxWidth:`${maxWidth}`}}> 
    <div style={{ marginLeft: '5%' }}>{title}</div>
    <div className={styles.box} style={{ height:`${height}`, border: '1.5px solid' + color }}>

    <ControlList width='100%' height='100%' gap='5%' building='신공학관' room={room}/>
    </div>
    </div>
  );
}

export default ControlBoxMg;
