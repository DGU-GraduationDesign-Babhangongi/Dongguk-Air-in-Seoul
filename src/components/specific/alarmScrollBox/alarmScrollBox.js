import React, { useState, useEffect } from 'react';
import styles from './alarmScrollBox.module.css';
import API from '../../../API/api';
import moment from 'moment';
import debounce from 'lodash.debounce';

const token = localStorage.getItem("token");
const buildingName='신공학관';

const AlarmScrollBox = ({ title, classRoom }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 센서 종류 배열
  const sensorTypes = ['PM2_5MassConcentration', 'AmbientNoise', 'Temperature', "Humidity", "TVOC"];

  // 센서 데이터 요청 함수
  const fetchData = async (classRoom) => {
    if (!classRoom) return; // 교실명이 없으면 데이터 요청X

    setLoading(true); 

    // 1일치 조회
    const currentTime = moment();
    let endDate = currentTime;
    let startDate = currentTime.clone().subtract(1, 'days');

    const encodedBuilding = encodeURIComponent(buildingName); // 건물명 인코딩
    const endpoint = `/api/sensorData/classroom/betweenDates?sensorTypes=ALL&building=${encodedBuilding}&name=${classRoom}&order=DESC&startDate=${encodeURIComponent(startDate.format('YYYY-MM-DDTHH:mm:ss'))}&endDate=${encodeURIComponent(endDate.format('YYYY-MM-DDTHH:mm:ss'))}&page=0&size=1000000000`;

    try {
      const response = await API.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
      const formattedData = [];

      // 데이터의 타임스탬프 배열
      const timestamps = response.data.data ? response.data.data.map(item => item.timestamp) : [];

      // 각 타임스탬프별로 센서 데이터 포맷팅
      timestamps.forEach((timestamp) => {
        const formattedTimestamp = timestamp.replace('T', ' '); 
        const dataPoint = { name: formattedTimestamp };

        // 각 센서 유형에 대한 데이터 찾기
        sensorTypes.forEach((sensorType) => {
          const sensorData = response.data.data.find(item => item.sensorType === sensorType && item.timestamp === timestamp);
          dataPoint[sensorType.toLowerCase()] = sensorData ? sensorData.value : 'N/A';
        });

        formattedData.push(dataPoint);
      });

      setData(formattedData); 
    } catch (e) {
      //console.error("API 오류: ", e);
      setData([]); 
    } finally {
      setLoading(false); 
    }
  };

  // 데이터 요청을 디바운싱하여 반복 요청 방지
  const fetchDataDebounced = debounce(fetchData, 300);

  useEffect(() => {
    if (classRoom) {
      fetchDataDebounced(classRoom);
    }
  }, [classRoom]);

  // 메시지 포맷 함수
  const formatMessage = (item) => {
    const pm25 = item.pm2_5massconcentration !== 'N/A' ? `PM2.5 ${item.pm2_5massconcentration}㎍/m³ 수치 이상\n` : '';
    const noise = item.ambientnoise !== 'N/A' ? `소음 ${item.ambientnoise}dB 수치 이상\n` : '';
    const temperature = item.temperature !== 'N/A' ? `온도 ${item.temperature}℃ 수치 이상\n` : '';
    const humidity = item.humidity !== 'N/A' ? `습도 ${item.humidity}% 수치 이상\n` : '';
    const tvoc = item.tvoc !== 'N/A' ? `TVOC ${item.tvoc}㎍/m³ 수치 이상\n` : '';

    if (!pm25 && !noise && !temperature && !humidity && !tvoc) {
      return null; // 값이 없으면 메시지 반환하지 않음
    }

    const message = `[${item.name}]\n${pm25}${noise}${temperature}${humidity}${tvoc}`;
    return message.trim(); // 메시지 반환
  };

  return (
    <div className={styles.Container}>
      <div style={{ marginLeft: '5%' }}>{title}</div> {/* 제목 표시 */}
      <div className={`${styles.scrollableContainer} ${loading ? styles.loading : ''}`}>
        {loading ? (
          <div style={{margin:'0 25%', width: '50%', height:"100%", display:'flex', alignItems:'center', textAlign:'center'}}>Loading...</div> // 로딩 중일 때 표시
        ) : (
          data.length === 0 ? (
            <div style={{margin:'0 1%', width: '98%', height:"100%", display:'flex', alignItems:'center'}}>24시간 내 이상 수치가 없습니다</div> // 데이터가 없으면 메시지 표시
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
