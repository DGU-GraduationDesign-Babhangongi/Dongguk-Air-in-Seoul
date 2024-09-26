import React, { useState, useEffect } from 'react';
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

const buildingName = "신공학관";

function Figures() {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedValue, setSelectedValue] = useState('temperature');
  const [selectedValues, setSelectedValues] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null); // 새로운 상태 추가

  useEffect(() => {
    if (selectedOption) {
      console.log(`Selected option: ${selectedOption}`);
    }
  }, [selectedOption]);

  const handleSelect = (value) => {
    setSelectedOption(value);
  };

  const handleValueSelect = (value) => {
    setSelectedValue(value);
  };

  const handleCheckboxSelect = (values, index) => {
    setSelectedValues(values);
    setHighlightedIndex(index); // 선택된 항목의 인덱스를 설정
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', width: '100%' }}>
        <SideBar i='2' />
        <div style={{ width: '100%' }}>
          <div className={styles.top}>
            <div style={{ width: 'clamp(10px, 12%, 180px)' }}>
              <div className={styles.titleTop}>
                <div>현재 강의실</div>
                <img
                  src={require('../../assets/images/star.png')}
                  alt="building"
                  className={styles.titleTopImg}
                />
              </div>
              <div className={styles.title}>
                <img
                  src={require('../../assets/images/building.png')}
                  alt="building"
                  className={styles.titleImg}
                />
                <div>{buildingName}</div>
              </div>
              <NEBDropdown onSelect={handleSelect} />
            </div>
            <TopBox image="tempIcon.png" value="32" unit="℃" name="temp" />
            <TopBox image="humidIcon.png" value="90" unit="%" name="humidity" />
            <TopBox image="TVOCIcon.png" value="500" unit="㎍/m³" name="TVOC" />
            <TopBox image="PM25Icon.png" value="32" unit="㎍/m³" name="PM2.5" />
          </div>
          <div className={styles.bottom}>
            <div className={styles.leftContainer}>
              <div style={{ width: '100%' }}>2024.09.03 PM 04:59</div>
              <div className={styles.leftBox}>
                <div className={styles.select}>
                  <div style={{ width: '80%' }}>
                    period
                    <PeriodDropdown width='100%' height='clamp(10px, 5vw, 56px)' onSelect={handleSelect} />
                  </div>
                  <div style={{ width: '80%' }}>
                    what
                    <WhatCheckBoxes
                      width='90%' 
                      selectedValues={selectedValues}
                      onSelect={handleCheckboxSelect} // 수정된 함수 사용
                      borderColor="#A5A5A5"
                      borderWidth="2px"
                    />
                  </div>
                </div>
                <hr
                  style={{
                    margin: '0 10px',
                    border: '1px dashed #FFB841',
                    filter: 'blur(2px)',
                    height: 'clamp(10px, 90%, 1000px)',
                    backgroundColor: '#FFB841',
                    borderLeft: 'none',
                  }}
                />
                <div>
                  종합설계2 수업중[10/30]
                  <LineChart selectedValues={selectedValues} highlightedIndex={highlightedIndex} /> {/* highlightedIndex 사용 */}
                </div>
              </div>
            </div>
            <div></div>
            <div className={styles.rightContainer}>
              <div style={{ width: '100%' }}>
                <div>alarms</div>
                <AlarmScrollBox />
              </div>
              <div style={{ width: '100%' }}>
                <div>significant</div>
                <AlarmScrollBox />
              </div>
              <div style={{ width: '100%' }}>
                <div>facility control</div>
                <ControlBox />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Figures;
