import React, { useState } from 'react';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import styles from '../../assets/styles/figures.module.css';

function Log() {
  const sensorData = [
    { date: '2024.07.21 AM 02:23', room: '신공학관 3173 강의실', pm25: 50 },
    { date: '2024.07.21 AM 02:23', room: '신공학관 3173 강의실', pm25: 50 },
    { date: '2024.07.21 AM 02:23', room: '신공학관 3173 강의실', pm25: 50 },
    { date: '2024.07.21 AM 02:23', room: '신공학관 3173 강의실', pm25: 50 },
    { date: '2024.07.21 AM 02:23', room: '신공학관 3173 강의실', pm25: 50 },
    { date: '2024.07.21 AM 02:23', room: '신공학관 3173 강의실', pm25: 50 },
    { date: '2024.07.21 AM 02:23', room: '신공학관 3173 강의실', pm25: 50 },
  ];

  const getBorderColor = (pm25) => {
    if (pm25 > 50) return 'red';
    if (pm25 > 35) return 'orange';
    return 'green';
  };

  return (
      
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        <SideBar i='두꺼울 글씨' />
        <div className={styles.top}>
          {/* Date and Time Filters */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
            <div>
              <label>강의실: </label>
              <select>
                <option>3173</option>
                
              </select>
            </div>
            <div>
              <label>기간: </label>
              <input type="datetime-local" /> - <input type="datetime-local" />
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
          {/* Table for sensor data */}
          <div style={{ marginTop: '20px', padding: '10px' }}>
            {sensorData.map((data, index) => (
              <div
                key={index}
                style={{
                  border: `2px solid ${getBorderColor(data.pm25)}`,
                  marginBottom: '10px',
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{`[${data.date}]`}</span>
                <span>{data.room}</span>
                <span>{`PM2.5: ${data.pm25}`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Log;
