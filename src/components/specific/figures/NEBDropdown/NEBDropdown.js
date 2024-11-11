import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from './NEBDropdown.module.css';
import API from '../../../../API/api';

const CustomDropdown = ({ onSelect, borderColor = '#A5A5A5', borderWidth = '1px', width = '100%' }) => {
  const [options, setOptions] = useState([]); // Options 상태 관리
  const [loading, setLoading] = useState(true);

  useEffect(() => {      
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      const encodedBuilding = encodeURIComponent('신공학관');
      try {
        const endpoint = `/api/classrooms/myFavorites?building=${encodedBuilding}&favoriteFirst=false&orderDirection=asc`;
        const responses = await API.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
console.log(responses);
        // API로부터 받아온 데이터를 options 형태로 변환
// API로부터 받아온 데이터를 options 형태로 변환
const formattedData = responses.data
  .filter(room => room.sensorType === 'Air') // sensorType이 'Air'인 경우만 필터링
  .map(room => ({
    value: room.name, // value는 강의실 이름
    label: room.name  // label도 강의실 이름
  }));


        setOptions(formattedData);
      } catch (e) {
        console.error("API 오류: ", e);
        setOptions([]); // 오류 발생 시 빈 배열로 설정
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: width,
      borderRadius: '10px',
      borderColor: borderColor,
      borderWidth: borderWidth,
      borderStyle: 'solid',
      fontSize: 'clamp(10px, 1.6vw, 32px)',
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
      fontSize: 'clamp(10px, 1.6vw, 32px)',
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
      fontSize: 'clamp(5px, 1.4vw, 32px)',
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
      options={options} // API에서 변환된 options 전달
      onChange={option => onSelect(option.value)}
      styles={customStyles}
      placeholder={<span className={styles.customPlaceholder}>강의실 선택</span>}
      className={styles.NEBDropdown}
      classNamePrefix="custom-select"
      isLoading={loading} // 데이터 로딩 시 로딩 표시
    />
  );
};

export default CustomDropdown;
