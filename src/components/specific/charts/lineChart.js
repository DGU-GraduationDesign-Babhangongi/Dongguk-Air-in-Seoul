import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data for demonstration
const defaultData = [
  { name: '12:00', 온도: 40, 습도: 24, TVOC: 150, PM2_5: 35, 소음: 50 },
  { name: '13:00', 온도: 30, 습도: 18, TVOC: 120, PM2_5: 30, 소음: 55 },
  { name: '14:00', 온도: 20, 습도: 90, TVOC: 200, PM2_5: 45, 소음: 60 },
  { name: '15:00', 온도: 27, 습도: 38, TVOC: 180, PM2_5: 40, 소음: 65 },
  { name: '16:00', 온도: 18, 습도: 40, TVOC: 160, PM2_5: 38, 소음: 70 },
  { name: '17:00', 온도: 23, 습도: 30, TVOC: 140, PM2_5: 32, 소음: 68 },
  { name: '18:00', 온도: 34, 습도: 30, TVOC: 155, PM2_5: 37, 소음: 72 },
];

const LineChartComponent = ({ width = '34vw', height = '56vh', selectedValues, data = defaultData, highlightedIndex }) => {
  const [prevSelectedValues, setPrevSelectedValues] = useState(selectedValues);
  const [drawEffect, setDrawEffect] = useState({});

  useEffect(() => {
    // 이전 선택 값과 현재 선택 값을 비교하여 변경된 라인을 찾습니다.
    const addedLines = selectedValues.filter(value => !prevSelectedValues.includes(value));
    const removedLines = prevSelectedValues.filter(value => !selectedValues.includes(value));

    // 변경된 라인을 설정합니다.
    setDrawEffect({
      ...drawEffect,
      ...addedLines.reduce((acc, value) => ({ ...acc, [value]: true }), {}),
      ...removedLines.reduce((acc, value) => ({ ...acc, [value]: false }), {}),
    });

    // 현재 선택 값을 이전 선택 값으로 업데이트합니다.
    setPrevSelectedValues(selectedValues);
  }, [selectedValues]);

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <Tooltip />
          <Legend />
          {selectedValues.includes('temperature') && (
            <Line
              type="monotone"
              dataKey="온도"
              stroke="#96C0E8"
              activeDot={{ r: 8 }}
              strokeWidth={3}
              isAnimationActive={highlightedIndex === 0 || drawEffect['temperature']} // 강조된 인덱스나 변경된 선에만 애니메이션 적용
              onAnimationEnd={() => setDrawEffect(prev => ({ ...prev, temperature: false }))} // 애니메이션 종료 후 상태 초기화
            />
          )}
          {selectedValues.includes('humidity') && (
            <Line
              type="monotone"
              dataKey="습도"
              stroke="#F1B5FB"
              strokeWidth={3}
              isAnimationActive={highlightedIndex === 1 || drawEffect['humidity']} // 강조된 인덱스나 변경된 선에만 애니메이션 적용
              onAnimationEnd={() => setDrawEffect(prev => ({ ...prev, humidity: false }))} // 애니메이션 종료 후 상태 초기화
            />
          )}
          {selectedValues.includes('TVOC') && (
            <Line
              type="monotone"
              dataKey="TVOC"
              stroke="#19E6A0"
              strokeWidth={3}
              isAnimationActive={highlightedIndex === 2 || drawEffect['TVOC']} // 강조된 인덱스나 변경된 선에만 애니메이션 적용
              onAnimationEnd={() => setDrawEffect(prev => ({ ...prev, TVOC: false }))} // 애니메이션 종료 후 상태 초기화
            />
          )}
{selectedValues.includes('PM2.5') && ( // 여기에서 value 수정
  <Line
    type="monotone"
    dataKey="PM2_5" // dataKey는 유지
    stroke="#FFDC82"
    strokeWidth={3}
    isAnimationActive={highlightedIndex === 3 || drawEffect['PM2.5']} // 여기에서 drawEffect 키 수정
    onAnimationEnd={() => setDrawEffect(prev => ({ ...prev, 'PM2.5': false }))} // 여기에서도 수정
  />
)}

          {selectedValues.includes('noise') && (
            <Line
              type="monotone"
              dataKey="소음"
              stroke="#FF8484"
              strokeWidth={3}
              isAnimationActive={highlightedIndex === 4 || drawEffect['noise']} // 강조된 인덱스나 변경된 선에만 애니메이션 적용
              onAnimationEnd={() => setDrawEffect(prev => ({ ...prev, noise: false }))} // 애니메이션 종료 후 상태 초기화
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
