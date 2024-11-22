import React from 'react';
import Select from 'react-select';

import styles from './periodDropdown.module.css';

// 기간 옵션 정의
const options = [
  { value: '1', label: '1hour' },
  { value: '24', label: '1day' },
  { value: '168', label: '1week' },
  { value: '720', label: '1month' },
];

// 드롭다운 스타일 설정
const PeriodDropdown = ({ onSelect, borderColor = '#A5A5A5', borderWidth = '1px', width = '100%', height = 'auto' }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '100%',
      height,
      borderRadius: '10px',
      borderColor,
      borderWidth,
      fontSize: 'clamp(10px, 1vw, 32px)',
      fontWeight: 'bold',
      textAlign: 'center',
      margin: '0',
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: 'clamp(5px, 0.8vw, 24px)',
      color: '#999',
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: 'clamp(10px, 1vw, 32px)',
      textAlign: 'center',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '10px',
      fontWeight: 'bold',
      borderColor,
      borderWidth,
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      paddingRight: '8px',
      svg: {
        width: 'clamp(5px, 1.4vw, 32px)',
        height: 'clamp(5px, 1.4vw, 32px)',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
  };

  return (
    <Select
      options={options}
      onChange={(option) => onSelect(option.value)} 
      styles={{ ...customStyles, width }} 
      placeholder={<span className={styles.customPlaceholder}>기간 선택</span>} 
    />
  );
};

export default PeriodDropdown;
