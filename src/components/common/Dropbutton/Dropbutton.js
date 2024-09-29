import React from 'react';
import Select from 'react-select';
import styles from './Dropbutton.module.css';

const options = [
  { value: 'building1', label: '신공학관' },
  { value: 'building2', label: '원흥관' },
  { value: 'building3', label: '정보문화관 P' },
  { value: 'building4', label: '정보문화관 Q' },
  { value: 'building5', label: '명진관' },
];

const Dropbutton = ({ onSelect, borderColor = '#A5A5A5', borderWidth = '1px', width = '100%', height = 'auto' }) => {
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
      marginBottom: '30px', // margin-bottom 추가
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
      placeholder={<span className={styles.customPlaceholder}>건물 선택</span>}
      className={styles.NEBDropdown}
    />
  );
};

export default Dropbutton;
