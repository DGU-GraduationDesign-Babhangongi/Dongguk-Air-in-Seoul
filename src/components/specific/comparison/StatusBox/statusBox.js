import React, { useState } from 'react';
import NEBDropdown from '../../figures/NEBDropdown/NEBDropdown';
import AirQualityIndicator from '../../../common/AirQualityIndicator/AirQualityIndicator';
import styles from '../StatusBox/statusBox.module.css';
import { FaRegStar, FaStar } from "react-icons/fa";
import Star from '../../../common/star/star';

const buildingName = "신공학관";

function StatusBox({ id, color, onSelect }) { 
  const [selectedOption, setSelectedOption] = useState('');
  const [isFavorited, setIsFavorited] = useState(false); // 즐겨찾기 상태 관리

  const handleSelect = (value) => {
    setSelectedOption(value);
    onSelect(value); // 상위 컴포넌트에 선택된 값을 전달
  };

  return (
    <div className={styles.box} style={{ border: `1.5px solid ${color}` }}>
      <div style={{ width: 'clamp(10px, 36%, 144px)' }}>
        <div className={styles.titleTop}>
          <div style={{paddingRight: '0.1vw'}}>비교 강의실 {id}</div>
          <div style={{ position: 'relative', display: 'inline-block', width: 'clamp(4px, 1vw, 16px)' }}>

          <Star class={selectedOption}/>
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
