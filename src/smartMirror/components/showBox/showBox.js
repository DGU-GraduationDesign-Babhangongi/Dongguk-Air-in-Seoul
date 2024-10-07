import React from 'react';
import styles from './showBox.module.css';  // CSS 파일을 모듈로 import

function showBox({ image, i,  unit, name}) {  // props 구조로 변경
  return (
    <div className={styles.container}>
      <img
         src={require("../../../assets/images/smartmirror/home.png")}
         style={{width: '30%', textAlign:'center'}}
      />
      <div>
        <div style={{width: '70%', textAlign:'center'}}>
          <div style={{display:'flex'}}>
            <div style={{fontSize:'5vw', fontWeight:'bold'}}>{i}</div>
            <div style={{fontSize:'2vw'}}>{unit}</div>
          </div>
          <div style={{fontSize:'2vw' }}>{name}</div>
        </div>
      </div>
    </div>
  );
}

export default showBox;
