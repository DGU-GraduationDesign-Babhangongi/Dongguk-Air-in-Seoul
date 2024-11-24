import React, { useState } from "react";
import styles from "./Popup.module.css"; // CSS 모듈 스타일
import { useNavigate } from "react-router-dom";

const Popup = ({ popupContent, onClose, registerLink, buttonText, doit }) => {
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleRegister = () => {
    if (registerLink) {
      navigate(registerLink);
    }
    if (doit) {
      doit();
    }
    handleClose();
  };

  const formatTextWithLineBreaks = (text) => {
    const formattedText = text.replace(/\n/g, "<br />");
    return { __html: formattedText };
  };

  return (
    <div className={styles.popup}>
      <div
        className={`${styles.popupContent} ${
          isClosing ? styles.fadeOut : styles.fadeIn
        }`}
      >
        <h2>알 림</h2>
        <div className={styles.dividers}></div>
        <p
          className={styles.content}
          dangerouslySetInnerHTML={formatTextWithLineBreaks(popupContent)}
        ></p>
        <div className={styles.buttonContainer}>
          <button onClick={handleClose} className={styles.popupButton}>
            닫기
          </button>
          <button onClick={handleRegister} className={styles.popupButton}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
