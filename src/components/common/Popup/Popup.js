import React from "react";
import styles from "./Popup.module.css"; // CSS 모듈 스타일을 가져옵니다.
import { useNavigate } from "react-router-dom";

const Popup = ({ popupContent, onClose, registerLink, buttonText, doit }) => {
  const navigate = useNavigate();

  const handleRegister = () => {
    if (registerLink) {
      navigate(registerLink); // React Router로 경로 이동
    }
    if (doit) {
      doit(); // 외부에서 전달된 'doit' 함수 실행
    }
    onClose(); // 팝업을 닫습니다.
  };

  // '\n'을 <br />로 변환하는 함수
  const formatTextWithLineBreaks = (text) => {
    const formattedText = text.replace(/\n/g, "<br />"); // \n을 <br />로 변환
    return { __html: formattedText }; // dangerouslySetInnerHTML에 사용할 수 있게 객체로 반환
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>알 림</h2>
        <div className={styles.dividers}></div>
        <p
          className={styles.content}
          dangerouslySetInnerHTML={formatTextWithLineBreaks(popupContent)} // 줄바꿈 처리
        ></p>
        
        <div className={styles.buttonContainer}>
          <button onClick={onClose} className={styles.popupButton}>
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
