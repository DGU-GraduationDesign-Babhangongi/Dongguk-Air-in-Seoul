import React, { useEffect, useState } from "react";
import styles from "./weatherInfo.module.css";
import { fetchForeCast, fetchForeCast2 } from "../../../pages/forecast";

import sunIcon from "../../../assets/images/main/sun_icon.png";
import cloudyIcon from "../../../assets/images/main/cloudy_icon.png";
import semicloudyIcon from "../../../assets/images/main/semicloudy_icon.png";
import cloudyrainIcon from "../../../assets/images/main/cloudyrain_icon.png";
import weatherlocation from "../../../assets/images/main/location_icon.png";

const WeatherInfo = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [forecast, setForecast] = useState(null);
  const [forecast2, setForecast2] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weatherData = await fetchForeCast(60, 127);
        const weatherData2 = await fetchForeCast2(60, 127);
        setForecast(weatherData);
        setForecast2(weatherData2);
        setLoading(false);
      } catch (error) {
        // console.error("Error fetching weather data: ", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getWeatherAdvice = () => {
    if (!forecast || !forecast2) {
      return "날씨 데이터를 불러오는 중입니다.";
    }
    if (forecast.rain === "1") {
      return "오늘은 하루 종일 비가 예상됩니다\n외출 시 우산을 챙기세요";
    } else if (forecast.rain === "3") {
      return "눈이 오는 날입니다\n외출 시 따뜻하게 입으세요";
    } else if (forecast.rain === "2") {
      return "오늘은 비와 눈이 섞여 내릴 수 있습니다\n미끄럼에 주의하세요";
    } else if (forecast.cloudy === "1") {
      return "맑은 날씨입니다\n야외 활동을 즐기기 좋은 날이에요!";
    } else if (forecast.cloudy === "3") {
      return "햇살이 구름 사이로 드문드문 비추고 있어요\n산책이나 가벼운 야외 활동을 즐겨보세요!";
    } else if (forecast.cloudy === "4") {
      return "흐린 날씨입니다\n실내 활동을 계획해보세요";
    } else if (forecast.humidity < 30) {
      return "건조한 날씨입니다\n수분 보충에 유의하세요";
    } else if (forecast2.maxTemp >= 30) {
      return "무더운 날씨가 예상됩니다\n시원한 곳에서 휴식을 취하세요";
    } else if (forecast2.minTemp <= 5) {
      return "추운 날씨입니다\n따뜻한 옷차림을 준비하세요";
    } else {
      return "오늘의 날씨에 맞게 계획을 세워보세요!";
    }
  };

  const formatDate = (date) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = days[date.getDay()];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}년 ${month}월 ${day}일 ${dayOfWeek} KST ${hours}:${minutes}`;
  };

  return (
    <div className={styles.weatherInfo}>
      <h3
        style={{
          fontSize: "clamp(15px, 1.6vw, 20px)",
        }}
      >
        <img src={weatherlocation} alt="현재 위치" className={styles.icons} />
        서울 중구 필동
      </h3>
      {forecast && forecast2 ? (
        <>
          <div className={styles.weatherloading}>
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
              className={styles.weatherImg}
            />
            <h1 className={styles.weatherTemperature}>
              {forecast.temperature}°C
            </h1>
          </div>
          <p className={styles.weatherRain}>
            {forecast.rain >= "1"
              ? "흐리고 비"
              : forecast.cloudy === "1"
              ? "맑음"
              : forecast.cloudy === "3"
              ? "구름많음"
              : "흐림"}
          </p>
          <p className={styles.weatherMinMax}>
            최고 {forecast2.maxTemp}°C / 최저 {forecast2.minTemp}°C
            <span style={{ marginLeft: "0.5vw" }}>
              습도 {forecast.humidity}%
            </span>
          </p>
          <p className={styles.weatherMinMax2}>{formatDate(dateTime)}</p>
          <p
            className={styles.weatherAdvice}
            style={{
              textAlign: "right",
            }}
          >
            <p className={styles.weatherAdvice}>{getWeatherAdvice()}</p>
          </p>
        </>
      ) : (
        <p>데이터를 불러오는 중입니다.</p>
      )}
    </div>
  );
};

export default WeatherInfo;
