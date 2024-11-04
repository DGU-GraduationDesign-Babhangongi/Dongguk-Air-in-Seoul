import { LineChart, Line, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import API from '../../../API/api';

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

const LineChartComponent = ({ width = '34vw', height = '56vh', selectedValues, classRoom, period }) => {
  const [data, setData] = useState([]);
  const [prevSelectedValues, setPrevSelectedValues] = useState(selectedValues);
  const [drawEffect, setDrawEffect] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const addedLines = selectedValues.filter(value => !prevSelectedValues.includes(value));
    const removedLines = prevSelectedValues.filter(value => !selectedValues.includes(value));

    setDrawEffect(prev => ({
      ...prev,
      ...addedLines.reduce((acc, value) => ({ ...acc, [value]: true }), {}),
      ...removedLines.reduce((acc, value) => ({ ...acc, [value]: false }), {}),
    }));

    setPrevSelectedValues(selectedValues);
  }, [selectedValues]);

  const fetchData = async (classRoom) => {
  if (!classRoom || !period) return null; // period와 classRoom 모두 유효해야 실행

  const sensor = sensorList.find(sensor => sensor.name === classRoom);
  if (!sensor || !sensor.sensorId) {
    console.error("해당 이름의 센서를 찾을 수 없거나 sensorId가 정의되지 않았습니다.");
    return null;
  }

  const sensorTypes = ['PM2_5MASSCONCENTRATION', 'TEMPERATURE', 'HUMIDITY', 'TVOC', 'AMBIENTNOISE'];
  setLoading(true);

  try {
    const promises = sensorTypes.map(type => {
      const endpoint = `/api/sensorData/${encodeURIComponent(sensor.sensorId)}?sensorType=${encodeURIComponent(type)}&sortBy=TIMESTAMP&order=DESC&page=0&size=${period}`;
      console.log('endpoint: ' + endpoint);
      return API.get(endpoint);
    });

    const responses = await Promise.all(promises);
    const formattedData = [];
    console.log('responses:', responses);

    const timestamps = responses[0]?.data.data ? responses[0].data.data.map(item => item.timestamp) : [];

    // 가장 늦은 시간 찾기
    const latestTimestamp = timestamps.length > 0 ? Math.max(...timestamps.map(ts => new Date(ts).getTime())) : null;

    if (latestTimestamp) {
      const latestDate = new Date(latestTimestamp).toISOString().replace('T', ' ').split('.')[0];
      console.log('가장 늦은 시간:', latestDate);
    }

    timestamps.forEach((timestamp, index) => {
      const formattedTimestamp = timestamp.replace('T', ' ');
      const dataPoint = { name: formattedTimestamp };

      responses.forEach((response, responseIndex) => {
        const sensorType = sensorTypes[responseIndex].toLowerCase();
        const value = response.data.data[index] ? response.data.data[index].value : null;
        if (sensorType === 'pm2_5massconcentration') {
          dataPoint['pm2_5'] = value;
        } else if (sensorType === 'ambientnoise') {
          dataPoint['noise'] = value;
        } else {
          dataPoint[sensorType] = value;
        }
      });
      formattedData.push(dataPoint);
    });

    console.log('formattedData:', formattedData);
    setData(formattedData.reverse());
    console.log("응답 데이터:", formattedData);
  } catch (e) {
    console.error("API 오류: ", e);
    setData([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchData(classRoom);
  }, [classRoom]);

  useEffect(() => {
    fetchData(classRoom);
  }, [period]);

  return (
    <div style={{ width, height }}>
      {loading && <div style={{marginLeft:'5%'}}>로딩 중...</div>}
      {data.length === 0 && !loading && <div style={{marginLeft:'5%'}}>기간과 강의실을 선택해주세요.</div>}
 
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" interval={0} axisLine={false} tickLine={false} tick={false} />
        <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
        
          {selectedValues.includes('temperature') && (
            <Line
              type="natural"
              dataKey="temperature"
              stroke="#96C0E8"
              activeDot={{ r: 8 }}
              strokeWidth={3}
              isAnimationActive={drawEffect['temperature']}
              onAnimationEnd={() => setDrawEffect(prev => ({ ...prev, temperature: false }))}
              dot={false}
            />
          )}
          {selectedValues.includes('humidity') && (
            <Line
              type="natural"
              dataKey="humidity"
              stroke="#F1B5FB"
              strokeWidth={3}
              isAnimationActive={drawEffect['humidity']}
              onAnimationEnd={() => setDrawEffect(prev => ({ ...prev, humidity: false }))}
              dot={false}
            />
          )}
          {selectedValues.includes('TVOC') && (
            <Line
              type="natural"
              dataKey="tvoc"
              stroke="#19E6A0"
              strokeWidth={3}
              isAnimationActive={drawEffect['TVOC']}
              onAnimationEnd={() => setDrawEffect(prev => ({ ...prev, TVOC: false }))}
              dot={false}
            />
          )}
          {selectedValues.includes('PM2.5') && (
            <Line
              type="natural"
              dataKey="pm2_5"
              stroke="#FFDC82"
              strokeWidth={3}
              isAnimationActive={drawEffect['PM2.5']}
              onAnimationEnd={() => setDrawEffect(prev => ({ ...prev, 'PM2.5': false }))}
              dot={false}
            />
          )}
          {selectedValues.includes('noise') && (
            <Line
              type="natural"
              dataKey="noise"
              stroke="#FF8484"
              strokeWidth={3}
              isAnimationActive={drawEffect['noise']}
              onAnimationEnd={() => setDrawEffect(prev => ({ ...prev, 'noise': false }))}
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      </div>
  );
};

export default LineChartComponent;
