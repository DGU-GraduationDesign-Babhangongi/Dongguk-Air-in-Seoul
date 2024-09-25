import React from 'react';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import AirQualityIndicator from '../../components/common/ControlBox/ControlBox';
import ControlBox from '../../components/common/AirQualityIndicator/AirQualityIndicator';
import ManageAll from '../../components/common/ManageAll/ManageAll';
import styles from '../../assets/styles/Manager.module.css';

function Manager() {
    return (
      <div>
        {/* 상단 헤더 */}
        <Header />
  
        <div className={styles.layout}>
          {/* 사이드바 */}
          <SideBar />
  
          {/* 메인 콘텐츠 영역 */}
          <div className={styles.content}>
            {/* 사용자 정보 섹션 */}
            <div className={styles.userInfo}>
              <div className={styles.userName}>
                <img
                  src={require('../../assets/images/user.png')}
                  alt="User Icon"
                  className={styles.userIcon}
                />
                <span>이수민 관리자</span>
              </div>
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