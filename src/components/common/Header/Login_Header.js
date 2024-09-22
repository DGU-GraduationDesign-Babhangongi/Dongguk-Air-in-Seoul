import React from "react";
import { Link } from "react-router-dom";
import styles from "./Login_Header.css";

const Login_Header = () => {
  return (
    <div>
      <header className={styles.header}>
        <img
          src={require("../../../assets/images/logo.png")}
          alt="logo"
          className={styles.logo}
        />
        <nav className={styles.nav}>
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

export default Login_Header;
