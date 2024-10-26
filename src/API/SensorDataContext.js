import React, { createContext, useState, useEffect } from 'react';
import API from '../API/api';

export const SensorDataContext = createContext();

// 센서 데이터 목록
const sensorList = [
  { "id": 1, "name": "6144", "floor": 6, "building": "신공학관", "sensorId": "0C:7B:C8:FF:55:5D" },
  { "id": 2, "name": "6119", "floor": 6, "building": "신공학관", "sensorId": "0C:7B:C8:FF:56:8A" },
  { "id": 3, "name": "5147", "floor": 5, "building": "신공학관", "sensorId": "0C:7B:C8:FF:5B:8F" },
  { "id": 4, "name": "5145", "floor": 5, "building": "신공학관", "sensorId": "0C:7B:C8:FF:5C:C8" },
  { "id": 5, "name": "4142", "floor": 4, "building": "신공학관", "sensorId": "0C:7B:C8:FF:57:5A" },
  { "id": 6, "name": "3173", "floor": 3, "building": "신공학관", "sensorId": "0C:7B:C8:FF:5B:06" },
  { "id": 7, "name": "3115", "floor": 3, "building": "신공학관", "sensorId": "0C:7B:C8:FF:56:F1" }
];

export const SensorDataProvider = ({ children }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    const newData = {};
    
    for (const sensor of sensorList) {
      const endpoint = `/api/sensorData/recent/` + encodeURIComponent(sensor.sensorId);
      try {
        const response = await API.get(endpoint);
        newData[sensor.name] = response.data;
        console.log(`Data for ${sensor.name}:`, response.data); // 각 방의 데이터를 로깅
      } catch (e) {
        console.error("API 오류: ", e);
      }
    }

    setData(newData);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
    const intervalId = setInterval(fetchAllData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <SensorDataContext.Provider value={{ data, loading }}>
      {children}
    </SensorDataContext.Provider>
  );
};
