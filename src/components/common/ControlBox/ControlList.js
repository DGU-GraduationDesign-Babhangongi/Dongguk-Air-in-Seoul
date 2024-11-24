import React, { useState, useEffect } from 'react';
import API from '../../../API/api';

import ToggleButton from '../ToggleButton/ToggleButton';

import styles from './ControlBox.module.css';

function ControlList({ width, height, gap, building, room }) {
  const [toggleStatuses, setToggleStatuses] = useState([]);
  const [devices, setDevices] = useState([]);
  const token = localStorage.getItem('token');

  // Toggle 상태 변경 처리
  const handleToggleChange = (index, newStatus) => {
    const updatedStatuses = [...toggleStatuses];
    updatedStatuses[index] = newStatus;
    setToggleStatuses(updatedStatuses);
  };

  // API에서 기기 데이터 가져오기
  const fetchData = async () => {
    const endpoint = `/api/devices/classroom?building=${encodeURIComponent(building)}&name=${encodeURIComponent(room)}`;
    try {
      const response = await API.get(endpoint,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;
      setDevices(data);
      setToggleStatuses(data.map((device) => device.status));
    } catch (e) {
      //console.error('API 오류:', e);
      setDevices([]);
    }
  };

  // 데이터 주기적 가져오기
  useEffect(() => {
    if (room) {
      fetchData();
      const interval = setInterval(fetchData, 5000); // 5초 간격
      return () => clearInterval(interval); // 언마운트 시 인터벌 정리
    }
  }, [building, room]);

  return (
    <div className={styles.table} style={{ width, height, gap }}>
      {!room ? (
        <div className={styles.message}>강의실을 선택해주세요</div>
      ) : devices.length === 0 ? (
        <div className={styles.message}>해당 강의실의 기기가 존재하지 않습니다.</div>
      ) : (
        devices.map((device, index) => (
          <div key={device.id} className={styles.tableRow}>
            <span>{device.type}</span>
            <div className={styles.tableCell}>
              <ToggleButton
                deviceId={device.id}
                isToggled={toggleStatuses[index]}
                onToggleChange={(newStatus) => handleToggleChange(index, newStatus)}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ControlList;
