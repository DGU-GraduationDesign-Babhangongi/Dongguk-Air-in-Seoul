import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import debounce from 'lodash.debounce';
import API from '../../../API/api';

const token = localStorage.getItem("token");

const LineChartComponent = ({ selectedAttribute, classroomA, classroomB, width, height, period }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const buildingName = '신공학관'; 

  // period에 따른 startDate와 endDate 설정
  let startDate, endDate;
  switch (period) {
    case '1': startDate = moment().subtract(1, 'hours'); break;
    case '24': startDate = moment().subtract(1, 'days'); break;
    case '168': startDate = moment().subtract(1, 'weeks'); break;
    case '720': startDate = moment().subtract(1, 'months'); break;
    default: startDate = moment().startOf('day'); break;
  }
  endDate = moment(); // 현재 시간

  // API 호출을 debounced로 처리
  const fetchDataDebounced = debounce(async () => {
    setLoading(true);
    try {
      const endpoint1 = `/api/sensorData/classroom/betweenDates?sensorTypes=${encodeURIComponent(selectedAttribute)}&building=${encodeURIComponent(buildingName)}&name=${classroomA}&order=ASC&startDate=${encodeURIComponent(startDate.format('YYYY-MM-DDTHH:mm:ss'))}&endDate=${encodeURIComponent(endDate.format('YYYY-MM-DDTHH:mm:ss'))}&page=0&size=1000000000`;
      const endpoint2 = `/api/sensorData/classroom/betweenDates?sensorTypes=${encodeURIComponent(selectedAttribute)}&building=${encodeURIComponent(buildingName)}&name=${classroomB}&order=ASC&startDate=${encodeURIComponent(startDate.format('YYYY-MM-DDTHH:mm:ss'))}&endDate=${encodeURIComponent(endDate.format('YYYY-MM-DDTHH:mm:ss'))}&page=0&size=1000000000`;

      const [response1, response2] = await Promise.all([
        API.get(endpoint1, { headers: { 'Authorization': `Bearer ${token}` } }),
        API.get(endpoint2, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      const formattedData = response1.data.data.map((item, index) => ({
        name: item.timestamp.replace('T', ' '),
        [selectedAttribute + 'A']: item.value || null,
        [selectedAttribute + 'B']: response2.data.data[index]?.value || null,
      }));

      setData(formattedData);
    } catch (e) {
      console.error("API 오류: ", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, 500); // 500ms delay

  useEffect(() => {
    fetchDataDebounced();
    return () => fetchDataDebounced.cancel(); 
  }, [classroomA, classroomB, period, selectedAttribute]); 

  return (
    <div style={{ width, height }}>
      {loading && <div style={{ marginLeft: '5%' }}>로딩 중...</div>}
      {data.length === 0 && !loading && <div style={{ fontSize: '16px', marginLeft: '5%' , fontSize:'1.2vw'}}>기간과 강의실을 선택해주세요.</div>}

      <ResponsiveContainer width="100%" height="95%">
        <LineChart data={data} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} axisLine={false} tickLine={false} tick={false} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: '1.6vw' }} />

          <Line type="natural" dataKey={selectedAttribute + 'A'} stroke="#82ca9d" strokeWidth={3} name={`${classroomA}`} dot={false} />
          <Line type="natural" dataKey={selectedAttribute + 'B'} stroke="#1A9AFB" strokeWidth={3} name={`${classroomB}`} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
