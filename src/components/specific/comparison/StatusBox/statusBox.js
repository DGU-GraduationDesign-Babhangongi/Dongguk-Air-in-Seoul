import React, { useState } from 'react';
import NEBDropdown from '../../figures/NEBDropdown/NEBDropdown';
import AirQualityIndicator from '../../../common/AirQualityIndicator/AirQualityIndicator';
import styles from '../StatusBox/statusBox.module.css';
import { FaRegStar, FaStar } from "react-icons/fa";

const buildingName = "신공학관";

function StatusBox({ id, color, onSelect }) { 
  const [selectedOption, setSelectedOption] = useState('');
  const [isFavorited, setIsFavorited] = useState(false); // 즐겨찾기 상태 관리

  const handleSelect = (value) => {
    setSelectedOption(value);
    onSelect(value); // 상위 컴포넌트에 선택된 값을 전달
  };
  // 즐겨찾기 버튼 클릭 시 색상 변경 함수
  const handleFavoriteClick = () => {
    setIsFavorited((prev) => !prev); // 상태를 반전시켜 색상 변경
    favoriteFunction(); // 클릭 시 호출할 함수
  };  
  
  // 실제로 동작할 함수 (실제 동작은 필요 없으므로 빈 함수로 설정)
  const favoriteFunction = () => {
    console.log('즐겨찾기 클릭됨');
  };

  return (
    <div className={styles.box} style={{ border: `1.5px solid ${color}` }}>
      <div style={{ width: 'clamp(10px, 36%, 144px)' }}>
        <div className={styles.titleTop}>
          <div style={{paddingRight: '0.1vw'}}>비교 강의실 {id}</div>
          <div style={{ position: 'relative', display: 'inline-block', width: 'clamp(4px, 1vw, 16px)' }}>

  {/* 메인 아이콘 */}
  <FaStar
    size={'68%'} // 실제 아이콘 크기
    color={isFavorited ? '#FFD700' : '#A5A5A5'} // 메인 색상
    onClick={handleFavoriteClick}
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)', // 중앙으로 이동
      cursor: 'pointer',
      transition: 'color 0.3s ease',
      zIndex: 1,
    }}
  />  {/* 테두리 역할을 하는 아이콘 */}
  <FaRegStar
    size={'100%'} // 테두리 크기, 부모 요소의 크기에 맞춰 설정
    color="#000000" // 테두리 색상
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)', // 중앙으로 이동
      zIndex: 0,
    }}
  />
</div>

  </div>
        <div className={styles.title}>
          <img src={require('../../../../assets/images/building.png')} alt="building" className={styles.titleImg} />
          <div>{buildingName}</div>
        </div>
        <NEBDropdown onSelect={handleSelect} borderColor={color} borderWidth='3px' />
      </div>
      <hr style={{ margin: '0 10px', border: `1px dashed ${color}`, filter: 'blur(2px)', height: 'clamp(10px, 8vw, 200px)', backgroundColor: color, borderLeft: 'none' }} />
      

      <AirQualityIndicator classRoom={selectedOption} /> 

    </div>
  );
}

export default StatusBox;
