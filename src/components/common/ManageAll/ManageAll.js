import React from 'react';
import styles from './ManageAll.module.css'; // CSS 파일 연결

function ManageAll() {
  return (
    <div className={styles.card}>
      {/* 왼쪽 섹션: 아이콘과 데이터 */}
      <div className={styles.leftSection}>
        <div className={styles.icon}>
          <img
            src={require('../../../assets/images/building.png')}
            alt="Building Icon"
          />
        </div>
        <div className={styles.roomInfo}>
          <h3>신공학관</h3>
          <h2>4147</h2>
        </div>
        <div className={styles.star}>
          <img
            src={require('../../../assets/images/star.png')}
            alt="Star Icon"
          />
        </div>
        {/* 메모 수정 버튼 */}
      <div className={styles.memoEdit}>
        <img src={require('../../../assets/images/edit.png')} alt="Edit Icon" />
        <span>메모수정</span>
      </div>
      </div>

      {/* 센서 정보 */}
      <div className={styles.sensorSection}>
        <div className={styles.sensorItem}>
          <img src={require('../../../assets/images/AirQualityIndicator/temperature.png')} alt="Temperature Icon" />
          <span>온도</span>
          <span>24°C</span>
          <div className={styles.statusDot}></div>
        </div>

        <div className={styles.sensorItem}>
          <img src={require('../../../assets/images/AirQualityIndicator/humidity.png')} alt="Humidity Icon" />
          <span>습도</span>
          <span>56%</span>
          <div className={styles.statusDot}></div>
        </div>

        <div className={styles.sensorItem}>
          <img src={require('../../../assets/images/AirQualityIndicator/TVOC.png')} alt="TVOC Icon" />
          <span>TVOC</span>
          <span>23</span>
          <div className={styles.statusDot}></div>
        </div>

        <div className={styles.sensorItem}>
          <img src={require('../../../assets/images/AirQualityIndicator/PM2.5.png')} alt="PM 2.5 Icon" />
          <span>PM 2.5</span>
          <span>150um</span>
          <div className={styles.statusDot}></div>
        </div>

        <div className={styles.sensorItem}>
          <img src={require('../../../assets/images/AirQualityIndicator/noise.png')} alt="Noise Icon" />
          <span>소음</span>
          <span>89dB</span>
          <div className={styles.statusDot}></div>
        </div>
      </div>

      {/* 우측 섹션: 장치 제어 */}
      <div className={styles.controlSection}>
        <div>
          <span>Air conditioner</span>
          <input type="checkbox" />
        </div>

        <div>
          <span>Ventilator</span>
          <input type="checkbox" />
        </div>

        <div>
          <span>Air cleaner</span>
          <input type="checkbox" />
        </div>
      </div>

      
    </div>
  );
}

export default ManageAll;
