import React, { useState, useEffect } from 'react';
import styles from './AirQualityIndicator.module.css';
import API from '../../../API/api';

function AirQualityIndicator({ classRoom }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSensorName, setSelectedSensorName] = useState(classRoom || '');

  const sensorList = [
    { "id": 1, "name": "", "floor": 0, "building": "신공학관", "sensorId": "" },
    { "id": 2, "name": "6144", "floor": 6, "building": "신공학관", "sensorId": "0C:7B:C8:FF:55:5D" },
    { "id": 3, "name": "6119", "floor": 6, "building": "신공학관", "sensorId": "0C:7B:C8:FF:56:8A" },
    { "id": 4, "name": "5147", "floor": 5, "building": "신공학관", "sensorId": "0C:7B:C8:FF:5B:8F" },
    { "id": 5, "name": "5145", "floor": 5, "building": "신공학관", "sensorId": "0C:7B:C8:FF:5C:C8" },
    { "id": 6, "name": "4142", "floor": 4, "building": "신공학관", "sensorId": "0C:7B:C8:FF:57:5A" },
    { "id": 7, "name": "3173", "floor": 3, "building": "신공학관", "sensorId": "0C:7B:C8:FF:5B:06" },
    { "id": 8, "name": "3115", "floor": 3, "building": "신공학관", "sensorId": "0C:7B:C8:FF:56:F1" }
  ];

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

    const sensor = sensorList.find(sensor => sensor.name === name);
    if (!sensor || !sensor.sensorId) {
      console.error("해당 이름의 센서를 찾을 수 없거나 sensorId가 정의되지 않았습니다.");
      return null;
    }

    const endpoint = `/api/sensorData/recent/` + encodeURIComponent(sensor.sensorId);
    setLoading(true);
    try {
      const response = await API.get(endpoint);
      console.log("주소:", endpoint); 
      setData(response.data);
      console.log("응답 데이터:", response.data); 
    } catch (e) {
      console.error("API 오류: ", e);   
      setData([]);
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
