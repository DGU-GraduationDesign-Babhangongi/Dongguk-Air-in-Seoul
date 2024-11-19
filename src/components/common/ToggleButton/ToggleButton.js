import React, { useState } from 'react';
import style from './ToggleButton.module.css'; // 외부 CSS 파일

function ToggleButton({ deviceId, onToggleChange }) {

  const [isToggled, setIsToggled] = useState(false); // 로딩 상태 추가

  const handleToggle = () => {
    const newState = !isToggled;
    onToggleChange(newState); // 상태 변경 함수 호출
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
