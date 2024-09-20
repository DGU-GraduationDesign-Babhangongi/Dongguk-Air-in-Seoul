import React from 'react';
import styles from './alarmScrollBox.module.css'; // CSS 모듈 import

const AlarmScrollBox = () => {
  return (
    <div className={styles.scrollableContainer}>
      {/* 스크롤할 내용 */}
      <div>[2024.07.20 PM 23:56]
        PM2.5 수치 이상
      </div>
      <div>[2024.07.20 PM 23:56]
        PM2.5 수치 이상
      </div>
      <div>[2024.07.20 PM 23:56]
        PM2.5 수치 이상
      </div>
      <div>[2024.07.20 PM 23:56]
        PM2.5 수치 이상
      </div>
      <div>[2024.07.20 PM 23:56]
        PM2.5 수치 이상
      </div>
      <div>[2024.07.20 PM 23:56]
        PM2.5 수치 이상
      </div>

    </div>
  );
};

export default AlarmScrollBox;
