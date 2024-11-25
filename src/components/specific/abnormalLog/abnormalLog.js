import React, { useEffect, useState } from "react";
import styles from "./abnormalLog.module.css";
import sensor from "../../../assets/images/main/sensor_icon.png";
import API from "../../../API/api";

const AbnormalLog = ({ token }) => {
  const [sensorLogs, setSensorLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSensorLogs = async () => {
    if (!token) {
      console.error("토큰이 없습니다. 로그인 후 다시 시도하세요.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await API.get("/api/sensorData/abnormalValues", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSensorLogs(response.data);
    } catch (error) {
      console.error("Error fetching sensor logs:", error.response || error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "RED":
        return "#F44336";
      case "ORANGE":
        return "#FF9800";
      case "YELLOW":
        return "#FFBD2E";
      default:
        return "black";
    }
  };

  const formatLogDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}. ${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}. ${date.getDate().toString().padStart(2, "0")}. ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
  };

  const getUnit = (sensorType) => {
    switch (sensorType) {
      case "Temperature":
        return "°C";
      case "Humidity":
        return "%";
      case "TVOC":
      case "PM2_5MASSCONCENTRATION":
        return "㎍/m³";
      case "AmbientNoise":
        return "dB";
      default:
        return "";
    }
  };

  useEffect(() => {
    fetchSensorLogs();
  }, []);

  return (
    <div>
      <h3 style={{ fontSize: "clamp(15px, 1.6vw, 20px)" }}>
        <img src={sensor} alt="센서 아이콘" className={styles.icons} />
        센서 수치 이상 로그 기록
      </h3>
      <div className={styles.scrollableContainer}>
        {isLoading ? (
          <div>이상 센서 수치 값을 로딩 중입니다...</div>
        ) : sensorLogs.length > 0 ? (
          sensorLogs.map((log, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <strong>[{formatLogDate(log.timestamp)}]</strong>
              <br />
              <span>
                {log.building} {log.name}
                <span
                  style={{
                    color: getLevelColor(log.level),
                    fontWeight: "bold",
                    marginLeft: "10px",
                  }}
                >
                  {log.sensorType} {log.value}
                  {getUnit(log.sensorType) && ` ${getUnit(log.sensorType)}`}
                </span>
              </span>
              <br />
            </div>
          ))
        ) : (
          <div>로그인하시면 이상 수치 로그를 확인할 수 있습니다</div>
        )}
      </div>
    </div>
  );
};

export default AbnormalLog;
