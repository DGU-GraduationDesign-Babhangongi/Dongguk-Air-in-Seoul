import React, { useState, useContext, useEffect } from 'react';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import NEBDropdown from '../../components/specific/figures/NEBDropdown/NEBDropdown';
import PeriodDropdown from '../../components/common/periodDropdown/periodDropdown';
import WhatCheckBoxes from '../../components/common/whatSelectBox/WhatRadioButtons';
import TopBox from '../../components/specific/figures/TopBox/TopBox';
import styles from '../../assets/styles/figures.module.css';
import LineChart from '../../components/specific/charts/lineChart';
import ControlBox from '../../components/specific/ControlBox/ControlBox';
import AlarmScrollBox from '../../components/specific/alarmScrollBox/alarmScrollBox';
import { SensorDataContext } from '../../API/SensorDataContext';
import { FaStar, FaRegStar } from "react-icons/fa";

const buildingName = "신공학관";

function Figures() {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false); // 즐겨찾기 상태 관리

  const { data: sensorData, setSelectedSensorName, loading, error } = useContext(SensorDataContext);

  useEffect(() => {
    if (selectedOption) {
      setSelectedSensorName(selectedOption);
    }
  }, [selectedOption, setSelectedSensorName]);

  const handleNEBSelect = (value) => setSelectedOption(value);
  const handlePeriodSelect = (value) => setSelectedValue(value);
  const handleCheckboxSelect = (values, index) => {
    setSelectedValues(values);
    setHighlightedIndex(index);
  };

  // 즐겨찾기 버튼 클릭 시 색상 변경 함수
  const handleFavoriteClick = () => {
    setIsFavorited((prev) => !prev); // 상태를 반전시켜 색상 변경
    favoriteFunction(); // 클릭 시 호출할 함수
  };

  // 실제로 동작할 함수 (실제 동작은 필요 없으므로 빈 함수로 설정)
  const favoriteFunction = () => {
    console.log('즐겨찾기 클릭됨');
  };

  return (
    <div className={styles.fullScreenContainer}>
      <Header />
      <div className={styles.mainContent}>
        <SideBar i='2' />
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.currentRoom}>
              <div className={styles.titleTop}>
                <div style={{paddingRight: '0.1vw'}}>현재 강의실</div>
                {/* 즐겨찾기 아이콘 */}
                <div style={{ position: 'relative', display: 'inline-block', width: 'clamp(4px, 1.2vw, 20px)' }}>

{/* 메인 아이콘 */}
<FaStar
  size={'68%'} // 실제 아이콘 크기
  color={isFavorited ? '#FFD700' : '#A5A5A5'} // 메인 색상
  onClick={handleFavoriteClick}
  style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)', // 중앙으로 이동
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    zIndex: 1,
  }}
/>  {/* 테두리 역할을 하는 아이콘 */}
<FaRegStar
  size={'100%'} // 테두리 크기, 부모 요소의 크기에 맞춰 설정
  color="#000000" // 테두리 색상
  style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)', // 중앙으로 이동
    zIndex: 0,
  }}
/>
</div>
              </div>
              <div className={styles.title}>
                <img
                  src={require('../../assets/images/building.png')}
                  alt="building"
                  className={styles.titleImg}
                />
                <div>{buildingName}</div>
              </div>
              <NEBDropdown onSelect={handleNEBSelect} />
            </div>
            <TopBox image="tempIcon.png" value={loading ? '--' : sensorData.Temperature?.value} unit="℃" name="temp" />
            <TopBox image="humidIcon.png" value={loading ? '--' : sensorData.Humidity?.value} unit="%" name="humidity" />
            <TopBox image="TVOCIcon.png" value={loading ? '--' : sensorData.TVOC?.value} unit="㎍/m³" name="TVOC" />
            <TopBox image="PM25Icon.png" value={loading ? '--' : sensorData.PM2_5MassConcentration?.value} unit="㎍/m³" name="PM2.5" />
          </div>
          <div className={styles.bottom}>
            <div className={styles.leftContainer}>
              <div className={styles.leftBox}>
                <div className={styles.select}>
                  <div style={{ width: '100%' }}>
                    <PeriodDropdown height='clamp(10px, 5vw, 56px)' onSelect={handlePeriodSelect} />
                  </div>

                  <div style={{ width: '100%' }}>
                    <WhatCheckBoxes
                      selectedValues={selectedValues}
                      onSelect={handleCheckboxSelect}
                      borderColor="#A5A5A5"
                      borderWidth="2px"
                    />
                  </div>
                </div>

                <hr className={styles.verticalLine} />
                <LineChart width='100%' selectedValues={selectedValues} highlightedIndex={highlightedIndex} classRoom={selectedOption} period={selectedValue} />
              </div>
            </div>
            <div className={styles.rightContainer}>
              <AlarmScrollBox title="alarms" />
              <AlarmScrollBox title="significant" />
              <ControlBox title="facility control" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Figures;
