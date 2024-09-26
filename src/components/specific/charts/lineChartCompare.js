import React from 'react';
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 데이터 통합
const data = [
  {
    name: '12:00',
    temperatureA: 40, humidityA: 24, TVOCA: 150, PM2_5A: 35, noiseA: 50,
    temperatureB: 38, humidityB: 22, TVOCB: 145, PM2_5B: 34, noiseB: 48,
  },
  {
    name: '13:00',
    temperatureA: 30, humidityA: 18, TVOCA: 120, PM2_5A: 30, noiseA: 55,
    temperatureB: 32, humidityB: 20, TVOCB: 125, PM2_5B: 31, noiseB: 54,
  },
  {
    name: '14:00',
    temperatureA: 20, humidityA: 90, TVOCA: 200, PM2_5A: 45, noiseA: 60,
    temperatureB: 21, humidityB: 85, TVOCB: 195, PM2_5B: 44, noiseB: 59,
  },
  {
    name: '15:00',
    temperatureA: 27, humidityA: 38, TVOCA: 180, PM2_5A: 40, noiseA: 65,
    temperatureB: 28, humidityB: 35, TVOCB: 175, PM2_5B: 39, noiseB: 64,
  },
  {
    name: '16:00',
    temperatureA: 18, humidityA: 40, TVOCA: 160, PM2_5A: 38, noiseA: 70,
    temperatureB: 19, humidityB: 37, TVOCB: 155, PM2_5B: 37, noiseB: 68,
  },
  {
    name: '17:00',
    temperatureA: 23, humidityA: 30, TVOCA: 140, PM2_5A: 32, noiseA: 68,
    temperatureB: 24, humidityB: 28, TVOCB: 135, PM2_5B: 33, noiseB: 66,
  },
  {
    name: '18:00',
    temperatureA: 34, humidityA: 30, TVOCA: 155, PM2_5A: 37, noiseA: 72,
    temperatureB: 33, humidityB: 29, TVOCB: 150, PM2_5B: 36, noiseB: 70,
  },
];

const LineChartComponent = ({ selectedAttribute }) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <Tooltip />
          <Legend />

          {/* 강의실 A 데이터 */}
          <Line type="monotone" dataKey={selectedAttribute+'A'} stroke="#8884d8" strokeWidth={3} />
          <Line type="monotone" dataKey={selectedAttribute+'B'} stroke="#82ca9d" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
