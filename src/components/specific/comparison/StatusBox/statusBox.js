// StatusBox.jsx
import React, { useState, useEffect } from 'react';
import NEBDropdown from '../../figures/NEBDropdown/NEBDropdown';
import AirQualityIndicator from '../../../common/AirQualityIndicator/AirQualityIndicator';
import styles from '../StatusBox/statusBox.module.css';

const buildingName = "신공학관";

function StatusBox({ id, color }) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelect = (value) => {
    setSelectedOption(value); // 선택된 값 저장
  };

  return (
    <div className={styles.box} style={{ border: `1.5px solid ${color}` }}>
      <div style={{ width: 'clamp(10px, 36%, 144px)' }}>
        <div className={styles.titleTop}>
          <div>비교 강의실 {id}</div>
          <img
            src={require('../../../../assets/images/star.png')}
            alt="building"
            className={styles.titleTopImg}
          />
        </div>
        <div className={styles.title}>
          <img
            src={require('../../../../assets/images/building.png')}
            alt="building"
            className={styles.titleImg}
          />
          <div>{buildingName}</div>
        </div>
        <NEBDropdown onSelect={handleSelect} borderColor={color} borderWidth='3px' />
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
      <AirQualityIndicator classRoom={selectedOption} /> {/* 선택된 값으로 독립적으로 표시 */}
    </div>
  );
}

export default StatusBox;
