import React from 'react';
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: '12:00', 온도: 4000, 습도: 2400 },
  { name: '13:00', 온도: 3000, 습도: 1398 },
  { name: '14:00', 온도: 2000, 습도: 9800 },
  { name: '15:00', 온도: 2780, 습도: 3908 },
  { name: '16:00', 온도: 1890, 습도: 4800 },
  { name: '17:00', 온도: 2390, 습도: 3800 },
  { name: '18:00', 온도: 3490, 습도: 4300 },
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
          {/* YAxis 제거 */}
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="온도" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="습도" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
