import React from 'react';
import styles from './WhatRadioButtons.module.css';

// 옵션 목록에 색상 포함
const options = [
  { value: 'temperature', label: 'Temp', color: '#96C0E8' },
  { value: 'humidity', label: 'Humidity', color: '#F1B5FB' },
  { value: 'TVOC', label: 'TVOC', color: '#19E6A0' },
  { value: 'noise', label: 'Noise', color: '#FF8484' },
  { value: 'PM2.5', label: 'PM2.5', color: '#FFDC82' },
];

const WhatCheckBoxes = ({ selectedValues, onSelect, borderColor = '#A5A5A5', borderWidth = '1px', width = '100%', isPM2_5 = false }) => {
  // PM2.5 여부에 따른 필터링
  const filteredOptions = isPM2_5 
    ? options 
    : options.filter(option => option.value !== 'PM2.5');

  // 체크박스 값 변경 핸들러
  const handleChange = (value, index) => {
    if (selectedValues.includes(value)) {
      onSelect(selectedValues.filter(v => v !== value), null); // 선택 해제
    } else {
      onSelect([...selectedValues, value], index); // 새 항목 선택
    }
  };

  return (
    <div 
      className={styles.checkboxGroup} 
      style={{ borderColor, borderWidth, width }}
    >
      {filteredOptions.map((option, index) => (
        <label 
          key={option.value} 
          className={styles.checkboxLabel} 
          style={{ '--checkbox-color': option.color }} 
        >
          <input
            type="checkbox"
            name="attribute"
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={() => handleChange(option.value, index)} 
            className={styles.checkboxInput}
          />
          <span className={styles.checkboxText}>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default WhatCheckBoxes;
