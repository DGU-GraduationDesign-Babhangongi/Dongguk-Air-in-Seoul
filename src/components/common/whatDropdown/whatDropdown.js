import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from './whatDropdown.module.css';

// 드롭다운에 표시할 옵션들
const options = [
  { value: 'TEMPERATURE', label: '온도' },
  { value: 'HUMIDITY', label: '습도' },
  { value: 'TVOC', label: 'TVOC' },
  { value: 'PM2_5MASSCONCENTRATION', label: 'PM 2.5' },
  { value: 'AMBIENTNOISE', label: '소음' },
];

const WhatDropdown = ({ onSelect, borderColor = '#A5A5A5', borderWidth = '1px', width = '100%', height = 'auto', noPM25A, noPM25B }) => {
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    // 'PM 2.5' 값 여부에 따라 수정
    if (noPM25A === false || noPM25B === false) {
      setFilteredOptions(options.filter(option => option.value !== 'PM2_5MASSCONCENTRATION'));
    } else {
      setFilteredOptions(options);
    }
  }, [noPM25A, noPM25B]); // noPM25A, noPM25B 값이 변경될 때마다 실행

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: width, 
      height: height, 
      borderRadius: '10px', 
      borderColor: borderColor, 
      borderWidth: borderWidth, 
      borderStyle: 'solid', 
      fontSize: 'clamp(10px, 1vw, 32px)', 
      fontWeight: 'bold', 
      textAlign: 'center', 
      margin: '0', 
      padding: '0', 
    }),
    placeholder: (provided) => ({
      ...provided,
      fontWeight: 'normal', 
      fontSize: 'clamp(5px, 0.8vw, 24px)', 
      color: '#999' 
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: 'clamp(10px, 1vw, 32px)',
      textAlign: 'center' 
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '10px', 
      fontWeight: 'bold',
      borderColor: borderColor, 
      borderWidth: borderWidth, 
      borderStyle: 'solid', 
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      paddingRight: '8px', 
      paddingLeft: 0, 
      fontSize: 'clamp(5px, 1vw, 32px)', 
      svg: {
        width: 'clamp(5px, 1.4vw, 32px)', 
        height: 'clamp(5px, 1.4vw, 32px)', 
      }
    }),
    indicatorSeparator: () => ({
      display: 'none', 
    }),
  };

  return (
    <Select 
      options={filteredOptions} 
      onChange={option => onSelect(option.value)} 
      styles={customStyles} 
      placeholder={<span className={styles.customPlaceholder}>속성 선택</span>} 
      className={styles.NEBDropdown} 
    />
  );
};

export default WhatDropdown;
