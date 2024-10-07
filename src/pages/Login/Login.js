import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css"; // CSS 파일을 Import
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
          <p className={styles.signupText}>
            Don’t have an account?{" "}
            <button onClick={handleSignUpClick} className={styles.signUpButton}>
              Sign up
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
              <div>
                <input type="checkbox" id="rememberMe" />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <a href="/forgot-password" className={styles.forgotPassword}>
                Forget your password?
              </a>
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
