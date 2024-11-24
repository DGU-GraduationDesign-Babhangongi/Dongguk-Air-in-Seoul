import React, { createContext, useState, useEffect } from 'react';
import API from '../API/api';

// Context 생성
export const SensorDataContext = createContext();

export const SensorDataProvider = ({ children }) => {
  const [data, setData] = useState([]); // 센서 데이터
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [selectedSensorName, setSelectedSensorName] = useState(''); // 선택된 센서
  const [selectedBuilding, setSelectedBuilding] = useState('신공학관'); // 선택된 빌딩

  // 데이터 초기화 함수
  const resetSensorData = () => setData([]);

  // 데이터 요청 함수
  const fetchData = async (name, building) => {
    if (!name || !building) return null;
    const endpoint = `/api/sensorData/recent/classroom?building=${encodeURIComponent(building)}&name=${encodeURIComponent(name)}`;
    setLoading(true);
    try {
      const response = await API.get(endpoint);
      setData(response.data);
    } catch (e) {
      //console.error("API 오류: ", e);
      setData([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSensorName && selectedBuilding) fetchData(selectedSensorName, selectedBuilding);
    const intervalId = setInterval(() => {
      if (selectedSensorName && selectedBuilding) fetchData(selectedSensorName, selectedBuilding);
    }, 5000);
    return () => clearInterval(intervalId); 
  }, [selectedSensorName, selectedBuilding]);

  useEffect(() => {
    if (!children) resetSensorData(); // children 없을 경우 데이터 초기화
  }, [children]);

  return (
    <SensorDataContext.Provider value={{ data, setSelectedSensorName, setSelectedBuilding, loading, resetSensorData }}>
      {children}
    </SensorDataContext.Provider>
  );
};
