import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import StatusBox from '../../components/specific/comparison/StatusBox/statusBox';
import ControlBox from '../../components/common/ControlBox/ControlBox';
import PeriodDropdown from '../../components/common/periodDropdown/periodDropdown';
import WhatDropdown from '../../components/common/whatDropdown/whatDropdown';

import styles from '../../assets/styles/figures.module.css';
import bottomStyles from '../../assets/styles/comparison.module.css';
import LineChart from '../../components/specific/charts/lineChartCompare';

const buildingName = "신공학관";

function Comparison() {
  const [selectedOption1, setSelectedOption1] = useState('');
  const [selectedOption2, setSelectedOption2] = useState('');  // 속성 선택 상태

  useEffect(() => {
    if (selectedOption1) {
      console.log(`Selected option1: ${selectedOption1}`);
    }
    if (selectedOption2) {
      console.log(`Selected option2: ${selectedOption2}`);
    }
  }, [selectedOption1, selectedOption2]);

  const handleSelect1 = (value) => {
    setSelectedOption1(value);
  };

  const handleSelect2 = (value) => {
    setSelectedOption2(value);  // 속성 선택
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', width: '100%' }}>
        <SideBar i='4'/>
        <div style={{ width: '100%' }}>
          <div className={styles.top}>
            <ControlBox/>
            <StatusBox id='1' color='#1FE5A3'/>
            <div style={{ fontSize: '1.5vw' }}>vs</div>
            <StatusBox id='2' color='#1A9AFB'/>
            <ControlBox/>
          </div>
          <div className={bottomStyles.bottom}>
            <div>2024.09.03 PM 04:59</div>
            <div className={bottomStyles.box}>
              <div>
                period
                <PeriodDropdown width='clamp(10px, 10vw, 140px)' height='clamp(10px, 5vw, 56px)' onSelect={handleSelect1}/>
                <div style={{margin:'30%'}}></div>
                what
                <WhatDropdown width='clamp(10px, 10vw, 140px)' height='clamp(10px, 5vw, 56px)' onSelect={handleSelect2}/>
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
              {/* selectedOption2를 LineChart에 전달 */}
              <LineChart width='58vw' height='58vh' selectedAttribute={selectedOption2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comparison;
