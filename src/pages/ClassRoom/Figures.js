import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 

// Components
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import NEBDropdown from '../../components/specific/figures/NEBDropdown/NEBDropdownLink';
import PeriodDropdown from '../../components/common/periodDropdown/periodDropdown';
import WhatCheckBoxes from '../../components/common/whatSelectBox/WhatRadioButtons';
import TopBox from '../../components/specific/figures/TopBox/TopBox';
import LineChart from '../../components/specific/charts/lineChart';
import ControlBox from '../../components/common/ControlBox/ControlBox';
import AlarmScrollBox from '../../components/specific/alarmScrollBox/alarmScrollBox';
import SignificantScrollBox from '../../components/specific/significantScrollBox/significantScrollBox';
import Star from '../../components/common/star/star';

// Styles
import styles from '../../assets/styles/figures.module.css';

// Context
import { SensorDataContext } from '../../API/SensorDataContext';

const buildingName = "신공학관";

function Figures() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [isPM2_5, setIsPM2_5] = useState(true);

  const { data: sensorData, setSelectedSensorName, loading} = useContext(SensorDataContext);

  // token 확인 및 리다이렉션
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate('/'); 
  }, [navigate]);

  // selectedOption 변경 시 센서 이름 설정
  useEffect(() => {
    if (selectedOption) setSelectedSensorName(selectedOption);
  }, [selectedOption, setSelectedSensorName]);  

  // 센서 데이터 확인 후 PM2.5 여부 설정
  useEffect(() => {
    setIsPM2_5(sensorData?.PM2_5MassConcentration ? true : false);
  }, [sensorData]);

  return (
    <div className={styles.fullScreenContainer}>
      <Header />
      <div className={styles.mainContent}>
        <SideBar i='2' />
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.currentRoom}>
              <div className={styles.titleTop}>
                <div style={{ paddingRight: '0.1vw' }}>현재 강의실</div>
                {selectedOption && (
                  <div style={{ position: 'relative', display: 'inline-block', width: 'clamp(4px, 1.2vw, 20px)' }}>
                    <Star classRoom={selectedOption} building={buildingName} />
                  </div>
                )}
              </div>
              <div className={styles.title}>
                <img src={require('../../assets/images/building.png')} alt="building" className={styles.titleImg} />
                <div>{buildingName}</div>
              </div>
              <NEBDropdown onSelect={setSelectedOption} selectedInitialValue={id} />
            </div>
            <TopBox image="tempIcon.png" value={loading ? '-' : sensorData.Temperature?.value} unit="℃" name="temp" />
            <TopBox image="humidIcon.png" value={loading ? '-' : sensorData.Humidity?.value} unit="%" name="humidity" />
            <TopBox image="TVOCIcon.png" value={loading ? '-' : sensorData.TVOC?.value} unit="㎍/m³" name="TVOC" />
            <TopBox image="PM25Icon.png" value={loading ? '-' : sensorData.PM2_5MassConcentration?.value} unit="㎍/m³" name="PM2.5" />
          </div>
          <div className={styles.bottom}>
            <div className={styles.leftContainer}>
              <div className={styles.leftBox}>
                <div className={styles.select}>
                  <div style={{ width: '100%' }}>
                    <PeriodDropdown height='clamp(10px, 5vw, 56px)' onSelect={setSelectedValue} />
                  </div>
                  <div style={{ width: '100%' }}>
                    <WhatCheckBoxes
                      selectedValues={selectedValues}
                      onSelect={(values, index) => {
                        setSelectedValues(values);
                        setHighlightedIndex(index);
                      }}
                      borderColor="#A5A5A5"
                      borderWidth="2px"
                      isPM2_5={isPM2_5}
                    />
                  </div>
                </div>
                <hr className={styles.verticalLine} />
                <LineChart width='100%' selectedValues={selectedValues} highlightedIndex={highlightedIndex} classRoom={selectedOption} period={selectedValue} isPM2_5={isPM2_5} />
              </div>
            </div>
            <div className={styles.rightContainer}>
              <AlarmScrollBox title="alarms(24H)" classRoom={selectedOption} />
              <SignificantScrollBox title="significant" classRoom={selectedOption} />
              <ControlBox title="facility control" room={selectedOption}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Figures;
