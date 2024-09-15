import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import NEBDropdown from '../../components/specific/figures/NEBDropdown/NEBDropdown';
import TopBox from '../../components/specific/figures/TopBox/TopBox';
import styles from '../../assets/styles/figures.module.css';
import Chart from '../../components/specific/charts/lineChart';

var buildingName = "신공학관";

function Figures() {
  const [selectedOption, setSelectedOption] = useState('');

  // 선택된 값이 변경될 때마다 호출되는 함수
  useEffect(() => {
    if (selectedOption) {
      // 선택된 값을 전송하는 로직을 여기에 추가
      console.log(`Selected option: ${selectedOption}`);
      // 예: 서버에 전송하거나 다른 작업 수행
    }
  }, [selectedOption]); // selectedOption이 변경될 때마다 실행

  const handleSelect = (value) => {
    setSelectedOption(value); // 선택된 값을 상태에 저장
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', width:'100%' }}>
        <SideBar i='2'/>
        <div style={{ width:'100%' }}>
          <div className={styles.top}> 
            <div style={{ width:'clamp(10px, 12%, 180px)' }}>
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
               <div>
                  {buildingName}
                </div>
              </div>
              <NEBDropdown onSelect={handleSelect} />
            </div>
            <TopBox image={"tempIcon.png"} value={"32"} unit={"℃"} name={"temperature"}/>
            <TopBox image={"tempIcon.png"} value={"90"} unit={"%"} name={"humidity"}/>
            <TopBox image={"tempIcon.png"} value={"500"} unit={"㎍/m³"} name={"TVOC"}/>
            <TopBox image={"tempIcon.png"} value={"32"} unit={"㎍/m³"} name={"PM2.5"}/>
          </div >
          <div className={styles.bottom}> 
          <div className={styles.leftContainer}>
              <div> 2024.09.03 PM 04:59</div>
              <div className={styles.leftBox}> 
                <div>
                  period
                  <NEBDropdown onSelect={handleSelect} />
                  what
                  <NEBDropdown onSelect={handleSelect} />
                </div>
                <div>
                  종합설계2 수업중[10/30]
                  
                </div>
              </div>
            </div>
            <div>
              <div> 
                <div> a </div>
                <div className={styles.leftBox}> b </div> 
              </div>
              <div> 
                <div> c </div>
                <div className={styles.leftBox}> d </div> 
              </div>
            </div>
          </div>
        </div>

      </div >
    </div>
  );
}

export default Figures;
