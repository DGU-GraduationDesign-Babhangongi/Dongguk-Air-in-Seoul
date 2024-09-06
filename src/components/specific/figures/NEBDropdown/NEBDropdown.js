import React from 'react';
import Select from 'react-select';
import styles from './NEBDropdown.module.css';

const options = [
  { value: '3173', label: '3173' },
  { value: '4147', label: '4147' },
  { value: '6144', label: '6144' }
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: '10px',
    borderColor: '#A5A5A5',
    fontSize: '1.6vw',
    textAlign: 'center'
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: '1vw',
    color: '#999'
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: '1.6vw',
    textAlign: 'center'
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '10px',
    borderColor: '#A5A5A5'
  }),  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 1, // 기본 패딩 제거
  }),
  indicatorSeparator: () => ({
    display: 'none', // 구분선 제거
  }),
};

function CustomDropdown({ onSelect }) {
  return (
    <Select 
      options={options}
      onChange={option => onSelect(option.value)}
      styles={customStyles}
      placeholder={<span className={styles.customPlaceholder}>강의실 선택</span>}
      className={styles.NEBDropdown}
      classNamePrefix="custom-select" // add classNamePrefix to use with CSS if needed
    />
  );
}

export default CustomDropdown;
