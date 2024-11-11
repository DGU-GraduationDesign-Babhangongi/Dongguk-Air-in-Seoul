import React, { useEffect, useState } from 'react';
import styles from './ManageAll.module.css';
import ControlBox from '../../common/ControlBoxMg/ControlBoxMg';
import API from '../../../API/api';
import Star from '../../common/star/star';

function ManageAll({ openMemoModal, buildingName, roomNumber, sensorId }) {
  const [sensorData, setSensorData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/api/sensorData/recent/${encodeURIComponent(sensorId)}`);
      setSensorData(response.data);
    } catch (error) {
      console.error("API 오류:", error);
      setSensorData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [sensorId]);

  return (
    <div className={styles.card}>
      <div className={styles.AllSection}>
        <div className={styles.leftSection}>
          <div className={styles.icon}>
            <img src={require('../../../assets/images/building.png')} alt="Building Icon" />
          </div>
          <div className={styles.roomInfo}>
            <h3>{buildingName}</h3>
            <h2>{roomNumber}</h2>
          </div>
          <div className={styles.star} >
            <Star classRoom={roomNumber} building={buildingName}/>
          </div>
          <div className={styles.memoEdit} onClick={() => openMemoModal(buildingName, roomNumber)}>
            <img src={require('../../../assets/images/edit.png')} alt="Edit Icon" />
            <span>메모수정</span>
          </div>
        </div>

        <div className={styles.SecondSection}>
          <div className={styles.sensorSection}>
            <div className={styles.sensorItem}>
              <img src={require('../../../assets/images/AirQualityIndicator/temperature.png')} alt="Temperature Icon" />
              <span>온도</span>
              <span>{loading ? '--' : `${sensorData.Temperature?.value}°C`}</span>
            </div>

            <div className={styles.sensorItem}>
              <img src={require('../../../assets/images/AirQualityIndicator/humidity.png')} alt="Humidity Icon" />
              <span>습도</span>
              <span>{loading ? '--' : `${sensorData.Humidity?.value}%`}</span>
            </div>

            <div className={styles.sensorItem}>
              <img src={require('../../../assets/images/AirQualityIndicator/TVOC.png')} alt="TVOC Icon" />
              <span>TVOC</span>
              <span>
                {loading ? '--' : `${sensorData.TVOC?.value}`}
                <span className={styles.unit}>㎍/m³</span>
              </span>
            </div>

            <div className={styles.sensorItem}>
              <img src={require('../../../assets/images/AirQualityIndicator/PM2.5.png')} alt="PM 2.5 Icon" />
              <span>PM 2.5</span>
              <span>
                {loading ? '--' : `${sensorData.PM2_5MassConcentration?.value}`}
                <span className={styles.unit}>㎍/m³</span>
              </span>
            </div>

            <div className={styles.sensorItem}>
              <img src={require('../../../assets/images/AirQualityIndicator/noise.png')} alt="Noise Icon" />
              <span>소음</span>
              <span>{loading ? '--' : `${sensorData.AmbientNoise?.value}dB`}</span>
            </div>
          </div>
          <ControlBox />
        </div>
      </div>
    </div>
  );
}

export default ManageAll;
