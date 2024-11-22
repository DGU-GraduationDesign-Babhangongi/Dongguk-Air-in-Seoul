import React from 'react';
import ControlList from './ControlList';

import styles from './ControlBox.module.css';

const buildingName='신공학관';
function ControlBox({ width, height, title, color, maxWidth, room }) {

  return (
    <div className={styles.Container} style={{width:`${width}`, height:`${height}`, maxWidth:`${maxWidth}`}}> 
    <div style={{ marginLeft: '5%' }}>{title}</div>
    <div className={styles.box} style={{ height:`${height}`, border: '1.5px solid' + color }}>
      <ControlList width='100%' height='100%' gap='5%' building={buildingName} room={room}/>
    </div>
    </div>
  );
}

export default ControlBox;
