import React, { useState, useEffect } from 'react';
import styles from './AirQualityIndicator.module.css';
import API from '../../../API/api';

function AirQualityIndicator({ classRoom, onNoPm25Data }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedSensorName, setSelectedSensorName] = useState(classRoom || '');

  const statusColorMap = {
    Excellent: '#4CAF50',  // 상록수 색상
    Good: '#8BC34A',       // 라임 색상
    Fair: '#FFEB3B',       // 밝은 노란색
    Poor: '#FF9800',       // 주황색
    Inadequate: '#F44336', // 붉은색
    NoData: '#9E9E9E'      // 회색
  };

  const fetchData = async (name) => {
    if (!name) return null;

    const endpoint = `/api/sensorData/recent/classroom?building=` + encodeURIComponent("신공학관") + `&name=` + encodeURIComponent(name);

    setLoading(true);
    try {
      const response = await API.get(endpoint);
      console.log("주소:", endpoint); 
      setData(response.data);
      console.log("응답 데이터:", response.data); 
    } catch (e) {
      console.error("API 오류: ", e);   
      setData({}); // 오류 시 데이터 초기화
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSensorName) {
      fetchData(selectedSensorName);
    }

    const intervalId = setInterval(() => {
      if (selectedSensorName) {
        fetchData(selectedSensorName);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [selectedSensorName]);

  useEffect(() => {
    if (classRoom) {
      setSelectedSensorName(classRoom);
    }
  }, [classRoom]);

  useEffect(() => {
    if (!data.PM2_5MassConcentration?.value && onNoPm25Data) {
      onNoPm25Data(false); // PM2.5 데이터가 없으면 true로 설정
    } else if (data.PM2_5MassConcentration?.value && onNoPm25Data) {
      onNoPm25Data(true); // PM2.5 데이터가 있으면 false로 설정
    }
  }, [data, onNoPm25Data]);
  
  

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
        <div className={styles.tableCell}>{loading ? '--' : data.Temperature?.value}°C</div>
        <div className={styles.tableCell}>
          <div className={styles.state} style={{ backgroundColor: statusColorMap[data.AQMScores?.temperatureStatus] }} />
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
        <div className={styles.tableCell}>{loading ? '--' : data.Humidity?.value}%</div>
        <div className={styles.tableCell}>
          <div className={styles.state} style={{ backgroundColor: statusColorMap[data.AQMScores?.humidityStatus] }} />
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
        <div className={styles.tableCell}>{loading ? '--' : data.TVOC?.value}㎍/m³</div>
        <div className={styles.tableCell}>
          <div className={styles.state} style={{ backgroundColor: statusColorMap[data.AQMScores?.tvocStatus] }} />
        </div>
      </div>
      {/* PM2.5 값이 있을 때만 표시 */}
      {data.PM2_5MassConcentration?.value && (
        <div className={styles.tableRow}>
          <div className={styles.tableCell}>
            <img
              src={require('../../../assets/images/AirQualityIndicator/PM2.5.png')}
              alt="PM2.5"
              className={styles.img}
            />
          </div>
          <div className={styles.tableCell}>PM 2.5</div>
          <div className={styles.tableCell}>{loading ? '--' : data.PM2_5MassConcentration?.value}um</div>
          <div className={styles.tableCell}>
            <div className={styles.state} style={{ backgroundColor: statusColorMap[data.AQMScores?.pm25Status] }} />
          </div>
        </div>
      )}
      <div className={styles.tableRow}>
        <div className={styles.tableCell}>
          <img
            src={require('../../../assets/images/AirQualityIndicator/noise.png')}
            alt="소음"
            className={styles.img}
          />
        </div>
        <div className={styles.tableCell}>소음</div>
        <div className={styles.tableCell}>{loading ? '--' : data.AmbientNoise?.value}dB</div>
        <div className={styles.tableCell}>
          <div className={styles.state} style={{ backgroundColor: statusColorMap[data.AQMScores?.ambientNoiseStatus] }} />
        </div>
      </div>
    </div>
  );
}

export default AirQualityIndicator;
