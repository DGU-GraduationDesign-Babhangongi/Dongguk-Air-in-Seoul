import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import styles from '../../assets/styles/Log.module.css';
import API from '../../API/api';

function Log() {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('온도'); // 기본값을 '온도'로 설정
  const [sensorData, setSensorData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();

  const sensorList = [
    { id: 1, name: "3115", sensorId: "0C:7B:C8:FF:56:F1" },
    { id: 2, name: "3173", sensorId: "0C:7B:C8:FF:5B:06" },
    { id: 3, name: "4142", sensorId: "0C:7B:C8:FF:57:5A" },
    { id: 4, name: "5145", sensorId: "0C:7B:C8:FF:5C:C8" },
    { id: 5, name: "5147", sensorId: "0C:7B:C8:FF:5B:8F" },
    { id: 6, name: "6119", sensorId: "0C:7B:C8:FF:56:8A" },
    { id: 7, name: "6144", sensorId: "0C:7B:C8:FF:55:5D" },
  ];

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

  const fetchSensorData = async (reset = false) => {
    const sensorType = getSensorType();

    if (sensorType && selectedRoom) {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const encodedBuilding = encodeURIComponent('신공학관');
        const encodedStartDate = startDate ? encodeURIComponent(moment(startDate).format('YYYY-MM-DDTHH:mm:ss')) : null;
        const encodedEndDate = endDate ? encodeURIComponent(moment(endDate).format('YYYY-MM-DDTHH:mm:ss')) : null;

        const url = `/api/sensorData/classroom/betweenDates?sensorTypes=${sensorType}&building=${encodedBuilding}&name=${selectedRoom}&startDate=${encodedStartDate}&endDate=${encodedEndDate}&order=DESC&page=${page}&size=11`;

        const response = await API.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.data) {
          const fetchedData = response.data.data;

          setSensorData((prevData) => (reset ? fetchedData : [...prevData, ...fetchedData]));
          setHasMore(fetchedData.length === 11);
        } else {
          setHasMore(false);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (startDate && endDate && selectedRoom) {
      setSensorData([]); // 기존 데이터 초기화
      setPage(0); // 페이지를 0으로 초기화

      // 페이지가 0으로 설정된 후에 데이터를 가져오기 위해 비동기적으로 실행
      fetchSensorData(true);
    }
  }, [selectedRoom, activeTab, startDate, endDate]);

  useEffect(() => {
    if (page === 0 || (page > 0 && hasMore)) {
      fetchSensorData(page === 0); // page가 0일 때는 reset으로 데이터 초기화
    }
  }, [page]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(0); // 페이지를 0으로 설정
    setSensorData([]); // 데이터를 초기화하여 새로운 데이터를 시작
    setHasMore(true); // hasMore을 true로 초기화하여 데이터를 새로 로드할 수 있게 함
  };

  const lastElementRef = useCallback((node) => {
    if (loading || !hasMore) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  const getBorderColor = (value, type) => {
    switch (type) {
      case '온도':
        if (value < 16.5 || value > 27.5) return 'red';
        if ((value >= 16.5 && value < 17.6) || (value > 26.4 && value <= 27.5)) return 'orange';
        if ((value >= 17.6 && value < 18.7) || (value > 25.3 && value <= 26.4)) return '#FFFA00';
        if ((value >= 18.7 && value < 19.8) || (value > 24.2 && value <= 25.3)) return 'green';
        return 'blue';
      case '습도':
        if (value < 10 || value > 90) return 'red';
        if ((value >= 10 && value < 20) || (value > 80 && value <= 90)) return 'orange';
        if ((value >= 20 && value < 30) || (value > 70 && value <= 80)) return '#FFFA00';
        if ((value >= 30 && value < 40) || (value > 60 && value <= 70)) return 'green';
        return 'blue';
      case 'TVOC':
        if (value > 10000) return 'red';
        if (value > 3000 && value <= 10000) return 'orange';
        if (value > 1000 && value <= 3000) return '#FFFA00';
        if (value > 300 && value <= 1000) return 'green';
        return 'blue';
      case 'PM2.5':
        if (value > 64) return 'red';
        if (value > 53 && value <= 64) return 'orange';
        if (value > 41 && value <= 53) return '#FFFA00';
        if (value > 23 && value <= 41) return 'green';
        return 'blue';
      case '소음':
        if (value > 80) return 'red';
        if (value > 70 && value <= 80) return 'orange';
        if (value > 60 && value <= 70) return '#FFFA00';
        if (value > 50 && value <= 60) return 'green';
        return 'blue';
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
                <option value="" disabled>강의실 선택</option>
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
              />
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
                  onChange={() => handleTabChange(tab)}
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
                ref={index === sensorData.length - 1 ? lastElementRef : null}
              >
                <span>{`[${moment(data.timestamp).format("YYYY-MM-DDTHH:mm:ss")}]`}</span>
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

export default Log;
