import React from 'react';
import styles from './ControlBox.module.css';

function ControlBox() {
  return (
   <div className={styles.box}>
      <div className={styles.top}>
          <img
            src={require('../../../assets/images/alarm.png')}
            alt="logo"
            className={styles.topImg}
          />
      </div>

      <div className={styles.table}>
      <div className={styles.tableRow}>
        <div className={`${styles.tableCell} ${styles.large}`}>
          TVOC
        </div>
        <div className={`${styles.tableCell} ${styles.small}`}>
          <img
            src={require('../../../assets/images/alarm.png')}
            alt="logo"
            className={styles.img}
          />
        </div>
      </div>    
      <div className={styles.tableRow}>
        <div className={`${styles.tableCell} ${styles.large}`}>
          TVOC
        </div>
        <div className={`${styles.tableCell} ${styles.small}`}>
          <img
            src={require('../../../assets/images/alarm.png')}
            alt="logo"
            className={styles.img}
          />
        </div>
      </div>    
      <div className={styles.tableRow}>
        <div className={`${styles.tableCell} ${styles.large}`}>
          TVOC
        </div>
        <div className={`${styles.tableCell} ${styles.small}`}>
          <img
            src={require('../../../assets/images/alarm.png')}
            alt="logo"
            className={styles.img}
          />
        </div>
      </div>    
      
    </div>
   </div>
  );
}

export default ControlBox;
