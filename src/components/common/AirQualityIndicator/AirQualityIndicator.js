import React, { useState, useEffect } from 'react';
import styles from './AirQualityIndicator.module.css';
import API from '../../../API/api';

function AirQualityIndicator({ classRoom, onNoPm25Data }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedSensorName, setSelectedSensorName] = useState(classRoom || '');

  const buildingName = '신공학관';

  const statusColorMap = {
    Excellent: '#5C82F5', 
    Good: '#8BC34A', 
    Fair: '#FFEB3B', 
    Poor: '#FF9800', 
    Inadequate: '#F44336', 
    NoData: '#9E9E9E' // NoData 색상 추가
  };

  const fetchData = async (name) => {
    if (!name) return;
    const endpoint = `/api/sensorData/recent/classroom?building=${encodeURIComponent(buildingName)}&name=${encodeURIComponent(name)}`;
    setLoading(true);
    try {
      const response = await API.get(endpoint);
      setData(response.data);
    } catch {
      setData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSensorName) fetchData(selectedSensorName);
    const intervalId = setInterval(() => {
      if (selectedSensorName) fetchData(selectedSensorName);
    }, 5000);
    return () => clearInterval(intervalId); // 인터벌 클리어
  }, [selectedSensorName]);

  useEffect(() => setSelectedSensorName(classRoom), [classRoom]);

  useEffect(() => {
    if (onNoPm25Data) {
      onNoPm25Data(!!data.PM2_5MassConcentration?.value);
    }
  }, [data, onNoPm25Data]);

  const safeValue = (value) => (loading || value === undefined ? '--' : value);

  const renderRow = (img, label, value, statusKey) => (
    <div className={styles.tableRow}>
      <div className={styles.tableCell}>
        <img src={require(`../../../assets/images/AirQualityIndicator/${img}.png`)} alt={label} className={styles.img} />
      </div>
      <div className={styles.tableCell}>{label}</div>
      <div className={styles.tableCell}>{safeValue(value)}</div>
      <div className={styles.tableCell}>
        <div 
          className={styles.state} 
          style={{ 
            backgroundColor: loading || data.AQMScores?.[statusKey] === undefined 
              ? statusColorMap.NoData 
              : statusColorMap[data.AQMScores?.[statusKey]] 
          }} 
        />
      </div>
    </div>
  );

  return (
    <div className={styles.table}>
      {renderRow('temperature', '온도', data.temperature?.value && `${data.temperature?.value}°C`, 'temperatureStatus')}
      {renderRow('humidity', '습도', data.humidity?.value && `${data.humidity?.value}%`, 'humidityStatus')}
      {renderRow('TVOC', 'TVOC', data.tvoc?.value && `${data.tvoc?.value}㎍/m³`, 'tvocStatus')}
      {data.PM2_5MassConcentration?.value && 
        renderRow('PM2.5', 'PM 2.5', `${data.PM2_5MassConcentration?.value}um`, 'pm25Status')}
      {renderRow('noise', '소음', data.ambientNoise?.value && `${data.ambientNoise?.value}dB`, 'ambientNoiseStatus')}
    </div>
  );
}

export default AirQualityIndicator;
