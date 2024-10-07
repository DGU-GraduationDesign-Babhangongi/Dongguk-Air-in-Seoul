import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate를 import
import styles from './classRoomButton.module.css';  // CSS 파일을 모듈로 import

function ClassRoomButton({ i }) {
  const navigate = useNavigate(); // navigate 함수 가져오기

  const handleClick = () => {
    navigate(`/smartMirror/ClassRoom/${i}`); // 클릭 시 페이지 이동, i를 URL의 일부로 사용
  };

  return (
    <div className={styles.container} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div style={{ width: '100%', textAlign: 'center' }}>
        {i} {/* 전달된 props를 출력 */}
      </div>
    </div>
  );
}

export default ClassRoomButton;
