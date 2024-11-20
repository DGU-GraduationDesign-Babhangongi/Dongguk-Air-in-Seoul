import React, { useState, useEffect } from 'react';
import styles from './ControlBox.module.css';
import ToggleButton from '../ToggleButton/ToggleButton';
import API from '../../../API/api';

function ControlList({ width, height, gap, building, room }) {
  const [toggleStatuses, setToggleStatuses] = useState([]);
  const [devices, setDevices] = useState([]);
  const token = localStorage.getItem('token');

  // Toggle 상태가 변경될 때 호출되는 함수
  const handleToggleChange = (index, newStatus) => {
    const updatedStatuses = [...toggleStatuses];
    updatedStatuses[index] = newStatus;
    setToggleStatuses(updatedStatuses);
    console.log(`Toggle ${index} status changed:`, newStatus);
  };

  // API 데이터를 가져오는 함수
  const fetchData = async () => {
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
      const data = response.data; // axios를 사용할 때 response의 데이터는 response.data에 있음
      console.log('응답 데이터:', data);

      // 데이터 상태를 설정
      setDevices(data);

      // 각 장치의 초기 상태를 설정
      setToggleStatuses(data.map((device) => device.status));
    } catch (e) {
      console.error('API 오류: ', e);
      setDevices([]); // 오류 시 데이터를 초기화
    }
  };

  // 컴포넌트 로드 및 주기적 데이터 가져오기
  useEffect(() => {
    if (room) {
      fetchData();
      const interval = setInterval(() => {
        fetchData();
      }, 5000); // 5초 간격으로 데이터 가져오기

      return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    }
  }, [building, room]);

  return (
    <div
      className={styles.table}
      style={{
        width: `${width}`,
        height: `${height}`,
        gap: `${gap}`,
      }}
    >
      {/* room이 없으면 강의실 선택 메시지 출력 */}
      {!room ? (
        <div className={styles.message}>강의실을 선택해주세요</div>
      ) : (
        // room이 있고, 가져온 데이터가 없으면 기기 없음 메시지 출력
        devices.length === 0 ? (
          <div className={styles.message}>해당 강의실의 기기가 존재하지 않습니다.</div>
        ) : (
          // devices가 있을 경우 기기 목록 출력
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
        )
      )}
    </div>
  );
}

export default ControlList;
