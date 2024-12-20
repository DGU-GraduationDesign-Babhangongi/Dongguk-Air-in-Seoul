import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header1.module.css";

const Header1 = () => {
  const navigate = useNavigate();

  // 홈페이지로 이동
  const GoToRoot = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <div className={styles.all}>
      <header className={styles.header}>
        <img
          src={require("../../../assets/images/Mainlogo.png")}
          alt="logo"
          className={styles.logo}
          style={{ cursor: "pointer" }}
          onClick={GoToRoot}
        />
      </header>
      <hr className={styles.separator} />
    </div>
  );
};

export default Header1;
