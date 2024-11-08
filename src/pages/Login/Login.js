import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import Header from "../../components/common/Header/Header"; //

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams({
      username: username,
      password: password,
    }).toString();

    console.log(queryParams);

    try {
      console.log(`/api/login?${queryParams}`);
      const response = await fetch(`/api/login?${queryParams}`, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // const token = await response.text(); // 응답을 텍스트로 받아 바로 사용
        const data = await response.text();
        const token = data.token;
        const nickname = data.nickname;
        localStorage.setItem("authToken", token);
        localStorage.setItem("nickname", nickname);
        alert("로그인 성공! 관리자님 환영합니다.");
        navigate("/");
      } else {
        alert("로그인 실패. 다시 시도하세요.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("로그인 중 오류가 발생했습니다.");
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
              <label htmlFor="username">Username</label>
              <input
                type="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
