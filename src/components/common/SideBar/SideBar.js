import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Popup from "../../../components/common/Popup/Popup";
import { FiGrid, FiLayers, FiCpu, FiLogOut } from "react-icons/fi";
import styles from "./SideBar.module.css";

// 상수 정의
const buildingName = "신공학관";
const navItems = [
  { id: "1", icon: <FiGrid />, label: "메인화면", to: "/" },
  { id: "2", icon: <img src={require("../../../assets/images/graph.png")} alt="graph" />, label: "강의실 수치 확인", to: "/figures" },
  { id: "3", icon: <FiLayers />, label: "층별 강의실 수치 확인", to: "/floorcheck/3" },
  { id: "4", icon: <img src={require("../../../assets/images/compare.png")} alt="compare" />, label: "강의실 수치비교", to: "/comparison" },
  { id: "5", icon: <FiCpu />, label: "관리자 페이지", to: "/contact" },
];

const SideBar = ({ i }) => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/"); // 메인 페이지로 이동
    console.log("User logged out");
  };

  // 팝업 닫기 함수
  const handleClosePopup = () => setIsPopupVisible(false);

  return (
    <div className={styles.sidebarContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.topMenu}>
          <div className={styles.currentBuildingLabel}>현재 건물</div>
          <div className={styles.title}>
            <img src={require("../../../assets/images/building.png")} alt="building" className={styles.titleImg} />
            {buildingName}
          </div>
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              {navItems.map(({ id, icon, label, to }) => (
                <li key={id} className={`${styles.navItem} ${i === id ? styles.bold : ""}`}>
                  <div className={styles.icon}>{icon}</div>
                  <Link to={to} className={styles.navLink}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          className={`${styles.navItem} ${styles.logoutContainer}`}
          onClick={() => setIsPopupVisible(true)} // 팝업 띄우기
        >
          <FiLogOut className={styles.logoutIcon} />
          <div className={styles.navLink}>로그아웃</div>
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
