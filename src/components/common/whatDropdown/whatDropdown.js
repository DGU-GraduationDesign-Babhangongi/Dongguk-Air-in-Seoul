import React from 'react';
import Select from 'react-select';
import styles from './whatDropdown.module.css';

const options = [
  { value: 'TEMPERATURE', label: '온도' },
  { value: 'HUMIDITY', label: '습도' },
  { value: 'TVOC', label: 'TVOC' },
  { value: 'PM2_5MASSCONCENTRATION', label: 'PM 2.5' },
  { value: 'AMBIENTNOISE', label: '소음' },
];

const whatDropdown = ({ onSelect, borderColor = '#A5A5A5', borderWidth = '1px', width = '100%', height = 'auto' }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: width, // 너비 설정
      height: height, // 높이 설정
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
      borderStyle: 'solid'
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      paddingRight: '8px',
      paddingLeft: 0,
      fontSize: 'clamp(5px, 1vw, 32px)',
      svg: {
        width: 'clamp(5px, 1.4vw, 32px)',
        height: 'clamp(5px, 1.4vw, 32px)'
      }
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
  };

  return (
    <Select 
      options={options}
      onChange={option => onSelect(option.value)}
      styles={customStyles}
      placeholder={<span className={styles.customPlaceholder}>속성 선택</span>}
      className={styles.NEBDropdown}
    />
  );
};

export default whatDropdown;
