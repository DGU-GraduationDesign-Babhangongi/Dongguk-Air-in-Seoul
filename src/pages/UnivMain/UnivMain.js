import React, { useRef } from "react";
import Header1 from "../../components/common/Header1/Header1";
import styles from "./UnivMain.module.css";

import jungbo from "../../assets/images/main/jungboP.png";
import singong from "../../assets/images/main/singong.png";
import wonheung from "../../assets/images/main/wonheung.png";
import anotherBuilding from "../../assets/images/main/wonheung.png";

function Main() {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div>
      <Header1 />
      <div className={styles.mainContainer}>
        <div className={styles.welcomeMessage}>
          <h2 style={{ fontSize: "clamp(18px, 2vw, 28px)" }}>
            사용자님 환영합니다!
          </h2>
          <p style={{ fontSize: "clamp(12px, 1.5vw, 20px)" }}>
            공기질을 확인할 강의실을 선택해주세요.
          </p>
        </div>
        <div className={styles.buildingsWrapper}>
          <button className={`${styles.scrollButton} ${styles.left}`} onClick={scrollLeft}>
            ◀
          </button>
          <div className={styles.buildings} ref={scrollContainerRef}>
            <div className={styles.building}>
              <img src={jungbo} alt="정보문화관 P" />
              <h2>정보문화관 P</h2>
            </div>
            <div className={styles.building}>
              <img src={singong} alt="신공학관" />
              <h2>신공학관</h2>
            </div>
            <div className={styles.building}>
              <img src={wonheung} alt="원흥관" />
              <h2>원흥관</h2>
            </div>
            <div className={styles.building}>
              <img src={anotherBuilding} alt="다른 건물" />
              <h2>다른 건물</h2>
            </div>
          </div>
          <button className={`${styles.scrollButton} ${styles.right}`} onClick={scrollRight}>
            ▶
          </button>
        </div>
        <p style={{ marginTop: "20px" }}>새로운 대학교를 등록하고 싶으신가요? <a href="/register">등록하기</a></p>
      </div>
    </div>
  );
}

export default Main;
