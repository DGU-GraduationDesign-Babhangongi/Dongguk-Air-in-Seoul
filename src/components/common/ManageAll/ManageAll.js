import React, { useEffect, useState } from 'react';
import styles from './ManageAll.module.css';
import ControlBox from '../../common/ControlBoxMg/ControlBoxMg';
import API from '../../../API/api';
import Star from '../../common/star/star';

function ManageAll({ openMemoModal, buildingName, roomNumber, sensorId, favorited, toggleRefresh }) {
  const [sensorData, setSensorData] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/api/sensorData/recent/${encodeURIComponent(sensorId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setSensorData(response.data);
    } catch (error) {
      console.error('API 오류:', error);
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

  const iaqIndex = sensorData.IAQIndex?.value || null;

  const getBorderColor = (iaq) => {
    if (iaq === null) return "#9E9E9E";
    if (iaq >= 90) return "#5C82F5";
    if (iaq >= 80) return "#8BC34A";
    if (iaq >= 70) return "#FFEB3B";
    if (iaq >= 60) return "#FF9800";
    return "#F44336";
  };

  return (
    <div
      className={styles.card}
      style={{
        borderColor: getBorderColor(iaqIndex),
      }}
    >
      <div className={styles.AllSection}>
        <div className={styles.leftSection}>
          <div className={styles.icon}>
            <img src={require('../../../assets/images/building.png')} alt="Building Icon" />
          </div>
          <div className={styles.roomInfo}>
            <h3>{buildingName}</h3>
            <h2>{roomNumber}</h2>
          </div>
          <div className={styles.star}>
            <Star
              classRoom={roomNumber}
              building={buildingName}
              selectedFavorited={favorited}
              toggleRefresh={toggleRefresh}
            />
          </div>
          <div className={styles.memoEdit} onClick={() => openMemoModal(buildingName, roomNumber)}>
            <img src={require('../../../assets/images/edit.png')} alt="Edit Icon" />
            <span>메모등록</span>
          </div>
        </div>

        <div className={styles.SecondSection}>
          <div className={styles.sensorSection}>
            {sensorData.temperature?.value && (
              <div className={styles.sensorItem}>
                <img
                  src={require('../../../assets/images/AirQualityIndicator/temperature.png')}
                  alt="Temperature Icon"
                />
                <span>온도</span>
                <span>{`${sensorData.temperature.value}°C`}</span>
              </div>
            )}

            {sensorData.humidity?.value && (
              <div className={styles.sensorItem}>
                <img
                  src={require('../../../assets/images/AirQualityIndicator/humidity.png')}
                  alt="Humidity Icon"
                />
                <span>습도</span>
                <span>{`${sensorData.humidity.value}%`}</span>
              </div>
            )}

            {sensorData.tvoc?.value && (
              <div className={styles.sensorItem}>
                <img
                  src={require('../../../assets/images/AirQualityIndicator/TVOC.png')}
                  alt="TVOC Icon"
                />
                <span>TVOC</span>
                <span>
                  {`${sensorData.tvoc.value}`}
                  <span className={styles.unit}>㎍/m³</span>
                </span>
              </div>
            )}

            {sensorData.PM2_5MassConcentration?.value && (
              <div className={styles.sensorItem}>
                <img
                  src={require('../../../assets/images/AirQualityIndicator/PM2.5.png')}
                  alt="PM 2.5 Icon"
                />
                <span>PM 2.5</span>
                <span>
                  {`${sensorData.PM2_5MassConcentration.value}`}
                  <span className={styles.unit}>㎍/m³</span>
                </span>
              </div>
            )}

            {sensorData.ambientNoise?.value && (
              <div className={styles.sensorItem}>
                <img
                  src={require('../../../assets/images/AirQualityIndicator/noise.png')}
                  alt="Noise Icon"
                />
                <span>소음</span>
                <span>{`${sensorData.ambientNoise.value}dB`}</span>
              </div>
            )}
          </div>

          <ControlBox room={roomNumber} building={buildingName} />
        </div>
      </div>
    </div>
  );
}

export default ManageAll;
