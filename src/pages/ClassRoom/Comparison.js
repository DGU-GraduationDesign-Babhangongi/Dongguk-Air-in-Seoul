import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// component
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import StatusBox from '../../components/specific/comparison/StatusBox/statusBox';
import ControlBox from '../../components/common/ControlBox/ControlBox';
import PeriodDropdown from '../../components/common/periodDropdown/periodDropdown';
import WhatDropdown from '../../components/common/whatDropdown/whatDropdown';
import LineChart from '../../components/specific/charts/lineChartCompare';

// style
import styles from '../../assets/styles/figures.module.css';
import bottomStyles from '../../assets/styles/comparison.module.css';


const Comparison = () => {
  const navigate = useNavigate();
  const [selectedClassroomA, setSelectedClassroomA] = useState('');
  const [selectedClassroomB, setSelectedClassroomB] = useState('');
  const [selectedOption1, setSelectedOption1] = useState('');
  const [selectedOption2, setSelectedOption2] = useState('');
  const [noPM25A, setNoPM25A] = useState(); // PM2.5 데이터 A
  const [noPM25B, setNoPM25B] = useState(); // PM2.5 데이터 B
  
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate('/');
  }, [navigate]);

  // Classroom 선택 처리
  const handleSelectClassroomA = (value) => {
    setSelectedClassroomA(value);
    if (selectedClassroomB === value) setSelectedClassroomB('');
  };
  const handleSelectClassroomB = (value) => {
    setSelectedClassroomB(value);
    if (selectedClassroomA === value) setSelectedClassroomA('');
  };

  return (
    <div>
      <Header />
      <div className={styles.mainContent}>
        <SideBar i="4" />
        <div style={{ width: '100%' }}>
          <div className={styles.top2}>
            {/* Classroom A */}
            <ControlBox width="60%" color="#1FE5A3" height="100%" maxWidth='180px' room={selectedClassroomA}/>
            <StatusBox 
              id={1}
              color="#1FE5A3" 
              onSelect={handleSelectClassroomA} 
              onNoPm25Data={setNoPM25A} 
              oppositeClassroom={selectedClassroomB} 
              status={selectedClassroomA} 
            />
            <div style={{ fontSize: '2vw', fontWeight: 'bold', padding: '0 1%' }}>VS</div>
            
            {/* Classroom B */}
            <StatusBox 
              id={2} 
              color="#1A9AFB" 
              onSelect={handleSelectClassroomB} 
              onNoPm25Data={setNoPM25B} 
              oppositeClassroom={selectedClassroomA} 
              status={selectedClassroomB} 
            />
            <ControlBox width="60%" height="100%" color="#1A9AFB" maxWidth='175px' room={selectedClassroomB}/>
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
                  noPM25A={noPM25A} 
                  noPM25B={noPM25B} 
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
