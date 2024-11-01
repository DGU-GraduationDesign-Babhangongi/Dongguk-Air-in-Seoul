import React, { createContext, useState, useEffect } from 'react';
import API from '../API/api';
import { TbNumber1Small } from 'react-icons/tb';

// Context 생성
export const SensorDataContext = createContext();

// 센서 데이터 목록
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

export const SensorDataProvider = ({ children }) => {
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSensorName, setSelectedSensorName] = useState(sensorList[0]?.name);

  const fetchData = async (name) => {
    if (!name) return null; // 이름이 없을 경우 null 반환

    const sensor = sensorList.find(sensor => sensor.name === name);
    if (!sensor || !sensor.sensorId) { // sensorId가 정의되지 않으면 null 반환
      console.error("해당 이름의 센서를 찾을 수 없거나 sensorId가 정의되지 않았습니다.");
      return null; // null 반환
    }

    const endpoint = `/api/sensorData/recent/` + encodeURIComponent(sensor.sensorId);
    setLoading(true);
    try {
      const response = await API.get(endpoint);
      console.log("주소:", endpoint); 
      setData(response.data); // 센서 데이터를 설정
      console.log("응답 데이터:", response.data); 
    } catch (e) {
      console.error("API 오류: ", e);   
      setData([]); // API 오류 발생 시 데이터 초기화
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedSensorName);

    const intervalId = setInterval(() => {
      if (selectedSensorName) {
        fetchData(selectedSensorName);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [selectedSensorName]);

  useEffect(() => {
    // children이 없을 경우 data를 빈 배열로 설정
    if (!children) {
      setData([]);
    }
  }, [children]); // children이 변경될 때마다 호출

  return (
    <SensorDataContext.Provider value={{ data, setSelectedSensorName, loading }}>
      {children}
    </SensorDataContext.Provider>
  );
};
