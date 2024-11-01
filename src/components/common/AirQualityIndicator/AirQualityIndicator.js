import React, { useContext, useState, useEffect } from 'react';
import styles from './AirQualityIndicator.module.css';
import { SensorDataContext } from '../../../API/SensorDataContext';

function AirQualityIndicator({ classRoom }) { // temperature를 props로 받음
  
  const { data: sensorData, setSelectedSensorName, loading, error } = useContext(SensorDataContext);

  useEffect(() => {
    if (classRoom) {
      setSelectedSensorName(classRoom);
    }
  }, [classRoom, setSelectedSensorName]);

  return (
    <div className={styles.table}>
      <div className={styles.tableRow}>
        <div className={styles.tableCell}>
          <img
            src={require('../../../assets/images/AirQualityIndicator/temperature.png')}
            alt="온도"
            className={styles.img}
          />
        </div>
        <div className={styles.tableCell}>온도</div>
        <div className={styles.tableCell}>{loading ? '--' : sensorData.Temperature?.value}°C</div> {/* 온도를 여기서 사용 */}
        <div className={styles.tableCell}>
          <div className={styles.state} />
        </div>
      </div>
      <div className={styles.tableRow}>
        <div className={styles.tableCell}>
          <img
            src={require('../../../assets/images/AirQualityIndicator/humidity.png')}
            alt="습도"
            className={styles.img}
          />
        </div>
        <div className={styles.tableCell}>습도</div>
        <div className={styles.tableCell}>56%</div>
        <div className={styles.tableCell}>
          <div className={styles.state} />
        </div>
      </div>
      <div className={styles.tableRow}>
        <div className={styles.tableCell}>
          <img
            src={require('../../../assets/images/AirQualityIndicator/TVOC.png')}
            alt="TVOC"
            className={styles.img}
          />
        </div>
        <div className={styles.tableCell}>TVOC</div>
        <div className={styles.tableCell}>24</div>
        <div className={styles.tableCell}>
          <div className={styles.state} />
        </div>
      </div>
      <div className={styles.tableRow}>
        <div className={styles.tableCell}>
          <img
            src={require('../../../assets/images/AirQualityIndicator/PM2.5.png')}
            alt="PM2.5"
            className={styles.img}
          />
        </div>
        <div className={styles.tableCell}>PM 2.5</div>
        <div className={styles.tableCell}>150um</div>
        <div className={styles.tableCell}>
          <div className={styles.state} />
        </div>
      </div>
      <div className={styles.tableRow}>
        <div className={styles.tableCell}>
          <img
            src={require('../../../assets/images/AirQualityIndicator/noise.png')}
            alt="소음"
            className={styles.img}
          />
        </div>
        <div className={styles.tableCell}>소음</div>
        <div className={styles.tableCell}>89dB</div>
        <div className={styles.tableCell}>
          <div className={styles.state} />
        </div>
      </div>
    </div>
  );
}

export default AirQualityIndicator;
