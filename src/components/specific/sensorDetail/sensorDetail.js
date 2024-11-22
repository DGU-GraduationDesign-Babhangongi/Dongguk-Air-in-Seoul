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

const SensorDetail = ({ coord, getStatusColor, hoveredIndex }) => {
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
