import React, { useState, useEffect, useRef, useCallback } from 'react';
import moment from 'moment';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import styles from '../../assets/styles/Log.module.css';
import API from '../../API/api';
import { useNavigate } from 'react-router-dom';

function Log() {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeSensors, setActiveSensors] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [roomList, setRoomList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const observerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchRoomList = async () => {
      try {
        const token = localStorage.getItem("token");
        const encodedBuilding = encodeURIComponent('신공학관');
        const response = await API.get(`/api/classrooms/myFavorites?building=${encodedBuilding}&favoriteFirst=false&orderDirection=asc`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const rooms = response.data.map(room => ({
          id: room.id,
          name: room.name,
        }));
        setRoomList(rooms);
      } catch (error) {
        console.error("Error fetching room list:", error);
        setRoomList([]);
      }
    };

    fetchRoomList();
  }, []);

  useEffect(() => {
    if (startDate && endDate && selectedRoom) {
      setSensorData([]);
      setCurrentPage(0);
      setHasMore(true);
    }
  }, [startDate, endDate, selectedRoom, activeSensors]);

  useEffect(() => {
    if (startDate && endDate && selectedRoom && hasMore) {
      fetchSensorData(currentPage);
    }
  }, [currentPage, startDate, endDate, selectedRoom, activeSensors]);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const getSensorType = (tab) => {
    switch (tab) {
      case '온도': return 'TEMPERATURE';
      case '습도': return 'HUMIDITY';
      case 'tvoc': return 'tvoc';
      case 'PM2.5': return 'PM2_5MASSCONCENTRATION';
      case '소음': return 'AMBIENTNOISE';
      default: return null;
    }
  };

  const getSensorNameInKorean = (sensorType) => {
    switch (sensorType) {
      case 'temperature': return '온도';
      case 'humidity': return '습도';
      case 'tvoc': return 'tvoc';
      case 'PM2_5MassConcentration': return 'PM2.5';
      case 'AmbientNoise': return '소음';
      default: return sensorType;
    }
  };

  const getBorderColor = (value, type) => {
    switch (type) {
      case 'temperature':
        if (value < 16.5 || value > 27.5) return '#F44336';
        if ((value >= 16.5 && value < 17.6) || (value > 26.4 && value <= 27.5)) return '#FF9800';
        if ((value >= 17.6 && value < 18.7) || (value > 25.3 && value <= 26.4)) return '#FFEB3B';
        if ((value >= 18.7 && value < 19.8) || (value > 24.2 && value <= 25.3)) return '#8BC34A0';
        else if (value >= 19.8 && value <= 2.2) return '#5C82F5';
      case 'humidity':
        if (value < 10 || value > 90) return '#F44336';
        if ((value >= 10 && value < 20) || (value > 80 && value <= 90)) return '#FF9800';
        if ((value >= 20 && value < 30) || (value > 70 && value <= 80)) return '#FFEB3B';
        if ((value >= 30 && value < 40) || (value > 60 && value <= 70)) return '#8BC34A';
        else if (value >= 40 && value < 60) return '#5C82F5';
      case 'tvoc':
        if (value > 10000) return '#F44336';
        if (value > 3000 && value <= 10000) return '#FF9800';
        if (value > 1000 && value <= 3000) return '#FFEB3B';
        if (value > 300 && value <= 1000) return '#8BC34A';
        else if (value <= 300) return '#5C82F5';
      case 'PM2_5MassConcentration':
        if (value > 64) return '#F44336';
        if (value > 53 && value <= 64) return '#FF9800';
        if (value > 41 && value <= 53) return '#FFEB3B';
        if (value > 23 && value <= 41) return '#8BC34A';
        else if (value <=23) return '#5C82F5';
      case 'AmbientNoise':
        if (value > 80) return '#F44336';
        if (value > 70 && value <= 80) return '#FF9800';
        if (value > 60 && value <= 70) return '#FFEB3B';
        if (value > 50 && value <= 60) return '#8BC34A';
        else if (value <=50) return '#5C82F5';
      default:
        return '#9E9E9E';
    }
  };

  const fetchSensorData = async (page) => {
    try {
      setLoading(true);
      const encodedBuilding = encodeURIComponent('신공학관');
      const encodedStartDate = startDate ? encodeURIComponent(moment(startDate).format('YYYY-MM-DDTHH:mm:ss')) : null;
      const encodedEndDate = endDate ? encodeURIComponent(moment(endDate).format('YYYY-MM-DDTHH:mm:ss')) : null;
      const sensorTypesParams = activeSensors.map(sensor => `sensorTypes=${getSensorType(sensor)}`).join('&');

      const url = `/api/sensorData/classroom/betweenDates?${sensorTypesParams}&building=${encodedBuilding}&name=${selectedRoom}&startDate=${encodedStartDate}&endDate=${encodedEndDate}&order=DESC&page=${page}&size=10`;
      const token = localStorage.getItem("token");

      const response = await API.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        const fetchedData = response.data.data;
        setSensorData((prevData) => [...prevData, ...fetchedData]);
        setHasMore(fetchedData.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSensorChange = (sensor) => {
    setActiveSensors((prevSensors) =>
      prevSensors.includes(sensor)
        ? prevSensors.filter((s) => s !== sensor)
        : [...prevSensors, sensor]
    );
  };

  return (
    <div  className={styles.fullScreenContainer}>
      <Header i={"2"} />
      <div className={styles.container}>
        <SideBar/>
        <div className={styles.content}>
          <div className={styles.filters}>
            <div className={styles.filterItem}>
              <label>강의실: </label>
              <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                <option value="" disabled>강의실 선택</option>
                {roomList.filter((room) => !/[\uAC00-\uD7AF]/.test(room.name)) // 한글이 포함된 이름 필터링
        .map((room) => (
          <option key={room.id} value={room.name}>{room.name}</option>
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
            {['온도', '습도', 'tvoc', 'PM2.5', '소음'].map((sensor) => (
              <label key={sensor} className={styles.tabLabel}>
                <input
                  type="checkbox"
                  checked={activeSensors.includes(sensor)}
                  onChange={() => handleSensorChange(sensor)}
                />
                {sensor}
              </label>
            ))}
          </div>

          <div className={styles.sensorData}>
            {!selectedRoom || !startDate || !endDate || activeSensors.length === 0 ? (
              <div className={styles.noDataBox}>
                <p>센서 로그값을 확인하고 싶은 강의실, 기간, 센서 종류를 선택하세요</p>
              </div>
            ) : sensorData.length === 0 ? (
              <div className={styles.noDataBox}>
                <p>{`해당 강의실은 ${activeSensors.join(', ')} 값을 측정하지 않습니다.`}</p>
              </div>
            ) : (
              sensorData.map((data, index) => (
                <div
                  key={index}
                  className={styles.sensorItem}
                  style={{
                    borderColor: getBorderColor(data.value, data.sensorType),
                  }}
                >
                  <span>{`[${moment(data.timestamp).format("YYYY-MM-DDTHH:mm:ss")}]`}</span>
                  <span>{`${selectedRoom} 강의실`}</span>
                  <span>{`${getSensorNameInKorean(data.sensorType)}: ${data.value !== null ? data.value : '--'}`}</span>
                </div>
              ))
            )}
            {loading && (
              <div className={styles.loadingBox}>
                <p>Loading...</p>
              </div>
            )}
            <div ref={observerRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Log;
