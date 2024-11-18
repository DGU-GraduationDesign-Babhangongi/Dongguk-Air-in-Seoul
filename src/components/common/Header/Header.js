import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import API from "../../../API/api";

const Header = ({ i }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token")); // token 상태 관리
  const [nickname, setNickname] = useState("");
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    // localStorage 변경 감지
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const GoToRoot = () => {
    navigate("/");
    window.location.reload();
  };
  useEffect(() => {
    const fetchNickname = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await API.get("/api/user/nickname", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            const nicknameData = response.data;
            setNickname(nicknameData);
          } else {
            console.error("닉네임을 불러오는데 실패했습니다.");
          }
        } catch (error) {
          console.error("오류 발생:", error);
        }
      }
    };
    fetchNickname(); // 페이지 로드 시 nickname 호출
  }, []);
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

        {!token ? (
          <div className={styles.noTokenMessage}>
            <Link to="/login" className={styles.navLink}>
              <img
                src={require("../../../assets/images/Header/person.png")}
                alt="user"
                className={styles.icon}
              />
              <div className={styles.font}
              style={{ fontWeight: i === "0" ? "bold" : "normal" }}>로그인</div>
            </Link>
          </div>
        ) : (
          <nav className={styles.nav}>
            <Link to="/alarm" className={styles.navLink}>
              <img
                src={require("../../../assets/images/Header/alarm.png")}
                alt="alarm"
                className={styles.icon}
              />
              <div
                className={styles.font}
                style={{ fontWeight: i === "1" ? "bold" : "normal" }}
              >
                이상 수치값 조회
              </div>
            </Link>
            <Link to="/log" className={styles.navLink}>
              <img
                src={require("../../../assets/images/Header/log.png")}
                alt="/log"
                className={styles.icon}
              />
              <div
                className={styles.font}
                style={{ fontWeight: i === "2" ? "bold" : "normal" }}
              >
                강의실 로그
              </div>
            </Link>
            <Link to="/manager" className={styles.navLink}>
              <img
                src={require("../../../assets/images/Header/person.png")}
                alt="user"
                className={styles.icon}
              />
              <div
                className={styles.font}
                style={{ fontWeight: i === "3" ? "bold" : "normal" }}
              >
                {nickname} 관리자
              </div>
            </Link>
          </nav>
        )}
      </header>
      <hr className={styles.separator} />
    </div>
  );
};

export default Header;
