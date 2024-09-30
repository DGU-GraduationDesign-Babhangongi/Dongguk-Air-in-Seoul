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
  const [selectedOption2, setSelectedOption2] = useState(''); // selectedOption2 상태
  const [classroomA, setClassroomA] = useState(""); // 초기값
  const [classroomB, setClassroomB] = useState(""); // 초기값
  
  useEffect(() => {
    if (selectedOption1) { // 올바른 변수명 사용
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
    setSelectedOption2(value); // selectedOption2 상태 업데이트
  };

  const handleClassroomAChange = (value) => {
    setClassroomA(value); // StatusBox 1에서 선택된 값
  };

  const handleClassroomBChange = (value) => {
    setClassroomB(value); // StatusBox 2에서 선택된 값
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', width: '100%' }}>
        <SideBar i='4' />
        <div style={{ width: '100%' }}>
          <div className={styles.top}>
            <ControlBox />
            <StatusBox id='1' color='#1FE5A3' onSelect={handleClassroomAChange} /> {/* StatusBox 1 */}
            <div style={{ fontSize: '1.5vw' }}>vs</div>
            <StatusBox id='2' color='#1A9AFB' onSelect={handleClassroomBChange} /> {/* StatusBox 2 */}
            <ControlBox />
          </div>
          <div className={bottomStyles.bottom}>
            <div>2024.09.03 PM 04:59</div>
            <div className={bottomStyles.box}>
              <div>
                period
                <PeriodDropdown width='clamp(10px, 10vw, 140px)' height='clamp(10px, 5vw, 56px)' onSelect={handleSelect1} />
                <div style={{ margin: '30%' }}></div>
                what
                <WhatDropdown width='clamp(10px, 10vw, 140px)' height='clamp(10px, 5vw, 56px)' onSelect={handleSelect2} />
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
              <LineChart width='58vw' height='80%' selectedAttribute={selectedOption2} classroomA={classroomA} classroomB={classroomB} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comparison;
