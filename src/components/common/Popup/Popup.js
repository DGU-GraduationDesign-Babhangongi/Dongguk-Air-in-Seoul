import React from "react";
import styles from "./Popup.module.css"; // CSS 모듈 스타일을 가져옵니다.

const Popup = ({ popupContent, onClose, registerLink, buttonText }) => {
  const handleRegister = () => {
    if (registerLink) {
      window.location.href = registerLink; // 링크로 이동
    }
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>알 림</h2>
        <div className={styles.dividers}></div>
        <p className={styles.content}>{popupContent}</p>
        
        <p className={styles.signupText}>

  <button onClick={onClose} className={styles.popupButton}>
    닫기
  </button>
  <button onClick={handleRegister} className={styles.popupButton}>
    {buttonText}
  </button>
</p>

      </div>
    </div>
  );
};

export default Popup;
