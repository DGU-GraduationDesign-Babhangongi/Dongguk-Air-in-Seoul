// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.css"; // 스타일은 필요에 따라 추가
import Login_Header from "../../components/common/Header/Login_Header";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    //id=user, pw=password
    if (username === "user" && password === "password") {
      alert("로그인 성공");
      navigate("/"); //성공시 main으로 navigate
    } else {
      alert("로그인 실패. 다시 시도하세요.");
    }
  };
  //SignUp으로 이동하기
  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <div className={styles.loginContainer}>
      <Login_Header />
      <h2>로그인</h2>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <label htmlFor="username">사용자 이름:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.loginButton}>
          로그인
        </button>
      </form>
      {/* 회원가입 버튼 추가 */}
      <p className={styles.signupText}>
        아직 계정이 없으신가요?{" "}
        <button onClick={handleSignUpClick} className={styles.signupButton}>
          회원가입
        </button>
      </p>
    </div>
  );
};

export default Login;
