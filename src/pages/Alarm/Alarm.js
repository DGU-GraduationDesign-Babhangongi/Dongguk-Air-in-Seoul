import React, { useState } from 'react';
import moment from 'moment';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import styles from '../../assets/styles/Log.module.css';

function Alarm() {
  const [selectedRoom, setSelectedRoom] = useState('3173');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('온도');

  const sensorData = [
    { date: '2024.07.1 AM 02:23', room: '신공학관 3173 강의실', temperature: 33, humidity: 45, tvoc: 0.5, pm25: 50, noise: 30 },
    { date: '2024.07.30 AM 02:23', room: '신공학관 3115 강의실', temperature: 28, humidity: 45, tvoc: 0.9, pm25: 50, noise: 70 },
    { date: '2024.06.1 AM 02:23', room: '신공학관 4147 강의실', temperature: 21, humidity: 60, tvoc: 0.5, pm25: 50, noise: 30 },
    { date: '2024.06.30 AM 02:23', room: '신공학관 5143 강의실', temperature: 19, humidity: 45, tvoc: 0.5, pm25: 50, noise: 50 },
    { date: '2024.05.1 AM 02:23', room: '신공학관 5147 강의실', temperature: 28, humidity: 45, tvoc: 0.5, pm25: 50, noise: 30 },
    { date: '2024.05.30 AM 02:23', room: '신공학관 6119 강의실', temperature: 32, humidity: 20, tvoc: 0.5, pm25: 50, noise: 30 },
    { date: '2024.04.1 AM 02:23', room: '신공학관 6144 강의실', temperature: 35, humidity: 45, tvoc: 0.5, pm25: 50, noise: 100 },
    { date: '2024.04.30 AM 02:23', room: '신공학관 6144 강의실', temperature: 30, humidity: 45, tvoc: 0.5, pm25: 50, noise: 30 },
    { date: '2024.03.1 AM 02:23', room: '신공학관 6119 강의실', temperature: 25, humidity: 50, tvoc: 0.5, pm25: 50, noise: 30 },
    { date: '2024.03.30 AM 02:23', room: '신공학관 5147 강의실', temperature: 20, humidity: 45, tvoc: 0.5, pm25: 50, noise: 200 },
    { date: '2024.02.1 AM 02:23', room: '신공학관 3173 강의실', temperature: 15, humidity: 60, tvoc: 0.5, pm25: 50, noise: 30 },
    { date: '2024.02.30 AM 02:23', room: '신공학관 3115 강의실', temperature: 10, humidity: 45, tvoc: 0.5, pm25: 50, noise: 30 },
  ];

  const getBorderColor = (value, type) => {
    switch (type) {
      case '온도':
        if (value <= 0 || value >= 30) return 'red';
        if (value <= 10 || value >= 25) return 'orange';
        return 'green';
      case 'PM2.5':
        if (value <= 30) return 'blue';
        if (value <= 80) return 'green';
        if (value <= 150) return 'orange';
        return 'red';
      case '소음':
        if (value <= 20) return 'blue';
        if (value <= 60) return 'green';
        if (value <= 100) return 'orange';
        return 'red';
      case '습도':
        if (value < 30 || value > 80) return 'red';
        if (value >= 40 && value <= 60) return 'green';
        return 'orange';
      case 'TVOC':
        if (value <= 100) return 'blue';
        if (value <= 300) return 'green';
        if (value <= 500) return 'orange';
        return 'red';
      default:
        return 'black';
    }
  };

  const parseDate = (dateString) => {
    return moment(dateString, 'YYYY.MM.DD A hh:mm');
  };

  const filterData = () => {
    return sensorData.filter((data) => {
      const dataDate = parseDate(data.date);
      const start = startDate ? moment(startDate) : null;
      const end = endDate ? moment(endDate) : null;
      const value = getDataValue(data);
      const borderColor = getBorderColor(value, activeTab);

      // 날짜 필터와 빨간색 경고 필터 추가
      return (
        data.room.includes(selectedRoom) &&
        (!start || dataDate.isSameOrAfter(start)) &&
        (!end || dataDate.isSameOrBefore(end)) &&
        borderColor === 'red' // 빨간색 값만 필터링
      );
    });
  };

  const getDataValue = (data) => {
    switch (activeTab) {
      case '온도':
        return data.temperature;
      case '습도':
        return data.humidity;
      case 'TVOC':
        return data.tvoc;
      case 'PM2.5':
        return data.pm25;
      case '소음':
        return data.noise;
      default:
        return null;
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <SideBar />
        <div className={styles.content}>
          {/* Filters Section */}
          <div className={styles.filters}>
            <div className={styles.filterItem}>
              <label>강의실: </label>
              <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                <option value="3173">3173</option>
                <option value="3115">3115</option>
                <option value="4147">4147</option>
                <option value="5143">5143</option>
                <option value="5147">5147</option>
                <option value="6119">6119</option>
                <option value="6144">6144</option>
                {/* 추가 강의실 옵션들 */}
              </select>
            </div>
            <div className={styles.filterItem}>
              <label>기간: </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />{' '}
              -{' '}
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Tabs Section */}
          <div className={styles.tabs}>
            {['온도', '습도', 'TVOC', 'PM2.5', '소음'].map((tab) => (
              <label key={tab} className={styles.tabLabel}>
                <input
                  type="radio"
                  name="tab"
                  value={tab}
                  checked={activeTab === tab}
                  onChange={() => setActiveTab(tab)}
                />
                {tab}
              </label>
            ))}
          </div>

          {/* Sensor Data Table */}
          <div className={styles.sensorData}>
            {filterData().map((data, index) => (
              <div
                key={index}
                className={styles.sensorItem}
                style={{ borderColor: getBorderColor(getDataValue(data), activeTab) }}
              >
                <span>{`[${data.date}]`}</span>
                <span>{data.room}</span>
                <span>{`${activeTab}: ${getDataValue(data)}`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Alarm;
