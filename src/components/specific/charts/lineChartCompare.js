import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: '12:00', 강의실A: 500, 강의실B: 550 },
  { name: '13:00', 강의실A: 520, 강의실B: 580 },
  { name: '14:00', 강의실A: 540, 강의실B: 600 },
  { name: '15:00', 강의실A: 620, 강의실B: 590 },
  { name: '16:00', 강의실A: 650, 강의실B: 610 },
  { name: '17:00', 강의실A: 680, 강의실B: 620 },
  { name: '18:00', 강의실A: 600, 강의실B: 640 },
];

const LineChartComponent = ({ width = '34vw', height = '56vh' }) => {
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[400, 700]} /> {/* y축 시작점과 끝점을 20에서 30으로 설정 */}
          <Tooltip />
          <Legend />

          {/* 3183 라인 */}
          <Line type="monotone" dataKey="강의실A" stroke="#1FE5A3" activeDot={{ r: 8 }} strokeWidth={3} />

          {/* 4174 라인 */}
          <Line type="monotone" dataKey="강의실B" stroke="#1A9AFB" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
