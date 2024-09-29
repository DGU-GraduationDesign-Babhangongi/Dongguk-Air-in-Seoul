import React from 'react';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import AirQualityIndicator from '../../components/common/ControlBox/ControlBox';
import ControlBox from '../../components/common/AirQualityIndicator/AirQualityIndicator';
import ManageAll from '../../components/common/ManageAll/ManageAll';
import styles from '../../assets/styles/Manager.module.css';
import { GoPerson } from "react-icons/go";

function Manager() {
    return (
      <div>
        {/* 상단 헤더 */}
        <Header />
  
        <div className={styles.layout}>
          {/* 사이드바 */}
          <SideBar />
          <div className={styles.container}>
          {/* 메인 콘텐츠 영역 */}
          
          <div className={styles.banner}>
                <GoPerson size={36} color="#333" />
                <h1>이수민 관리자</h1>
            </div>
            {/* 강의실 상태 카드 그리드 */}
            <div className={styles.grid}>
              {/* 여러 개의 AirQualityCard 컴포넌트를 그리드 형식으로 배치 */}
              <ManageAll />
              <ManageAll />
              <ManageAll />
              <ManageAll />
              <ManageAll />
              <ManageAll />
          </div>
        </div>
      </div>
      </div>
   
    );
  }
  
  export default Manager;