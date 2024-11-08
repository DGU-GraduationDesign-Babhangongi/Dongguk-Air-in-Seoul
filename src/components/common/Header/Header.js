import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const GoToRoot = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <div className={styles.all}> {/* 전체 높이 설정 */}
      <header className={styles.header}>
        <img
          src={require("../../../assets/images/logo.png")}
          alt="logo"
          className={styles.logo}
          style={{ cursor: "pointer" }}
          onClick={GoToRoot}
        />
        <nav className={styles.nav}>
          <Link to="/Alarm" className={styles.navLink}>
            <img
              src={require("../../../assets/images/alarm.png")}
              alt="alarm"
              className={styles.icon}
            />
            <div className={styles.font}>알림</div>
          </Link>
          <Link to="/Log" className={styles.navLink}>
            <img
              src={require("../../../assets/images/list.png")}
              alt="/log"
              className={styles.icon}
            />
            <div className={styles.font}>강의실 목록</div>
          </Link>
          <Link to="/login" className={styles.navLink}>
            <img
              src={require("../../../assets/images/user.png")}
              alt="user"
              className={styles.icon}
            />
            <div className={styles.font}>로그인</div>
          </Link>
        </nav>
      </header>
      <hr className={styles.separator} />
    </div>
  );
};

export default Header;
