import React, { useState } from 'react';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import StatusBox from '../../components/specific/comparison/StatusBox/statusBox';
import ControlBox from '../../components/common/ControlBox/ControlBox';
import PeriodDropdown from '../../components/common/periodDropdown/periodDropdown';
import WhatDropdown from '../../components/common/whatDropdown/whatDropdown';
import styles from '../../assets/styles/figures.module.css';
import bottomStyles from '../../assets/styles/comparison.module.css';
import LineChart from '../../components/specific/charts/lineChartCompare';

const Comparison = () => {
  const [selectedClassroomA, setSelectedClassroomA] = useState('');
  const [selectedClassroomB, setSelectedClassroomB] = useState('');
  const [selectedOption1, setSelectedOption1] = useState('');
  const [selectedOption2, setSelectedOption2] = useState('');
  const [noPM25A, setNoPM25A] = useState(); // Classroom A PM2.5 데이터 상태
  const [noPM25B, setNoPM25B] = useState(); // Classroom B PM2.5 데이터 상태

  const handleSelectClassroomA = (value) => {
    setSelectedClassroomA(value);
    if (selectedClassroomB === value) {
      setSelectedClassroomB(''); // A와 B가 같다면 B 초기화
    }
  };

  const handleSelectClassroomB = (value) => {
    setSelectedClassroomB(value);
    if (selectedClassroomA === value) {
      setSelectedClassroomA(''); // A와 B가 같다면 A 초기화
    }
  };

  const handleNoPm25DataA = (noData) => setNoPM25A(noData);
  const handleNoPm25DataB = (noData) => setNoPM25B(noData);

  return (
    <div>
      <Header />
      <div className={styles.mainContent}>
        <SideBar i="4" />
        <div style={{ width: '100%' }}>
          <div className={styles.top2}>
            <ControlBox width="1vw" color="#1FE5A3" height="90%" />
            <StatusBox 
              id={1}
              color="#1FE5A3" 
              onSelect={handleSelectClassroomA} 
              onNoPm25Data={handleNoPm25DataA} // PM2.5 데이터 상태 전달
              oppositeClassroom={selectedClassroomB} 
              status={selectedClassroomA} 
            />
            <div style={{ fontSize: '2vw', fontWeight: 'bold', padding: '0 1%' }}>VS</div>
            <StatusBox 
              id={2} 
              color="#1A9AFB" 
              onSelect={handleSelectClassroomB} 
              onNoPm25Data={handleNoPm25DataB} // PM2.5 데이터 상태 전달
              oppositeClassroom={selectedClassroomA} 
              status={selectedClassroomB} 
            />
            <ControlBox width="60%" height="auto" color="#1A9AFB" />
          </div>
          <div className={bottomStyles.bottom}>
            <div className={bottomStyles.box}>
              <div style={{ fontSize: '1.5vw', fontWeight: 'bold' }}>
                period
                <PeriodDropdown 
                  width="clamp(10px, 10%, 140px)" 
                  height="clamp(10px, 5vw, 56px)" 
                  onSelect={setSelectedOption1} 
                />
                <div style={{ margin: '30%' }}></div>
                what
                <WhatDropdown 
                  width="clamp(10px, 10vw, 140px)" 
                  height="clamp(10px, 5vw, 56px)" 
                  onSelect={setSelectedOption2} 
                  noPM25A={noPM25A} // Classroom A의 상태 전달
                  noPM25B={noPM25B} // Classroom B의 상태 전달
                />
              </div>
              <hr style={{ margin: '0 10px', border: '1px dashed #FFB841', filter: 'blur(2px)', height: 'clamp(10px, 90%, 1000px)', backgroundColor: '#FFB841', borderLeft: 'none' }} />
              <LineChart 
                width="100%" 
                height="95%" 
                period={selectedOption1}
                selectedAttribute={selectedOption2} 
                classroomA={selectedClassroomA} 
                classroomB={selectedClassroomB} 
                noPM25A={noPM25A} 
                noPM25B={noPM25B} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comparison;
