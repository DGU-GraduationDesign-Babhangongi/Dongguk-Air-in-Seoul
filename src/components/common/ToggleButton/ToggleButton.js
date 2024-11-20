import React, { useState } from 'react';
import style from './ToggleButton.module.css'; // 외부 CSS 파일
import API from '../../../API/api';

function ToggleButton({ isToggled, onToggleChange, deviceId }) {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleToggle = () => {
    const newState = !isToggled;
    onToggleChange(newState); // 상태 변경 함수 호출
    fetchData(newState); // 상태 변경 후 fetchData 실행
  };

  const fetchData = async (newState) => {
    if (loading) return;

    const endpoint = `/api/devices/toggle/deviceId?deviceId=${encodeURIComponent(deviceId)}&state=${newState}`;
    
    try {
      setLoading(true);
      const response = await API.post(endpoint, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 응답 데이터를 통해 상태 업데이트 또는 필요한 작업을 할 수 있습니다
      console.log('Toggle 상태 응답:', response.data);
    } catch (e) {
      console.error('API 오류: ', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${style.toggleButton} ${isToggled ? style.toggled : style.untoggled}`}
      onClick={handleToggle}
    >
      <div className={`${style.circle} ${isToggled ? style.right : style.left}`} />
    </div>
  );
}

export default ToggleButton;
