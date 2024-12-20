import React, { useState, useRef } from "react";
import Header1 from "../../components/common/Header1/Header1";
import styles from "./UnivMain.module.css";

import univ1 from "../../assets/images/univ1.png";
import univ2 from "../../assets/images/univ2.png";
import univ3 from "../../assets/images/univ3.png";
import univ4 from "../../assets/images/univ4.png";
import univ5 from "../../assets/images/univ5.png";

function Main() {
  const [showPopup, setShowPopup] = useState(false); // 팝업 상태 관리
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({
      left: -240,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({
      left: 240,
      behavior: "smooth",
    });
  };

  const openPopup = () => {
    setShowPopup(true); // 팝업 열기
  };

  const closePopup = () => {
    setShowPopup(false); // 팝업 닫기
  };

  return (
    <div>
      <Header1 />
      <div className={styles.mainContainer}>
        <div className={styles.welcomeMessage}>
          <h2>관리자님 환영합니다!</h2>
          <p>공기질을 확인할 대학교를 선택해주세요.</p>
        </div>
        <div className={styles.scrollContainer}>
          <button className={styles.scrollButton} onClick={scrollLeft}>
            &lt;
          </button>
          <div className={styles.buildingsWrapper} ref={scrollContainerRef}>
            <div className={styles.buildings}>
              <div className={styles.building}>
                <img src={univ1} alt="동국대학교" />
                <h2>동국대학교</h2>
              </div>
              <div className={styles.building}>
                <img src={univ2} alt="제주대학교" />
                <h2>제주대학교</h2>
              </div>
              <div className={styles.building}>
                <img src={univ3} alt="대전대학교" />
                <h2>대전대학교</h2>
              </div>
              <div className={styles.building}>
                <img src={univ4} alt="한라대학교" />
                <h2>한라대학교</h2>
              </div>
              <div className={styles.building}>
                <img src={univ5} alt="세종대학교" />
                <h2>세종대학교</h2>
              </div>
            </div>
          </div>
          <button className={styles.scrollButton} onClick={scrollRight}>
            &gt;
          </button>
        </div>
        <div className={styles.registerMessage}>
          새로운 대학교를 등록하고 싶으신가요?{" "}
          <button className={styles.registerButton} onClick={openPopup}>
            등록하기
          </button>
        </div>
      </div>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h3 className={styles.popupTitle}>대학교 등록</h3>
            <form className={styles.popupForm}>
              <label>학교 이름:</label>
              <input type="text" placeholder="예: 동국대학교" />
              <label>영어 이름:</label>
              <input type="text" placeholder="예: Dongguk University" />
              <label>로고:</label>
              <input type="file" />
              <label>주소:</label>
              <input type="text" placeholder="예: 서울특별시 중구 필동로 1길" />
              <label>최초 관리자 메일:</label>
              <input type="email" placeholder="예: admin@example.com" />
              <label>상징 색:</label>
              <input type="color" />
            </form>
            <div className={styles.popupActions}>
              <button className={`${styles.popupButton} cancel`} onClick={closePopup}>
                취소
              </button>
              <button className={`${styles.popupButton} submit`}>등록</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
