import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 층수 접미사 반환
function getOrdinalSuffix(number) {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;
  if (lastDigit === 1 && lastTwoDigits !== 11) return 'st';
  if (lastDigit === 2 && lastTwoDigits !== 12) return 'nd';
  if (lastDigit === 3 && lastTwoDigits !== 13) return 'rd';
  return 'th';
}

// 이미지 파일 경로 생성
function getFloorImage(classRoom) {
  const floorNumber = Math.floor(classRoom / 1000);
  return `${floorNumber}${getOrdinalSuffix(floorNumber)}_floor.png`;
}

function Map({ classRoom, x, y }) {
  const navigate = useNavigate();
  const [imagePath, setImagePath] = useState(null);

  useEffect(() => {
    const imageName = getFloorImage(classRoom);
    try {
      const path = require(`../../assets/images/smartmirror/${imageName}`);
      setImagePath(path);
    } catch (error) {
      console.error(`Error loading image: ${error}`);
      navigate('/smartM');
    }
  }, [classRoom, navigate]);

  if (!imagePath) return null;

  return (
    <div style={{ position: 'relative', width: '27%' }}>
      <img src={imagePath} alt="Map" style={{ width: '100%' }} />
      <img
        src={require('../../assets/images/smartmirror/location.png')}
        alt="Location"
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          width: '20%',
          height: 'auto',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          width: '20%',
          textAlign: 'center',
          fontSize: '1.6vw',
          fontWeight: 'bold',
          zIndex: 9999,
        }}
      >
        {classRoom}
      </div>
    </div>
  );
}

export default Map;
