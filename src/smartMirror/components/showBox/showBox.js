import React from 'react';
import styles from './showBox.module.css';  // CSS 파일을 모듈로 import

function showBox({ image, i,  unit, name}) {  // props 구조로 변경
  return (
    <div className={styles.container}>
      <img
         src={require("../../../assets/images/smartmirror/showBoxIcon/"+image)}
         style={{height: '7vw', textAlign:'center'}}
      />
      <div>
        <div style={{width: '16vw', textAlign:'start'}}>
          <div style={{display:'flex'}}>
            <div style={{fontSize:'5.5vw', fontWeight:'bold'}}>{i}</div>
            <div style={{fontSize:'2.5vw', alignSelf:'center'}}>{unit}</div>
          </div>
          <div style={{fontSize:'2.5vw' }}>{name}</div>
        </div>
      </div>
    </div>
  );
}

export default showBox;
