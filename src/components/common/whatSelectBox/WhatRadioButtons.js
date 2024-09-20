import React from 'react';
import styles from './WhatRadioButtons.module.css';

const options = [
  { value: 'temperature', label: '온도' },
  { value: 'humidity', label: '습도' },
  { value: 'TVOC', label: 'TVOC' },
  { value: 'PM2.5', label: 'PM 2.5' },
  { value: 'noise', label: '소음' },
];

const colors = [
  '#96C0E8', // 온도
  '#F1B5FB', // 습도
  '#19E6A0', // TVOC
  '#FFDC82', // PM 2.5
  '#FF8484'  // 소음
];

const WhatCheckBoxes = ({ selectedValues, onSelect, borderColor = '#A5A5A5', borderWidth = '1px' }) => {
  const handleChange = (value) => {
    if (selectedValues.includes(value)) {
      onSelect(selectedValues.filter(v => v !== value));
    } else {
      onSelect([...selectedValues, value]);
    }
  };

  return (
    <div className={styles.checkboxGroup} style={{ borderColor, borderWidth }}>
      {options.map((option, index) => (
        <label 
          key={option.value} 
          className={styles.checkboxLabel} 
          style={{ '--checkbox-color': colors[index] }} // CSS 변수 설정
        >
          <input
            type="checkbox"
            name="attribute"
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={() => handleChange(option.value)}
            className={styles.checkboxInput}
          />
          <span className={styles.checkboxText}>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default WhatCheckBoxes;
