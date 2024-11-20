import React, { useState, useEffect } from 'react';
import styles from './ControlBoxMg.module.css';
import ToggleButton from '../ToggleButton/ToggleButton';
import API from '../../../API/api';

function ControlBox({ width, height, title, color, maxWidth, building, room }) {
  const [devices, setDevices] = useState([]); // 장치 목록
  const [toggleStatuses, setToggleStatuses] = useState([]); // 장치 상태
  const token = localStorage.getItem('token');

  // API 데이터를 가져오는 함수
  const fetchDevices = async () => {
    if (!room || !building) return; // 강의실 또는 건물 정보가 없을 경우 API 호출 중단
    const endpoint =
      `/api/devices/classroom?building=` +
      encodeURIComponent(building) +
      `&name=` +
      encodeURIComponent(room);

    try {
      const response = await API.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;

      // 데이터 상태 설정
      setDevices(data);
      setToggleStatuses(data.map((device) => device.status)); // 초기 상태 설정
    } catch (error) {
      console.error('장치 정보를 가져오는 데 실패했습니다:', error);
      setDevices([]); // 오류 발생 시 초기화
    }
  };

  // 장치 상태 변경 함수
  const handleToggleChange = async (index, newStatus) => {
    const updatedStatuses = [...toggleStatuses];
    updatedStatuses[index] = newStatus;
    setToggleStatuses(updatedStatuses);

    try {
      const device = devices[index];
      await API.post('/api/devices/control', {
        deviceId: device.id,
        status: newStatus,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`${device.type} 상태 변경 성공:`, newStatus);
    } catch (error) {
      console.error('상태 변경 실패:', error);
    }
  };

  // 컴포넌트 로드 시 데이터 가져오기
  useEffect(() => {
    fetchDevices();
  }, [building, room]);

  return (
    <div
      className={styles.Container}
      style={{
        width: `${width}`,
        height: `${height}`,
        maxWidth: `${maxWidth}`,
      }}
    >
      <div style={{ marginLeft: '5%' }}>{title}</div>
      <div
        className={styles.box}
        style={{
          height: `${height}`,
          border: `1.5px solid ${color}`,
        }}
      >
        {!room ? (
          <div className={styles.message}>강의실을 선택해주세요</div>
        ) : devices.length === 0 ? (
          <div className={styles.message}>해당 강의실에 기기가 없습니다</div>
        ) : (
          devices.map((device, index) => (
            <div key={device.id} className={styles.tableRow}>
              <span className={styles.deviceName}>{device.type}</span>
              <div className={styles.tableCell}>
                <ToggleButton
                  isToggled={toggleStatuses[index]}
                  onToggleChange={(newStatus) => handleToggleChange(index, newStatus)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ControlBox;
