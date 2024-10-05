import React from 'react';
import styles from './classRoomButton.module.css';  // CSS 파일을 모듈로 import

function ClassRoomButton({ i }) {  // props 구조로 변경
  return (
    <div className={styles.container}>
      <div style={{width: '100%',textAlign:'center'}}>
        {i} {/* 전달된 props를 출력 */}
      </div>
    </div>
  );
}

export default ClassRoomButton;
