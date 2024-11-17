import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';  // useLocation 추가
import Select from 'react-select';
import API from '../../../../API/api';

const CustomDropdown = ({ onSelect, selectedInitialValue, borderColor = '#A5A5A5', borderWidth = '1px', width = '100%' }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState(null);
  const navigate = useNavigate();  // React Router의 useNavigate 사용
  const location = useLocation();  // useLocation 추가

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

        const formattedData = responses.data
          .filter(room => room.sensorType === 'Air')
          .map(room => ({
            value: room.name,
            label: room.name,
            favorited: room.favorited
          }));

        setOptions(formattedData);
      } catch (e) {
        console.error("API 오류: ", e);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedInitialValue && options.length > 0) {
      const defaultOption = options.find(option => option.value === selectedInitialValue);
      if (defaultOption) {
        setSelectedValue(defaultOption);
        onSelect(defaultOption.value, defaultOption.favorited);
      }
    }
  }, [options, selectedInitialValue, onSelect]);

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

  const removeIdAndUpdate = (newValue) => {
    let newPath = location.pathname;

    // 경로 맨 뒤에 숫자가 있으면 이를 제거하고 새 값 추가
    const pathParts = newPath.split('/');
    const lastPart = pathParts[pathParts.length - 1];

    if (!isNaN(lastPart)) {
      // 마지막 부분이 숫자라면 제거하고 새 값 추가
      pathParts.pop(); 
      newPath = `${pathParts.join('/')}/${newValue}`;
    } else {
      // 숫자가 아니면 기존 경로 뒤에 추가
      newPath = `${newPath}/${newValue}`;
    }

    navigate(newPath);  // 새 경로로 이동
  };

  const handleChange = (option) => {
    setSelectedValue(option);  // 선택된 값으로 상태 업데이트
    onSelect(option.value, option.favorited);  // onSelect 호출
    removeIdAndUpdate(option.value);  // 새 경로로 업데이트
  };

  return (
    <Select
      options={options}
      value={selectedValue}  // 상태로 관리된 value 사용
      onChange={handleChange}  // 선택 시 주소 변경
      styles={customStyles}
      isLoading={loading}
      placeholder="Select Class"
    />
  );
};

export default CustomDropdown;
