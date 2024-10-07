import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import Header from "../../components/common/Header/Header"; //

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "user@example.com" && password === "password") {
      alert("로그인 성공");
      navigate("/"); // 메인 페이지로 이동
    } else {
      alert("로그인 실패. 다시 시도하세요.");
    }
  };

  // 회원가입 페이지로 이동
  const handleSignUpClick = () => {
    navigate("/signup");
  };

  return (
    <div>
      <Header />
      <div className={styles.loginContainer}>
        <div className={styles.loginContent}>
          <h2 className={styles.heading}>Get’s started.</h2>
          <p
            className={styles.signupText}
            style={{
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              marginLeft: "20px",
            }}
          >
            계정이 없으신가요?{" "}
            <button
              onClick={handleSignUpClick}
              className={styles.signUpButton}
              style={{ marginLeft: "20px" }}
            >
              회원가입 하기
            </button>
          </p>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.inputField}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.inputField}
              />
            </div>

            <div className={styles.extraOptions}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                }}
              >
                <input type="checkbox" id="rememberMe" />
                <label
                  htmlFor="rememberMe"
                  style={{ marginLeft: "8px", marginBottom: "16px" }}
                >
                  아이디 기억하기
                </label>

                <a
                  href="/forgot-password"
                  className={styles.forgotPassword}
                  style={{ marginLeft: "180px", marginBottom: "16px" }}
                >
                  비밀번호를 잊었나요?
                </a>
              </div>
            </div>

            <button type="submit" className={styles.loginButton}>
              로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
