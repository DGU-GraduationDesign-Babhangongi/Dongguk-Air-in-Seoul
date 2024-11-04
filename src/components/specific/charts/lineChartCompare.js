import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API from '../../../API/api';

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

const LineChartComponent = ({ selectedAttribute, classroomA, classroomB, width, height, period }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(period);
  const fetchData = async () => {
    const sensor1 = sensorList.find(sensor => sensor.name === classroomA);
    const sensor2 = sensorList.find(sensor => sensor.name === classroomB);

    if (!sensor1 || !sensor1.sensorId || !sensor2 || !sensor2.sensorId) {
      console.error("해당 이름의 센서를 찾을 수 없거나 sensorId가 정의되지 않았습니다.");
      return;
    }

    setLoading(true);
    try {
      const endpoint1 = `/api/sensorData/${encodeURIComponent(sensor1.sensorId)}?sensorType=${encodeURIComponent(selectedAttribute)}&sortBy=TIMESTAMP&order=DESC&page=0&size=${period}`;
      const endpoint2 = `/api/sensorData/${encodeURIComponent(sensor2.sensorId)}?sensorType=${encodeURIComponent(selectedAttribute)}&sortBy=TIMESTAMP&order=DESC&page=0&size=${period}`;

      const [response1, response2] = await Promise.all([API.get(endpoint1), API.get(endpoint2)]);

      const timestamps = response1.data.data.map(item => item.timestamp);
      const formattedData = timestamps.map((timestamp, index) => {
        const formattedTimestamp = timestamp.replace('T', ' ');
        return {
          name: formattedTimestamp,
          [selectedAttribute + 'A']: response1.data.data[index]?.value || null,
          [selectedAttribute + 'B']: response2.data.data[index]?.value || null,
        };
      });

      setData(formattedData.reverse());
    } catch (e) {
      console.error("API 오류: ", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [classroomA, classroomB, period, selectedAttribute]);  // 모든 의존성 추가

  return (
    <div style={{ width: width, height: height }}>
      {loading && <div style={{marginLeft:'5%'}}>로딩 중...</div>}
      {data.length === 0 && !loading && <div style={{marginLeft:'5%'}}>기간과 강의실을 선택해주세요.</div>}
 
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} axisLine={false} tickLine={false} tick={false} />
          <Tooltip />
          <Legend />

          <Line
            type="natural"
            dataKey={selectedAttribute + 'A'}
            stroke="#82ca9d"
            strokeWidth={3}
            name={`${classroomA} `}
            dot={false}
          />
          <Line
            type="natural"
            dataKey={selectedAttribute + 'B'}
            stroke="#1A9AFB"
            strokeWidth={3}
            name={`${classroomB} `}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
