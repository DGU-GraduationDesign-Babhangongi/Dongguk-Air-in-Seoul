import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Popup from "../../../components/common/Popup/Popup";

import { FiGrid, FiLayers, FiCpu, FiLogOut } from "react-icons/fi";
import styles from "./SideBar.module.css";


var buildingName = "신공학관";

const SideBar = ({ i }) => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // 로그아웃 함수
  const logout = () => {
    // localStorage에서 토큰 제거
    localStorage.removeItem("token");
    // 로그아웃 후 메인 페이지로 이동
    navigate("/");
    console.log("User logged out");
  };

  // 팝업 닫기 함수
  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className={styles.sidebarContainer} style={{ marginTop: "0" }}>
      <aside className={styles.sidebar}>
        <div className={styles.topMenu}>
          <div
            style={{
              fontSize: "clamp(8px, 0.9vw, 20px)",
              paddingLeft: "clamp(19px, 1.9%, 31px)",
            }}
          >
            현재 건물
          </div>
          <div className={styles.title}>
            <img
              src={require("../../../assets/images/building.png")}
              alt="building"
              className={styles.titleImg}
            />
            {buildingName}
          </div>
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li
                className={`${styles.navItem} ${i === "1" ? styles.bold : ""}`}
              >
                <FiGrid className={styles.icon} />
                <Link to="/" className={styles.navLink}>
                  메인화면
                </Link>
              </li>
              <li
                className={`${styles.navItem} ${i === "2" ? styles.bold : ""}`}
              >
                <img
                  src={require("../../../assets/images/graph.png")}
                  alt="graph"
                  className={styles.icon}
                />
                <Link to="/figures" className={styles.navLink}>
                  강의실 수치 확인
                </Link>
              </li>
              <li
                className={`${styles.navItem} ${i === "3" ? styles.bold : ""}`}
              >
                <FiLayers className={styles.icon} />
                <Link to="/floorcheck/3" className={styles.navLink}>
                  층별 강의실 수치 확인
                </Link>
              </li>
              <li
                className={`${styles.navItem} ${i === "4" ? styles.bold : ""}`}
              >
                <img
                  src={require("../../../assets/images/compare.png")}
                  alt="compare"
                  className={styles.icon}
                />
                <Link to="/comparison" className={styles.navLink}>
                  강의실 수치비교
                </Link>
              </li>
              <li
                className={`${styles.navItem} ${i === "5" ? styles.bold : ""}`}
              >
                <FiCpu className={styles.icon} />
                <Link to="/contact" className={styles.navLink}>
                  관리자 페이지
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div
          className={styles.navItem}
          style={{
            justifyContent: "center",
            paddingRight: "clamp(20px, 2%, 32px)",
          }}
          onClick={() => setIsPopupVisible(true)} // 팝업 띄우기
        >
          <FiLogOut className={styles.logoutIcon} />
          <div className={styles.navLink} style={{ padding: "5px" }}>
            로그아웃
          </div>
        </div>
      </aside>
      <hr className={styles.separator} />

      {/* 팝업 컴포넌트 */}
      {isPopupVisible && (
        <Popup
          popupContent="정말 로그아웃 하시겠습니까?"
          registerLink='/'
          onClose={handleClosePopup}
          buttonText="로그아웃"
          doit={logout}
        />
      )}
    </div>
  );
};

export default SideBar;
