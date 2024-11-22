import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import debounce from 'lodash.debounce';

import API from '../../../API/api';

const LineChartComponent = ({ width = '34vw', height = '56vh', selectedValues, classRoom, period, isPM2_5 = false }) => {
  const [data, setData] = useState([]);
  const [prevSelectedValues, setPrevSelectedValues] = useState(selectedValues);
  const [drawEffect, setDrawEffect] = useState({});
  const [loading, setLoading] = useState(false);

  // 디바운스를 적용하여 fetchData 호출 간격 조정
  const fetchDataDebounced = debounce((classRoom, period) => fetchData(classRoom, period), 300);

  useEffect(() => {
    const addedLines = selectedValues.filter(value => !prevSelectedValues.includes(value));
    const removedLines = prevSelectedValues.filter(value => !selectedValues.includes(value));

    // 추가/삭제된 라인 애니메이션 처리
    setDrawEffect(prev => ({
      ...prev,
      ...addedLines.reduce((acc, value) => ({ ...acc, [value]: true }), {}),
      ...removedLines.reduce((acc, value) => ({ ...acc, [value]: false }), {}),
    }));

    setPrevSelectedValues(selectedValues);
    fetchDataDebounced(classRoom, period);
  }, [selectedValues, classRoom, period]);

  const fetchData = async (classRoom, period) => {
    if (!classRoom || !period) return null;

    // PM2.5 여부에 따른 센서 종류 설정
    const sensorTypes = isPM2_5 ?
       ['PM2_5MASSCONCENTRATION', 'TEMPERATURE', 'HUMIDITY', 'TVOC', 'AMBIENTNOISE']
      : ['TEMPERATURE', 'HUMIDITY', 'TVOC', 'AMBIENTNOISE'];

    setLoading(true);

    let startDate, endDate;

    // 기간에 따른 날짜 계산
    switch (period) {
      case '1': endDate = moment(); startDate = moment().subtract(1, 'hours'); break;
      case '24': endDate = moment(); startDate = moment().subtract(1, 'days'); break;
      case '168': endDate = moment(); startDate = moment().subtract(1, 'weeks'); break;
      case '720': endDate = moment(); startDate = moment().subtract(1, 'months'); break;
      default: endDate = moment(); startDate = moment().startOf('day'); break;
    }

    const token = localStorage.getItem("token");
    const buildingName='신공학관';
    const encodedBuilding = encodeURIComponent(buildingName);

    try {
      const promises = sensorTypes.map(type => {
        const endpoint = `/api/sensorData/classroom/betweenDates?sensorTypes=${encodeURIComponent(type)}&building=${encodedBuilding}&name=${classRoom}&order=DESC&startDate=${encodeURIComponent(startDate.format('YYYY-MM-DDTHH:mm:ss'))}&endDate=${encodeURIComponent(endDate.format('YYYY-MM-DDTHH:mm:ss'))}&page=0&size=1000000000`;
        return API.get(endpoint, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
      });

      const responses = await Promise.all(promises);
      const formattedData = [];
      const timestamps = responses[0]?.data.data ? responses[0].data.data.map(item => item.timestamp) : [];

      // 데이터를 시간별로 포맷팅
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

      // 데이터가 없으면 기본 구조 설정
      if (formattedData.length === 0) {
        formattedData.push({
          name: 'No Data',
          pm2_5: null,
          temperature: null,
          humidity: null,
          tvoc: null,
          noise: null
        });
      }

      setData(formattedData.reverse());
    } catch (e) {
      //console.error("API 오류: ", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width, height }}>
      {loading && <div style={{ marginLeft: '5%' }}>로딩 중...</div>}
      {data.length === 0 && !loading && <div style={{ marginLeft: '5%', fontSize:'1.2vw' }}>기간과 강의실을 선택해주세요.</div>}

      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" interval={0} axisLine={false} tickLine={false} tick={false} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={(value) => value !== null ? value : '-'} />

          {selectedValues.includes('temperature') && data.some(d => d['temperature']) && (
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
          {selectedValues.includes('humidity') && data.some(d => d['humidity']) && (
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
          {selectedValues.includes('TVOC') && data.some(d => d['tvoc']) && (
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
          
          {selectedValues.includes('PM2.5') && data.some(d => d['pm2_5'] !== null) && (
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
          
          {selectedValues.includes('noise') && data.some(d => d['noise']) && (
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
