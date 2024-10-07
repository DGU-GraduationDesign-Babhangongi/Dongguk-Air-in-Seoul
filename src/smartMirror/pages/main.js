import React, { useState, useEffect } from 'react';
import styles from './main.module.css';  // CSS 파일을 모듈로 import
import FloorBox from '../components/floorBox/floorBox';  // 대문자로 변경
import { fetchForeCast, fetchForeCast2 } from '../../pages/forecast'; // 날씨 정보 가져오는 파일

function Main() {
  const [dateTime, setDateTime] = useState(new Date());  // For real-time date and time
  const [forecast, setForecast] = useState(null);
  const [forecast2, setForecast2] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch weather data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const weatherData = await fetchForeCast(60, 127);
        const weatherData2 = await fetchForeCast2(60, 127);
        setForecast(weatherData);
        setForecast2(weatherData2);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data: ", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Format the date and time
  const formatDate = (date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = days[date.getDay()];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일 ${dayOfWeek} PM ${hours}:${minutes}`;
  };

  return (
    <div className={styles.container}>
      {/* Header section */}
      <div className={styles.header}>
        <div className={styles.topButton}>
          <img
            src={require("../../assets/images/smartmirror/home.png")}
            alt="Home"
            className={styles.img}
          />
        </div>
        <img
          src={require("../../assets/images/smartmirror/logo.png")}
          alt="CLEAN AIR iN DONGGUK"
          className={styles.logo}
        />
        <div className={styles.topButton}>
          <img
            src={require("../../assets/images/smartmirror/return.png")}
            alt="Return"
            style={{ width: '60%', margin: 'auto' }}
          />
        </div>
      </div>

      {/* Weather and black box */}
      <div className={styles.mainContainer}>
        <div className={styles.weatherBox}>
          <div className={styles.weatherDateContainer}>
            <img
              src={require("../../assets/images/smartmirror/date.png")}
              alt="Date Icon"
              className={styles.dateIcon}
            />
            <p className={styles.weatherDate}>{formatDate(dateTime)}</p>
          </div>
          {loading ? (
            <p>Loading weather data...</p>
          ) : (
            <>
              <p className={styles.weatherTemperature}>{forecast.temperature}°C</p>
              <p className={styles.weatherRain}>
                {forecast.rain === '1' ? '비' : forecast.rain === '2' ? '비/눈' : forecast.rain === '3' ? '눈' : '흐리고 비'}
              </p>
              <p className={styles.weatherMinMax}>
                {forecast2.minTemp}°C / {forecast2.maxTemp}°C
              </p>
              <p className={styles.weatherAdvice}>
                오늘은 하루종일 {forecast.rain === '1' ? '비' : '비소식이 있으니'} 실내 습도 조절에 유의하세요
              </p>
            </>
          )}
        </div>
        <div className={styles.blackBox}></div>
      </div>

      {/* Detail Section */}
      <div className={styles.detailContainer}>
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <img
            src={require("../../assets/images/smartmirror/location.png")}
            alt="location"
            style={{ width: '5vw', paddingRight: '1.5vw' }}
          />
          신공학관
        </div>
        <div className={styles.helpContainer}>
          <img
            src={require("../../assets/images/smartmirror/TipsIcon.png")}
            alt="detail"
            style={{ width: '3vw',height: '3vw', paddingRight: '1.5vw' }}
          />
          원하는 층을 선택하여 현재 공기질 상태를 확인하세요
        </div>

          <FloorBox floor="3rd" rooms={['3115', '3173']} isSelected={true} />
          <FloorBox floor="4th" rooms={['4142']} isSelected={false} />
          <FloorBox floor="5th" rooms={['5145', '5147']} isSelected={false} />
          <FloorBox floor="6th" rooms={['6119', '6144']} isSelected={false} />

      </div>

      {/* Map Display Section */}
      <div className={styles.bottomContainer}>
        <div className={styles.whiteBox}>
          5th floor
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-around",
              marginTop: "2%",
            }}
          >
            <img
              src={require("../../assets/images/smartmirror/map.png")}
              alt="Map"
              style={{ width: "45vw" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
