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

  // IAQIndex 값 가져오기
  const iaqIndex = sensorData.IAQIndex?.value || null;

  // 테두리 색상 결정 함수
  const getBorderColor = (iaq) => {
    if (iaq === null) return "#9E9E9E"; // 회색 (데이터 없음)
    if (iaq >= 90) return "#5C82F5"; // 파란색
    if (iaq >= 80) return "#8BC34A"; // 초록색
    if (iaq >= 70) return "#FFEB3B"; // 노란색
    if (iaq >= 60) return "#FF9800"; // 주황색
    return "#F44336"; // 빨간색
  };

  return (
    <div
      className={styles.card}
      style={{
        borderColor: getBorderColor(iaqIndex), // IAQIndex 값에 따라 테두리 색상 설정
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
              toggleRefresh={toggleRefresh} // 새로고침 함수 전달
            />
          </div>
          <div className={styles.memoEdit} onClick={() => openMemoModal(buildingName, roomNumber)}>
            <img src={require('../../../assets/images/edit.png')} alt="Edit Icon" />
            <span>메모등록</span>
          </div>
        </div>

        <div className={styles.SecondSection}>
          <div className={styles.sensorSection}>
            {sensorData.Temperature?.value && ( // 온도 데이터가 있을 때만 렌더링
              <div className={styles.sensorItem}>
                <img
                  src={require('../../../assets/images/AirQualityIndicator/temperature.png')}
                  alt="Temperature Icon"
                />
                <span>온도</span>
                <span>{`${sensorData.Temperature.value}°C`}</span>
              </div>
            )}

            {sensorData.Humidity?.value && ( // 습도 데이터가 있을 때만 렌더링
              <div className={styles.sensorItem}>
                <img
                  src={require('../../../assets/images/AirQualityIndicator/humidity.png')}
                  alt="Humidity Icon"
                />
                <span>습도</span>
                <span>{`${sensorData.Humidity.value}%`}</span>
              </div>
            )}

            {sensorData.TVOC?.value && ( // TVOC 데이터가 있을 때만 렌더링
              <div className={styles.sensorItem}>
                <img
                  src={require('../../../assets/images/AirQualityIndicator/TVOC.png')}
                  alt="TVOC Icon"
                />
                <span>TVOC</span>
                <span>
                  {`${sensorData.TVOC.value}`}
                  <span className={styles.unit}>㎍/m³</span>
                </span>
              </div>
            )}

            {sensorData.PM2_5MassConcentration?.value && ( // PM2.5 데이터가 있을 때만 렌더링
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

            {sensorData.AmbientNoise?.value && ( // 소음 데이터가 있을 때만 렌더링
              <div className={styles.sensorItem}>
                <img
                  src={require('../../../assets/images/AirQualityIndicator/noise.png')}
                  alt="Noise Icon"
                />
                <span>소음</span>
                <span>{`${sensorData.AmbientNoise.value}dB`}</span>
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
