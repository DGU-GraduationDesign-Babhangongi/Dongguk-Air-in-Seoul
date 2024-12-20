import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import styles from './Dropbutton.module.css';

const Dropbutton = ({
  onSelect,
  borderColor = '#A5A5A5',
  borderWidth = '1px',
  width = '100%',
  height = 'auto',
  value, // 부모에서 전달받는 선택된 값
}) => {
  const [buildingOptions, setBuildingOptions] = useState([]); // 상태로 관리
  const [loading, setLoading] = useState(true); // Start with loading set to true
  const token = localStorage.getItem('token'); // Assume token is stored in localStorage

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await fetch('https://donggukseoul.com/api/buildings', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const options = data.map((building) => ({
            value: building.id,  // assuming `id` is a unique identifier for the building
            label: building.name, // assuming `name` is the label you want to display
          }));
          setBuildingOptions(options);  // Update the state with building options
        } else {
          console.error('Failed to fetch building data');
        }
      } catch (error) {
        console.error('Error fetching building data:', error);
      } finally {
        setLoading(false); // Stop loading after the fetch completes
      }
    };

    fetchBuildings();
  }, [token]); // Dependency on token to refetch when token changes

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
    <>
      {loading ? (
        <div>Loading...</div> // You can customize this part with a loading spinner or any placeholder
      ) : (
        <Select
          value={buildingOptions.find(option => option.value === value)} // Find selected option by value
          options={buildingOptions} // 전역 상태로 관리하는 buildingOptions를 전달
          onChange={(option) => onSelect(option?.label)} // 선택된 value를 부모로 전달
          styles={customStyles}
          placeholder={<span className={styles.customPlaceholder}>건물 선택</span>}
          className={styles.NEBDropdown}
        />
      )}
    </>
  );
};

export default Dropbutton;
