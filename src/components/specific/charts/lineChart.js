import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';
import API from '../../../API/api';
import moment from 'moment';
import debounce from 'lodash.debounce';

const LineChartComponent = ({ width = '34vw', height = '56vh', selectedValues, classRoom, period, isPM2_5 = false }) => {
  const [data, setData] = useState([]);
  const [prevSelectedValues, setPrevSelectedValues] = useState(selectedValues);
  const [drawEffect, setDrawEffect] = useState({});
  const [loading, setLoading] = useState(false);

  // 디바운스를 적용하여 fetchData가 너무 자주 호출되지 않도록 함
  const fetchDataDebounced = debounce((classRoom, period) => fetchData(classRoom, period), 300);

  useEffect(() => {
    const addedLines = selectedValues.filter(value => !prevSelectedValues.includes(value));
    const removedLines = prevSelectedValues.filter(value => !selectedValues.includes(value));

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

    // isPM2_5가 false일 경우 PM2_5MASSCONCENTRATION을 제외한 sensorTypes 설정
    const sensorTypes = isPM2_5
      ? ['PM2_5MASSCONCENTRATION', 'TEMPERATURE', 'HUMIDITY', 'TVOC', 'AMBIENTNOISE']
      : ['TEMPERATURE', 'HUMIDITY', 'TVOC', 'AMBIENTNOISE'];
    
    setLoading(true);

    const currentTime = moment();

    let startDate, endDate;
    switch (period) {
      case '1':
        endDate = moment(); // endDate는 현재 시간
        startDate = moment().subtract(1, 'hours'); // startDate는 1시간 전
        break;
      case '24':
        endDate = moment(); // endDate는 현재 시간
        startDate = moment().subtract(1, 'days'); // startDate는 1일 전
        break;
      case '168':
        endDate = moment(); // endDate는 현재 시간
        startDate = moment().subtract(1, 'weeks'); // startDate는 1주일 전
        break;
      case '720':
        endDate = moment(); // endDate는 현재 시간
        startDate = moment().subtract(1, 'months'); // startDate는 1개월 전
        break;
      default:
        endDate = moment(); // endDate는 현재 시간
        startDate = moment().startOf('day'); // startDate는 오늘의 시작 시간
        break;
    }
    const token = localStorage.getItem("token");
    const encodedBuilding = encodeURIComponent('신공학관');
    try {
      const promises = sensorTypes.map(type => {
        const endpoint = `/api/sensorData/classroom/betweenDates?sensorTypes=${encodeURIComponent(type)}&building=${encodedBuilding}&name=${classRoom}&order=DESC&startDate=${encodeURIComponent(startDate.format('YYYY-MM-DDTHH:mm:ss'))}&endDate=${encodeURIComponent(endDate.format('YYYY-MM-DDTHH:mm:ss'))}&page=0&size=1000000000`;
        return API.get(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      });

      const responses = await Promise.all(promises);
      const formattedData = [];
      const timestamps = responses[0]?.data.data ? responses[0].data.data.map(item => item.timestamp) : [];

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

      // 데이터가 없다면 빈 배열 대신 기본 구조로 데이터 설정
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
      console.error("API 오류: ", e);
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
          <Tooltip formatter={(value, name) => value !== null ? value : '-'} />

          {/* temperature, humidity, TVOC, noise에 대한 라인 */}
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

          {/* PM2.5가 존재하는 경우 라인 그리기 */}
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

          {/* PM2.5가 없을 경우 해당 데이터가 없을 때 라인 그리기 */}
          {(!data.some(d => d['pm2_5'])) && (
            <div style={{ marginLeft: '5%' }}>PM2.5 데이터가 없습니다.</div>
          )}

          {/* 다른 데이터가 있을 경우 라인 그리기 */}
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
