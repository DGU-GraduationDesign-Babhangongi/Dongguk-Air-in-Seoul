import React, { useState, useEffect, useRef, useCallback } from 'react';
import moment from 'moment';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import styles from '../../assets/styles/Log.module.css';
import API from '../../API/api';

function Alarm() {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeSensors, setActiveSensors] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();

  const roomList = [
    { id: 1, name: "3115" },
    { id: 2, name: "3173" },
    { id: 3, name: "4142" },
    { id: 4, name: "5145" },
    { id: 5, name: "5147" },
    { id: 6, name: "6119" },
    { id: 7, name: "6144" },
  ];

  const getSensorType = (tab) => {
    switch (tab) {
      case '온도': return 'TEMPERATURE';
      case '습도': return 'HUMIDITY';
      case 'TVOC': return 'TVOC';
      case 'PM2.5': return 'PM2_5MASSCONCENTRATION';
      case '소음': return 'AMBIENTNOISE';
      default: return null;
    }
  };

  const getSensorNameInKorean = (sensorType) => {
    switch (sensorType) {
      case 'Temperature': return '온도';
      case 'Humidity': return '습도';
      case 'TVOC': return 'TVOC';
      case 'PM2_5MassConcentration': return 'PM2.5';
      case 'AmbientNoise': return '소음';
      default: return sensorType;
    }
  };

  const fetchSensorData = async (reset = false) => {
    if (activeSensors.length > 0 && selectedRoom) {
      try {
        setLoading(true);
        const encodedBuilding = encodeURIComponent('신공학관');
        const encodedStartDate = startDate ? encodeURIComponent(moment(startDate).format('YYYY-MM-DDTHH:mm:ss')) : null;
        const encodedEndDate = endDate ? encodeURIComponent(moment(endDate).format('YYYY-MM-DDTHH:mm:ss')) : null;

        const sensorTypesParams = activeSensors.map(sensor => `sensorTypes=${getSensorType(sensor)}`).join('&');

        const url = `/api/sensorData/classroom/betweenDates?${sensorTypesParams}&building=${encodedBuilding}&name=${selectedRoom}&startDate=${encodedStartDate}&endDate=${encodedEndDate}&order=DESC&page=${page}&size=10`;

        const response = await API.get(url);

        if (response.data && response.data.data) {
          const fetchedData = response.data.data;
          setSensorData((prevData) => (reset ? fetchedData : [...prevData, ...fetchedData]));
          setHasMore(fetchedData.length === 10);
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
      setSensorData([]);
      setPage(0);
      fetchSensorData(true);
    }
  }, [selectedRoom, activeSensors, startDate, endDate]);

  useEffect(() => {
    if (page === 0 || (page > 0 && hasMore)) {
      fetchSensorData(page === 0);
    }
  }, [page]);

  const handleSensorChange = (sensor) => {
    setActiveSensors((prevSensors) =>
      prevSensors.includes(sensor)
        ? prevSensors.filter((s) => s !== sensor)
        : [...prevSensors, sensor]
    );
    setPage(0);
    setSensorData([]);
    setHasMore(true);
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
      case 'Temperature':
        if (value < 16.5 || value > 27.5) return 'red';
        if ((value >= 16.5 && value < 17.6) || (value > 26.4 && value <= 27.5)) return 'orange';
        if ((value >= 17.6 && value < 18.7) || (value > 25.3 && value <= 26.4)) return '#FFFA00';
        if ((value >= 18.7 && value < 19.8) || (value > 24.2 && value <= 25.3)) return 'green';
        return 'blue';
      case 'Humidity':
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
      case 'PM2_5MassConcentration':
        if (value > 64) return 'red';
        if (value > 53 && value <= 64) return 'orange';
        if (value > 41 && value <= 53) return '#FFFA00';
        if (value > 23 && value <= 41) return 'green';
        return 'blue';
      case 'AmbientNoise':
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
                {roomList.map((room) => (
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
            {['온도', '습도', 'TVOC', 'PM2.5', '소음'].map((sensor) => (
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
            {sensorData
              .filter(data => ['red', 'orange', '#FFFA00'].includes(getBorderColor(getDataValue(data), data.sensorType)))
              .map((data, index) => (
                <div
                  key={index}
                  className={styles.sensorItem}
                  style={{
                    borderColor: getBorderColor(getDataValue(data), data.sensorType),
                  }}
                  ref={index === sensorData.length - 1 ? lastElementRef : null}
                >
                  <span>{`[${moment(data.timestamp).format("YYYY-MM-DDTHH:mm:ss")}]`}</span>
                  <span>{`${selectedRoom} 강의실`}</span>
                  <span>{`${getSensorNameInKorean(data.sensorType)}: ${getDataValue(data)}`}</span>
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
