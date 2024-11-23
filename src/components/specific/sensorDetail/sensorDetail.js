import React, { useState, useEffect } from "react";
import styles from "./sensorDetail.module.css";
import API from "../../../API/api";
/* 이미지 import */
import temperature from "../../../assets/images/main/hoverBoxIcons/img_temp.png";
import moisture from "../../../assets/images/main/hoverBoxIcons/img_mois.png";
import tvoc from "../../../assets/images/main/hoverBoxIcons/img_tvoc.png";
import pm25 from "../../../assets/images/main/hoverBoxIcons/img_pm2.5.png";
import noise from "../../../assets/images/main/hoverBoxIcons/img_noise.png";
import sensor from "../../../assets/images/main/hoverBoxIcons/img_sensor.png";

// 색상 계산 함수들
const getTemperatureColor = (value) => {
  if (value < 16.5 || value > 27.5) return "#F44336";
  if ((value >= 16.5 && value < 17.6) || (value > 26.4 && value <= 27.5))
    return "#FF9800";
  if ((value >= 17.6 && value < 18.7) || (value > 25.3 && value <= 26.4))
    return "#FFEB3B";
  if ((value >= 18.7 && value < 19.8) || (value > 24.2 && value <= 25.3))
    return "#8BC34A";
  return "#5C82F5";
};

const getHumidityColor = (value) => {
  if (value < 10 || value > 90) return "#F44336";
  if ((value >= 10 && value < 20) || (value > 80 && value <= 90))
    return "#FF9800";
  if ((value >= 20 && value < 30) || (value > 70 && value <= 80))
    return "#FFEB3B";
  if ((value >= 30 && value < 40) || (value > 60 && value <= 70))
    return "#8BC34A";
  return "#5C82F5";
};

const getTVOCColor = (value) => {
  if (value > 10000) return "#F44336";
  if (value > 3000 && value <= 10000) return "#FF9800";
  if (value > 1000 && value <= 3000) return "#FFEB3B";
  if (value > 300 && value <= 1000) return "#8BC34A";
  return "#5C82F5";
};

const getPM25Color = (value) => {
  if (value > 64) return "#F44336";
  if (value > 53 && value <= 64) return "#FF9800";
  if (value > 41 && value <= 53) return "#FFEB3B";
  if (value > 23 && value <= 41) return "#8BC34A";
  return "#5C82F5";
};

const getNoiseColor = (value) => {
  if (value > 80) return "#F44336";
  if (value > 70 && value <= 80) return "#FF9800";
  if (value > 60 && value <= 70) return "#FFEB3B";
  if (value > 50 && value <= 60) return "#8BC34A";
  return "#5C82F5";
};

const getStatusColor = (value, type) => {
  if (type === "temperature") return getTemperatureColor(value);
  if (type === "humidity") return getHumidityColor(value);
  if (type === "tvoc") return getTVOCColor(value);
  if (type === "pm25") return getPM25Color(value);
  if (type === "noise") return getNoiseColor(value);
};

const SensorDetail = ({ coord, hoveredIndex }) => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSensorData = async () => {
      if (!coord) return;
      try {
        const endpoint = `/api/sensorData/recent/classroom?building=${encodeURIComponent(
          coord.building
        )}&name=${encodeURIComponent(coord.id)}`;
        const response = await API.get(endpoint);
        setSensorData(response.data);
      } catch (error) {
        console.error("센서 데이터를 불러오는 데 실패했습니다:", error);
        setSensorData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSensorData();
  }, [coord]);

  const renderSensorItem = (label, value, unit, type, imgSrc) => {
    const statusColor =
      label === "센서 상태" ? "#8BC34A" : getStatusColor(value, type);
    return (
      <div className={styles.sensorText}>
        <img src={imgSrc} alt={label} className={styles.sensorImg} />
        <span>{label}</span>
        <span style={{ marginLeft: "auto" }}>
          {loading ? "--" : `${value}${unit}`}
        </span>
        <span
          className={styles.statusLight}
          style={{
            backgroundColor: statusColor,
          }}
        ></span>
      </div>
    );
  };

  if (loading) {
    return <div>센서 데이터를 불러오는 중 . . .</div>;
  }

  if (!sensorData) {
    return <div>센서 데이터를 불러오는 데 실패했습니다.</div>;
  }

  return (
    <>
      {hoveredIndex !== null && (
        <>
          {renderSensorItem(
            "온도",
            sensorData.Temperature?.value,
            "°C",
            "temperature",
            temperature
          )}
          {renderSensorItem(
            "습도",
            sensorData.Humidity?.value,
            "%",
            "humidity",
            moisture
          )}
          {renderSensorItem(
            "TVOC",
            sensorData.TVOC?.value,
            "㎍/m³",
            "tvoc",
            tvoc
          )}
          {renderSensorItem(
            "PM2.5",
            sensorData.PM2_5MassConcentration?.value,
            "㎍/m³",
            "pm25",
            pm25
          )}
          {renderSensorItem(
            "소음",
            sensorData.AmbientNoise?.value,
            "dB",
            "noise",
            noise
          )}
          {renderSensorItem("센서 상태", "ON", "", "sensor", sensor)}
        </>
      )}
    </>
  );
};

export default SensorDetail;
