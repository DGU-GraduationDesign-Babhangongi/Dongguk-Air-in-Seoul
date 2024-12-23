import React, { useState, useEffect } from 'react';
import styles from './main.module.css';
import FloorBox from '../components/floorBox/floorBox';
import { fetchForeCast, fetchForeCast2 } from '../../pages/forecast';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import sunIcon from "../../assets/images/main/sun_icon.png";
import cloudyIcon from "../../assets/images/main/cloudy_icon.png";
import semicloudyIcon from "../../assets/images/main/semicloudy_icon.png";
import cloudyrainIcon from "../../assets/images/main/cloudyrain_icon.png";

function Main() {
  const color = localStorage.getItem("schoolColor");
  const [dateTime, setDateTime] = useState(new Date());
  const [forecast, setForecast] = useState(null);
  const [forecast2, setForecast2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const mapImagesByDay = {
    월: [
      require("../../assets/images/smartmirror/map/13115.PNG"),
      require("../../assets/images/smartmirror/map/14142.PNG"),
      require("../../assets/images/smartmirror/map/15145.PNG"),
      require("../../assets/images/smartmirror/map/15147.PNG"),
      require("../../assets/images/smartmirror/map/16119.PNG"),
      require("../../assets/images/smartmirror/map/16144.PNG"),
    ],
    화: [
      require("../../assets/images/smartmirror/map/23115.PNG"),
      require("../../assets/images/smartmirror/map/24142.PNG"),
      require("../../assets/images/smartmirror/map/25145.PNG"),
      require("../../assets/images/smartmirror/map/25147.PNG"),
      require("../../assets/images/smartmirror/map/26119.PNG"),
      require("../../assets/images/smartmirror/map/26144.PNG"),
    ],
    수: [
      require("../../assets/images/smartmirror/map/33115.PNG"),
      require("../../assets/images/smartmirror/map/34142.PNG"),
      require("../../assets/images/smartmirror/map/35145.PNG"),
      require("../../assets/images/smartmirror/map/35147.PNG"),
      require("../../assets/images/smartmirror/map/36119.PNG"),
      require("../../assets/images/smartmirror/map/36144.PNG"),
    ],
    목: [
      require("../../assets/images/smartmirror/map/43115.PNG"),
      require("../../assets/images/smartmirror/map/44142.PNG"),
      require("../../assets/images/smartmirror/map/45145.PNG"),
      require("../../assets/images/smartmirror/map/45147.PNG"),
      require("../../assets/images/smartmirror/map/46119.PNG"),
      require("../../assets/images/smartmirror/map/46144.PNG"),
    ],
    금: [
      require("../../assets/images/smartmirror/map/53115.PNG"),
      require("../../assets/images/smartmirror/map/54142.PNG"),
      require("../../assets/images/smartmirror/map/55147.PNG"),
      require("../../assets/images/smartmirror/map/56119.PNG"),
      require("../../assets/images/smartmirror/map/56144.PNG"),
    ],
    토: [
      require("../../assets/images/smartmirror/map/happyweek.png"),
    ],
    일: [
      require("../../assets/images/smartmirror/map/happyweek.png"),
    ],
  };

  const getMapImagesForToday = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const today = days[new Date().getDay()];
    return mapImagesByDay[today] || [];
  };

  const [mapImages] = useState(getMapImagesForToday());

  const isWeekend = () => {
    const today = new Date().getDay();
    return today === 0 || today === 6; // 0: 일요일, 6: 토요일
  };

  const getFloorText = () => {
    const currentImage = mapImages[currentImageIndex];
    const imageName = currentImage.split('/').pop(); 
    const floorNumber = imageName[1];
    return `${floorNumber}th floor`;
  };

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % mapImages.length);
    }, 5000); 

    return () => clearInterval(slideInterval);
  }, [mapImages.length]);

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

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

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

  const getWeatherAdvice = () => {
    if (forecast.rain === '1') {
      return "오늘은 하루 종일 비가 예상됩니다. 외출 시 우산을 챙기세요.";
    } else if (forecast.rain === '3') {
      return "눈이 오는 날입니다. 외출 시 따뜻하게 입으세요.";
    } else if (forecast.rain === '2') {
      return "오늘은 비와 눈이 섞여 내릴 수 있습니다. 미끄럼에 주의하세요.";
    } else if (forecast.cloudy === '1') {
      return "맑은 날씨입니다. 야외 활동을 즐기기 좋은 날이에요.";
    } else if (forecast.cloudy === '3') {
      return "햇살이 구름 사이로 드문드문 비추고 있어요. 산책이나 가벼운 야외 활동을 즐겨보세요!";
    } else if (forecast.cloudy === '4') {
      return "흐린 날씨입니다. 실내 활동을 계획해보세요.";
    } else if (forecast.humidity < 30) {
      return "건조한 날씨입니다. 수분 보충에 유의하세요.";
    } else if (forecast2.maxTemp >= 30) {
      return "무더운 날씨가 예상됩니다. 시원한 곳에서 휴식을 취하세요.";
    } else if (forecast2.minTemp <= 5) {
      return "추운 날씨입니다. 따뜻한 옷차림을 준비하세요.";
    } else {
      return "오늘의 날씨에 맞게 계획을 세워보세요!";
    }
  };

  return (
    <div className={styles.container}>
      {/* Header section */}
      <div className={styles.header}>
        <div className={styles.topButton}>
          <Link to="/smartM">
            <img
              src={require("../../assets/images/smartmirror/home.png")}
              alt="Home"
              className={styles.img}
            />
          </Link>
        </div>
        <img
          src={require("../../assets/images/smartmirror/logo.png")}
          alt="CLEAN AIR iN DONGGUK"
          className={styles.logo}
        />
        <div className={styles.topButton} onClick={() => navigate(-1)}>
          <img
            src={require("../../assets/images/smartmirror/return.png")}
            alt="Return"
            style={{ width: '60%', margin: 'auto' }}
          />
        </div>
      </div>

      <div className={styles.checkContainer}>
          외모 check
          <img
            src={require("../../assets/images/smartmirror/check.png")}
            alt="error"
            style={{ width: '2vw', height: '2vw', paddingLeft: '1vw' }}
          />
        </div>

      <div className={styles.mainContainer}>
        <div className={styles.weatherBox}>
          <div className={styles.weatherDateContainer}>
            <div className={styles.weatherDate}>
            <img
              src={require("../../assets/images/smartmirror/date.png")}
              alt="Date Icon"
              className={styles.dateIcon}
            />
              {formatDate(dateTime)}</div>
          </div>
          {loading ? (
            <p>Loading weather data...</p>
          ) : (
            <div className={styles.weatherBoxALL}>
              <div className={styles.weatherBoxLeft}>
              <p className={styles.weatherTemperature}>{forecast.temperature}°C</p>
              <p className={styles.weatherRain}>
                {forecast.rain >= '1' ? '흐리고 비' : forecast.cloudy === '1' ? '맑음' : forecast.cloudy === '3' ? '구름많음' : '흐림'}
              </p>
              <p className={styles.weatherMinMax}>
                {forecast2.minTemp}°C / {forecast2.maxTemp}°C
              </p>
              <p className={styles.weatherMinMax}>
                습도 {forecast.humidity}%
              </p>
              <p className={styles.weatherAdvice}>
                {getWeatherAdvice()}
              </p>
              </div>
              <div className={styles.weatherBoxRight}>
              <img
                      src={
                        forecast.rain >= "1"
                          ? cloudyrainIcon
                          : forecast.cloudy === "1"
                          ? sunIcon
                          : forecast.cloudy === "3"
                          ? semicloudyIcon
                          : cloudyIcon
                      }
                      alt="날씨 이미지"
                      style={{
                        width: "clamp(80px, 10vw, 200px)", 
                        alignSelf:'right',
                        filter: "drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.2))",
                      }}
                    />
              </div>
            </div>
   
          )}
        </div>
        <div className={styles.blackBox}></div>
      </div>

      {/* Detail Section */}
      <div className={styles.titleContainer}>
        <div className={styles.buildingContainer}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={require("../../assets/images/smartmirror/location.png")}
              alt="location"
              style={{ width: '5vw', paddingRight: '1.5vw' }}
            />
            신공학관
          </div>
        </div>
        <div className={styles.helpContainer}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={require("../../assets/images/smartmirror/TipsIcon.png")}
            alt="detail"
            style={{ width: '2.4vw', height: '2.4vw', marginRight: '0.5vw' }}
          />
          원하는 층을 선택하여 현재 공기질 상태를 확인하세요.
        </div></div>
      </div>

      <div className={styles.detailContainer}>
        <FloorBox floor="3rd" rooms={['3115', '3173']} click={true} />
        <FloorBox floor="4th" rooms={['4142']}  />
        <FloorBox floor="5th" rooms={['5145', '5147']} />
        <FloorBox floor="6th" rooms={['6119', '6144']}  />
      </div>

      {/* Map Display Section with Image Slide */}
      <div className={styles.bottomContainer}>
        <div className={styles.whiteBox}>
          {!isWeekend() && getFloorText()}
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-around",
              marginTop: "2%",
              marginBottom: "2%",
            }}
          >
            <img
              src={mapImages[currentImageIndex]}
              alt="Map"
              style={{ width: "72vw" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
