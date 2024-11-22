import React, { useState, useEffect } from 'react';
import styles from './alarmScrollBox.module.css';
import API from '../../../API/api';
import moment from 'moment';
import debounce from 'lodash.debounce';
const token = localStorage.getItem("token");

const AlarmScrollBox = ({ title, classRoom }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const sensorTypes = ['PM2_5MassConcentration', 'AmbientNoise', 'Temperature', "Humidity", "TVOC"];

  const fetchData = async (classRoom) => {
    if (!classRoom) return;

    setLoading(true);

    const currentTime = moment();
    let endDate = currentTime;
    let startDate = currentTime.clone().subtract(1, 'days');

    const encodedBuilding = encodeURIComponent('신공학관');
    const endpoint = `/api/sensorData/classroom/betweenDates?sensorTypes=ALL&building=${encodedBuilding}&name=${classRoom}&order=ASC&startDate=${encodeURIComponent(startDate.format('YYYY-MM-DDTHH:mm:ss'))}&endDate=${encodeURIComponent(endDate.format('YYYY-MM-DDTHH:mm:ss'))}&page=0&size=1000000000`;

    try {
      const response = await API.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const formattedData = [];

      const timestamps = response.data.data ? response.data.data.map(item => item.timestamp) : [];

      timestamps.forEach((timestamp) => {
        const formattedTimestamp = timestamp.replace('T', ' ');
        const dataPoint = { name: formattedTimestamp };

        sensorTypes.forEach((sensorType) => {
          const sensorData = response.data.data.find(item => item.sensorType === sensorType && item.timestamp === timestamp);
          dataPoint[sensorType.toLowerCase()] = sensorData ? sensorData.value : 'N/A';
        });

        formattedData.push(dataPoint);
      });

      setData(formattedData.reverse());
    } catch (e) {
      console.error("API 오류: ", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataDebounced = debounce(fetchData, 300);

  useEffect(() => {
    if (classRoom) {
      fetchDataDebounced(classRoom);
    }
  }, [classRoom]);

  const formatMessage = (item) => {
    const pm25 = item.pm2_5massconcentration !== 'N/A' ? `PM2.5 ${item.pm2_5massconcentration}㎍/m³ 수치 이상\n` : '';
    const noise = item.ambientnoise !== 'N/A' ? `소음 ${item.ambientnoise}dB 수치 이상\n` : '';
    const temperature = item.temperature !== 'N/A' ? `온도 ${item.temperature}℃ 수치 이상\n` : '';
    const humidity = item.humidity !== 'N/A' ? `습도 ${item.humidity}% 수치 이상\n` : '';
    const tvoc = item.tvoc !== 'N/A' ? `TVOC ${item.tvoc}㎍/m³ 수치 이상\n` : '';

    if (!pm25 && !noise && !temperature && !humidity && !tvoc) {
      return null;
    }

    const message = `[${item.name}]\n${pm25}${noise}${temperature}${humidity}${tvoc}`;
    return message.trim();
  };

  return (
    <div className={styles.Container}>
      <div style={{ marginLeft: '5%' }}>{title}</div>
      <div className={`${styles.scrollableContainer} ${loading ? styles.loading : ''}`}>
        {loading ? (
          <div style={{margin:'0 25%', width: '50%', height:"100%", display:'flex', alignItems:'center', textAlign:'center'}}>Loading...</div>
        ) : (
          data.length === 0 ? (
            <div style={{margin:'0 1%', width: '98%', height:"100%", display:'flex', alignItems:'center'}}>24시간 내 이상 수치가 없습니다</div>
          ) : (
            data.map((item, index) => {
              const message = formatMessage(item);
              return message ? (
                <div key={index}>
                  {message.split("\n").map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))} <br/>
                </div>
              ) : null;
            })
          )
        )}
      </div>
    </div>
  );
};

export default AlarmScrollBox;
