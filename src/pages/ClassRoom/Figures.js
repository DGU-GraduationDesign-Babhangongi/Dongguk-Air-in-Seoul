import React, { useState, useContext, useEffect } from 'react';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import NEBDropdown from '../../components/specific/figures/NEBDropdown/NEBDropdownLink';
import PeriodDropdown from '../../components/common/periodDropdown/periodDropdown';
import WhatCheckBoxes from '../../components/common/whatSelectBox/WhatRadioButtons';
import TopBox from '../../components/specific/figures/TopBox/TopBox';
import styles from '../../assets/styles/figures.module.css';
import LineChart from '../../components/specific/charts/lineChart';
import ControlBox from '../../components/specific/ControlBox/ControlBox';
import AlarmScrollBox from '../../components/specific/alarmScrollBox/alarmScrollBox';
import SignificantScrollBox from '../../components/specific/significantScrollBox/significantScrollBox';
import { useParams } from 'react-router-dom';
import { SensorDataContext } from '../../API/SensorDataContext';
import Star from '../../components/common/star/star';

const buildingName = "신공학관";

function Figures() {
  const { id } = useParams();
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedFavorited, setSelectedFavorited] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [isPM2_5, setIsPM2_5] = useState(true);

  const { data: sensorData, setSelectedSensorName, loading, error } = useContext(SensorDataContext);

  useEffect(() => {
    if (selectedOption) {
      setSelectedSensorName(selectedOption);
    }
  }, [selectedOption, setSelectedSensorName]);

  useEffect(() => {
    if (sensorData && !sensorData.PM2_5MassConcentration) {
      setIsPM2_5(false);
    } else {
      setIsPM2_5(true);
    }
  }, [sensorData]);

  const handleNEBSelect = (value, favorited) => {
    setSelectedOption(value);
    setSelectedFavorited(favorited);
  };

  const handlePeriodSelect = (value) => setSelectedValue(value);
  const handleCheckboxSelect = (values, index) => {
    setSelectedValues(values);
    setHighlightedIndex(index);
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
                <div style={{ paddingRight: '0.1vw' }}>현재 강의실</div>
                <div style={{ position: 'relative', display: 'inline-block', width: 'clamp(4px, 1.2vw, 20px)' }}>
                  <Star classRoom={selectedOption} building={buildingName} selectedFavorited={selectedFavorited} />
                </div>
              </div>
              <div className={styles.title}>
                <img src={require('../../assets/images/building.png')} alt="building" className={styles.titleImg} />
                <div>{buildingName}</div>
              </div>
              <NEBDropdown onSelect={handleNEBSelect} selectedInitialValue={id} />
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
                      isPM2_5={isPM2_5}
                    />
                  </div>
                </div>

                <hr className={styles.verticalLine} />
                <LineChart width='100%' selectedValues={selectedValues} highlightedIndex={highlightedIndex} classRoom={selectedOption} period={selectedValue} isPM2_5={isPM2_5} />
              </div>
            </div>
            <div className={styles.rightContainer}>
              <AlarmScrollBox title="alarms" classRoom={selectedOption} />
              <SignificantScrollBox title="significant" classRoom={selectedOption} />
              <ControlBox title="facility control" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Figures;
