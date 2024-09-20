import React, { useState, useEffect } from 'react';
import NEBDropdown from '../../figures/NEBDropdown/NEBDropdown';
import AirQualityIndicator from '../../../common/AirQualityIndicator/AirQualityIndicator';

import styles from '../StatusBox/statusBox.module.css';


var buildingName = "신공학관";

function StatusBox({id, color}) {
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    if (selectedOption) {
      console.log(`Selected option: ${selectedOption}`);
    }
  }, [selectedOption]);

  const handleSelect = (value) => {
    setSelectedOption(value);
  };

  return (
    <div className={styles.box} style={{

      border: `1.5px solid ${color}`, // border 색상 적용
    }}>
      <div style={{ width: 'clamp(10px, 36%, 144px)' }}>
        <div className={styles.titleTop}>
          <div>비교 강의실{id}</div>
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
          <div>
            {buildingName}
          </div>
        </div>
        <NEBDropdown onSelect={handleSelect} borderColor={color} borderWidth='3px'/>
      </div>
      <hr
        style={{
          margin: '0 10px',
          border: `1px dashed ${color}`, // border 색상 적용
          filter: 'blur(2px)',
          height: 'clamp(10px, 8vw, 200px)', // 원하는 높이 설정
          backgroundColor: color, // hr 색상 적용
          borderLeft: 'none', // 수평선으로 보이도록 조정
        }}
      />
      <AirQualityIndicator/>
    </div>
  );
}

export default StatusBox;
