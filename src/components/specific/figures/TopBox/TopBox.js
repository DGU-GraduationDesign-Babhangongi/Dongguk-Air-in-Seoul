import React from 'react';

import styles from './TopBox.module.css';

function TopBox({ image, value, unit, name }) {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.inline}>
        
          <div className={styles.IconCircle}>
            <img
              src={require(`../../../../assets/images/TopIcons/${image}`)}
              alt="icon"
              className={styles.IconImg}
            />
          </div>
         
          <div className={styles.text}>
            <div style={{ display: 'flex' }}>
              <div style={{marginRight:'5%'}}>{value}</div>
              <div className={styles.unit}>{unit}</div>
            </div>
            <div className={styles.name}>{name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBox;
