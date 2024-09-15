import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import StatusBox from '../../components/specific/comparison/StatusBox/statusBox';
import ControlBox from '../../components/common/ControlBox/ControlBox';

import styles from '../../assets/styles/figures.module.css';
import bottomStyles from '../../assets/styles/comparison.module.css';


var buildingName = "신공학관";

function Comparison() {
  const [selectedOption1, setSelectedOption1] = useState('');
  const [selectedOption2, setSelectedOption2] = useState('');

  // 선택된 값이 변경될 때마다 호출되는 함수
  useEffect(() => {
    if (selectedOption1) {
      // 선택된 값을 전송하는 로직을 여기에 추가
      console.log(`Selected option: ${selectedOption1}`);
      // 예: 서버에 전송하거나 다른 작업 수행
    }
    if (selectedOption2) {
      // 선택된 값을 전송하는 로직을 여기에 추가
      console.log(`Selected option: ${selectedOption2}`);
      // 예: 서버에 전송하거나 다른 작업 수행
    }
  }, [selectedOption2]); // selectedOption이 변경될 때마다 실행

  const handleSelect1 = (value) => {
    setSelectedOption1(value); // 선택된 값을 상태에 저장
        setSelectedOption1(value); // 선택된 값을 상태에 저장
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', width:'100%' }}>
        <SideBar i='2'/>
        <div style={{ width:'100%' }}>
          <div className={styles.top}> 
            <ControlBox/>
            <StatusBox color='#1FE5A3'/>     

            <div style={{ fontSize:'1.5vw' }}>vs</div>
            <StatusBox color='#1A9AFB'/>       
            <ControlBox/>  
          </div >
          <div className={bottomStyles.bottom}> 
              <div> 2024.09.03 PM 04:59</div>
              <div className={bottomStyles.box}>
             
             
          </div>

          </div>
        </div>

      </div >
    </div>
  );
}

export default Comparison;
