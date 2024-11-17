import React, { useState, useEffect } from 'react';
import NEBDropdown from '../../figures/NEBDropdown/NEBDropdown';
import AirQualityIndicator from '../../../common/AirQualityIndicator/AirQualityIndicator';
import styles from '../StatusBox/statusBox.module.css';
import Star from '../../../common/star/star';

const buildingName = "신공학관";

function StatusBox({ id, color, onSelect, oppositeClassroom, status, onNoPm25Data }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedFavorited, setSelectedFavorited] = useState(false);
  const [hasPm25Data, setHasPm25Data] = useState(true); // PM2.5 데이터가 있는지 여부

  // PM2.5 데이터 상태를 업데이트하는 함수
  const handleNoPm25Data = (hasData) => {
    setHasPm25Data(hasData); // PM2.5 데이터 상태 업데이트
    onNoPm25Data(hasData); // 부모 컴포넌트에 상태 전달
  };

  const handleSelectClassroom = (value, status) => {
    onSelect(value);  // 선택된 강의실을 부모로 전달
    setSelectedOption(value);
    setSelectedFavorited(value);
  };

  // 반대 강의실이 변경될 때마다 selectedOption 초기화 (또는 필요에 따라 다른 동작)
  useEffect(() => {
    // setSelectedOption(''); // 반대 강의실 변경 시 필요에 따라 초기화
  }, [oppositeClassroom]);

  return (
    <div className={styles.box} style={{ border: `1.5px solid ${color}` }}>
      <div style={{ width: 'clamp(10px, 36%, 144px)' }}>
        <div className={styles.titleTop}>
          <div style={{ paddingRight: '0.1vw' }}>비교 강의실 {id}</div>
          <div style={{ position: 'relative', display: 'inline-block', width: 'clamp(4px, 1.2vw, 20px)' }}>
            <Star classRoom={selectedOption} building={buildingName} selectedFavorited={selectedFavorited} />
          </div>
        </div>
        <div className={styles.title}>
          <img src={require('../../../../assets/images/building.png')} alt="building" className={styles.titleImg} />
          <div>{buildingName}</div>
        </div>
        <NEBDropdown
          onSelect={handleSelectClassroom}
          oppositeClassroom={oppositeClassroom} 
          status={status} // 상태 값 전달
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
        onNoPm25Data={handleNoPm25Data}  // onNoPm25Data prop 전달
      />
    </div>
  );
}

export default StatusBox;
