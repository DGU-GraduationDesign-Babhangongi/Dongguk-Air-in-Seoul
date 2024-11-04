import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import styles from "./SideBar.module.css";
import { FiGrid, FiLayers, FiCpu, FiLogOut } from "react-icons/fi";
import { SensorDataContext } from '../../../API/SensorDataContext';

var buildingName = "신공학관";

const SideBar = ({ i }) => {
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
                <Link to="/floorcheck" className={styles.navLink}>
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
              <li className={styles.navItem}>
                <FiCpu className={styles.icon} />
                <Link to="/contact" className={styles.navLink}>
                  관리실 페이지
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className={styles.navItem} style={{ justifyContent: "center" }}>
          <FiLogOut className={styles.logoutIcon} />
          <div className={styles.navLink}> 로그아웃</div>
        </div>
      </aside>
      <hr className={styles.separator} />
    </div>
  );
};

export default SideBar;
