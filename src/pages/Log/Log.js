import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import styles from '../../assets/styles/Log.module.css';

function Alarm() {
  const [selectedRoom, setSelectedRoom] = useState('3173');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('온도');
  const [sensorData, setSensorData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef();

  const sensorList = [
    { id: 2, name: "6144", sensorId: "0C:7B:C8:FF:55:5D" },
    { id: 3, name: "6119", sensorId: "0C:7B:C8:FF:56:8A" },
    { id: 4, name: "5147", sensorId: "0C:7B:C8:FF:5B:8F" },
    { id: 5, name: "5145", sensorId: "0C:7B:C8:FF:5C:C8" },
    { id: 6, name: "4142", sensorId: "0C:7B:C8:FF:57:5A" },
    { id: 7, name: "3173", sensorId: "0C:7B:C8:FF:5B:06" },
    { id: 8, name: "3115", sensorId: "0C:7B:C8:FF:56:F1" }
  ];

  const getSensorId = () => {
    const sensor = sensorList.find((item) => item.name === selectedRoom);
    return sensor ? sensor.sensorId : null;
  };

  const getSensorType = () => {
    switch (activeTab) {
      case '온도': return 'TEMPERATURE';
      case '습도': return 'HUMIDITY';
      case 'TVOC': return 'TVOC';
      case 'PM2.5': return 'PM2_5MASSCONCENTRATION';
      case '소음': return 'AMBIENTNOISE';
      default: return null;
    }
  };

  const fetchSensorData = async () => {
    const sensorId = getSensorId();
    const sensorType = getSensorType();

    if (sensorId && sensorType) {
      try {
        setLoading(true);
        console.log("Fetching data with dates:", startDate, endDate); // 확인용 로그
        const response = await axios.get(
          `https://donggukseoul.com/api/sensorData/${encodeURIComponent(sensorId)}`,
          {
            params: {
              sensorType,
              sortBy: 'TIMESTAMP',
              order: 'DESC',
              page: page,
              size: 10,
              startDate: startDate ? moment(startDate).toISOString() : null,
              endDate: endDate ? moment(endDate).toISOString() : null,
            },
          }
        );
        if (page === 0) {
          setSensorData(response.data.data || []);
        } else {
          setSensorData((prevData) => [...prevData, ...response.data.data || []]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
        setLoading(false);
      }
    }
  };

  // 날짜 범위 또는 필터 변경 시 데이터를 초기화하고 페이지를 0으로 설정
  useEffect(() => {
    setSensorData([]); // 기존 데이터 초기화
    setPage(0); // 페이지를 0으로 초기화하여 새로운 데이터를 불러옴
  }, [selectedRoom, activeTab, startDate, endDate]);

  useEffect(() => {
    fetchSensorData();
  }, [page]);

  // 무한 스크롤을 위한 IntersectionObserver 설정
  const lastElementRef = useCallback((node) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1); // 페이지 증가
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loading]);

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

  const getDataValue = (data) => data.value !== null ? data.value : '--';

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <SideBar />
        <div className={styles.content}>
          <div className={styles.filters}>
            <div className={styles.filterItem}>
              <label>강의실: </label>
              <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                {sensorList.map((sensor) => (
                  <option key={sensor.id} value={sensor.name}>{sensor.name}</option>
                ))}
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

          <div className={styles.sensorData}>
            {sensorData.map((data, index) => (
              <div
                key={index}
                className={styles.sensorItem}
                style={{
                  borderColor: getBorderColor(getDataValue(data), activeTab),
                }}
                ref={index === sensorData.length - 1 ? lastElementRef : null} // 마지막 요소에 ref 추가
              >
                <span>{`[${moment(data.timestamp).format("YYYY.MM.DD A hh:mm")}]`}</span>
                <span>{`${selectedRoom} 강의실`}</span>
                <span>{`${activeTab}: ${getDataValue(data)}`}</span>
              </div>
            ))}
          </div>
          {loading && <p>Loading...</p>}
        </div>
      </div>
    </div>
  );
}

export default Alarm;
