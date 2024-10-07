import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 층수에 따라 올바른 접미사 반환
function getOrdinalSuffix(number) {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return 'st';
  } else if (lastDigit === 2 && lastTwoDigits !== 12) {
    return 'nd';
  } else if (lastDigit === 3 && lastTwoDigits !== 13) {
    return 'rd';
  } else {
    return 'th';
  }
}

// 층수를 매핑하는 함수
function getFloorImage(classRoom) {
  const floorNumber = Math.floor(classRoom / 1000); // classRoom 값을 1000으로 나눈 후 정수 부분을 얻음
  const suffix = getOrdinalSuffix(floorNumber); // 접미사 얻기
  return `${floorNumber}${suffix}_floor.png`; // 예: "6th_floor.png"
}

function Map({ classRoom, x, y }) {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 가져오기
  const [imagePath, setImagePath] = useState(null);

  useEffect(() => {
    const imageName = getFloorImage(classRoom);
    try {
      const path = require(`../../assets/images/smartmirror/${imageName}`);
      setImagePath(path);
    } catch (error) {
      console.error(`Error loading image: ${error}`);
      navigate('/smartM'); // 오류 발생 시 오류 페이지로 이동
    }
  }, [classRoom, navigate]);

  if (!imagePath) {
    return null; // 이미지가 로드되지 않으면 아무 것도 렌더링하지 않음
  }

  return (
    <div style={{ position: 'relative', width: '27%' }}>
      <img
        src={imagePath}
        alt="Map"
        style={{ width: '100%' }} // 이미지를 wrapper에 맞게 100%로 설정
      />
      <img
        src={require('../../assets/images/smartmirror/location.png')} // 위치 아이콘 경로
        alt="Location"
        style={{
          position: 'absolute',
          left: `${x}%`, // x 좌표를 퍼센트로 설정
          top: `${y}%`, // y 좌표를 퍼센트로 설정
          width: '20%', // 위치 아이콘 크기 조정 (필요시)
          height: 'auto', // 위치 아이콘 크기 조정 (필요시)
        }}
      />
      <div
        style={{
          display:'flex',
          justifyContent:'center',
          alignItems:'end',
          position: 'absolute',
          left: `${x}%`, // x 좌표를 퍼센트로 설정
          top: `${y}%`, // y 좌표를 약간 아래로 조정하여 텍스트가 아이콘 아래에 오도록 설정
          width: '20%', 
          height:'22%',
          textAlign: 'center', // 텍스트를 중앙 정렬
          fontSize:'1.6vw',
          fontWeight:'bold'
        }}
      >
        <div>{classRoom}</div>
      </div>
    </div>
  );
}

export default Map;
