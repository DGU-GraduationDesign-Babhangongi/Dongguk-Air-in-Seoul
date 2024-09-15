import React from 'react';
import styles from './AirQualityIndicator.module.css';

function AirQualityIndicator() {
  return (
    <div className={styles.table}>
      <div className={styles.tableRow}>
        <div className={styles.tableCell}>
          <img
            src={require('../../../assets/images/alarm.png')}
            alt="logo"
            className={styles.img}
          />
        </div>
        <div className={styles.tableCell}>
          온도
        </div>
        <div className={styles.tableCell}>
          24°C
        </div>
        <div className={styles.tableCell}>
          <img
            src={require('../../../assets/images/alarm.png')}
            alt="logo"
            className={styles.img}
          />
        </div>
      </div>
      <div className={styles.tableRow}>
        <div className={styles.tableCell}>
          <img
            src={require('../../../assets/images/alarm.png')}
            alt="logo"
            className={styles.img}
          />
        </div>
        <div className={styles.tableCell}>
          습도
        </div>
        <div className={styles.tableCell}>
          24°C
        </div>
        <div className={styles.tableCell}>
          <img
            src={require('../../../assets/images/alarm.png')}
            alt="logo"
            className={styles.img}
          />
        </div>
      </div>
      <div className={styles.tableRow}>
        <div className={styles.tableCell}>
          <img
            src={require('../../../assets/images/alarm.png')}
            alt="logo"
            className={styles.img}
          />
        </div>
        <div className={styles.tableCell}>
          TVOC
        </div>
        <div className={styles.tableCell}>
          24°C
        </div>
        <div className={styles.tableCell}>
          <img
            src={require('../../../assets/images/alarm.png')}
            alt="logo"
            className={styles.img}
          />
        </div>
      </div>
      <div className={styles.tableRow}>
        <div className={styles.tableCell}>
          <img
            src={require('../../../assets/images/alarm.png')}
            alt="logo"
            className={styles.img}
          />
        </div>
        <div className={styles.tableCell}>
          PM 2.5
        </div>
        <div className={styles.tableCell}>
          150um
        </div>
        <div className={styles.tableCell}>
          <img
            src={require('../../../assets/images/alarm.png')}
            alt="logo"
            className={styles.img}
          />
        </div>
      </div>
      <div className={styles.tableRow}>
        <div className={styles.tableCell}>
          <img
            src={require('../../../assets/images/alarm.png')}
            alt="logo"
            className={styles.img}
          />
        </div>
        <div className={styles.tableCell}>
          소음
        </div>
        <div className={styles.tableCell}>
          24°C
        </div>
        <div className={styles.tableCell}>
          <img
            src={require('../../../assets/images/alarm.png')}
            alt="logo"
            className={styles.img}
          />
        </div>
      </div>
    </div>
  );
}

export default AirQualityIndicator;
