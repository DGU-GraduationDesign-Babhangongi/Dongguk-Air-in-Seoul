import React, { useState, useEffect } from 'react';
import NEBDropdown from '../../figures/NEBDropdown/NEBDropdown';
import AirQualityIndicator from '../../../common/AirQualityIndicator/AirQualityIndicator';
import Star from '../../../common/star/star';

import styles from '../StatusBox/statusBox.module.css';

const buildingName = "신공학관";

function StatusBox({ id, color, onSelect, oppositeClassroom, status, onNoPm25Data }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedFavorited, setSelectedFavorited] = useState(false);

  // PM2.5 데이터 상태 처리
  const handleNoPm25Data = (hasData) => {
    onNoPm25Data(hasData); 
  };

  // 선택된 강의실 처리
  const handleSelectClassroom = (value) => {
    onSelect(value);  
    setSelectedOption(value);
    setSelectedFavorited(value);
  };

  // 반대 강의실 변경 시 selectedOption 초기화
  useEffect(() => {}, [oppositeClassroom]);

  return (
    <div className={styles.box} style={{ border: `1.5px solid ${color}` }}>
      <div style={{ width: 'clamp(10px, 36%, 144px)' }}>
        <div className={styles.titleTop}>
          <div style={{ paddingRight: '0.1vw' }}>비교 강의실 {id}</div>
          {selectedOption && (
            <div style={{ position: 'relative', display: 'inline-block', width: 'clamp(4px, 1.2vw, 20px)' }}>
              <Star classRoom={selectedOption} building={buildingName} selectedFavorited={selectedFavorited} />
            </div>
          )}
        </div>
        <div className={styles.title}>
          <img src={require('../../../../assets/images/building.png')} alt="building" className={styles.titleImg} />
          <div>{buildingName}</div>
        </div>
        <NEBDropdown
          onSelect={handleSelectClassroom}
          oppositeClassroom={oppositeClassroom} 
          status={status} 
          borderColor={color}
        />
      </div>
      <hr
        style={{
          margin: '0 10px',
          border: `1px dashed ${color}`,
          filter: 'blur(2px)',
          height: 'clamp(10px, 8vw, 200px)',
          backgroundColor: color,
          borderLeft: 'none',
        }}
      />
      <AirQualityIndicator 
        classRoom={selectedOption} 
        onNoPm25Data={handleNoPm25Data} 
      />
    </div>
  );
}

export default StatusBox;
