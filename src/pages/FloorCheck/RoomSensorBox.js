import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./RoomSensorBox.module.css";
import API from "../../API/api";

function RoomSensorBox({ roomId, sensorId }) {
  const [sensorData, setSensorData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSensorData = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/api/sensorData/recent/${sensorId}`);
        setSensorData(response.data);
      } catch (error) {
        console.error(`센서 데이터 가져오기 실패: ${roomId}`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchSensorData();
  }, [sensorId]);

  return (
    <div className={styles.roomSensorBox}>
      <h3>{roomId} 강의실</h3>
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <div>
          <p>온도: {sensorData.Temperature?.value || "데이터 없음"}°C</p>
          <p>습도: {sensorData.Humidity?.value || "데이터 없음"}%</p>
          <p>CO₂: {sensorData.CO2?.value || "데이터 없음"}ppm</p>
        </div>
      )}
    </div>
  );
}

RoomSensorBox.propTypes = {
  roomId: PropTypes.string.isRequired,
  sensorId: PropTypes.string.isRequired,
};

export default RoomSensorBox;
