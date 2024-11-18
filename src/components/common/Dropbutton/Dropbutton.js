import React from 'react';
import Select from 'react-select';
import styles from './Dropbutton.module.css';

const Dropbutton = ({
  options = [], // 부모 컴포넌트에서 전달되는 options
  onSelect,
  borderColor = '#A5A5A5',
  borderWidth = '1px',
  width = '100%',
  height = 'auto',
}) => {
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
      marginBottom: '30px',
    }),
    placeholder: (provided) => ({
      ...provided,
      fontWeight: 'normal',
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
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
  };

  return (
    <Select
      options={options} // 부모에서 전달된 options 사용
      onChange={(option) => onSelect(option?.value)} // 선택된 값의 value를 전달
      styles={customStyles}
      placeholder={<span className={styles.customPlaceholder}>건물 선택</span>}
      className={styles.NEBDropdown}
    />
  );
};

export default Dropbutton;
