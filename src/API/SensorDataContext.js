import React, { createContext, useState, useEffect } from 'react';
import API from '../API/api';

// Context 생성
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
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const fetchData = async (name) => {
    if (!name) return;

    // name에 해당하는 sensorId 찾기
    const sensor = sensorList.find(sensor => sensor.name === name);
    if (!sensor) {
      console.error("해당 이름의 센서를 찾을 수 없습니다.");
      return;
    }

    const endpoint = `/api/sensorData/recent/` + encodeURIComponent(sensor.sensorId);
    setLoading(true); // 데이터 요청 시작, 로딩 상태 true로 설정
    try {
      const response = await API.get(endpoint);
      console.log("주소:", endpoint); 
      setData(response.data); // 센서 데이터를 설정
      console.log("응답 데이터:", response.data); // 응답 확인용
    } catch (e) {
      console.error("API 오류: ", e);
    } finally {
      setLoading(false); // 데이터 요청 완료, 로딩 상태 false로 설정
    }
  };

  // 5초마다 fetchData 실행
  useEffect(() => {
    const fetchDataInterval = async () => {
      while (true) {
        await fetchData(sensorList[0]?.name); // 데이터 요청
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5초 대기
      }
    };

    fetchDataInterval();

    return () => {
      // 컴포넌트 언마운트 시 데이터 초기화
      setData({});
    };
  }, []);

  return (
    <SensorDataContext.Provider value={{ data, fetchData, loading }}> {/* loading 추가 */}
      {children}
    </SensorDataContext.Provider>
  );
};
