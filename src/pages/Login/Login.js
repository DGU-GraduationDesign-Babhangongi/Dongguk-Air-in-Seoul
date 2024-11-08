import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import Header from "../../components/common/Header/Header"; //

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = new URLSearchParams();
    loginData.append("username", id);
    loginData.append("password", password);

    const queryParams = new URLSearchParams({
      username: id,
      password: password,
    }).toString();

    console.log(queryParams);

    try {
      console.log(`/api/login?${queryParams}`);
      const response = await fetch(`/api/login?${queryParams}`, {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token; // 서버에서 받은 토큰
        localStorage.setItem("authToken", token); // 토큰을 localStorage에 저장
        alert("로그인 성공");
        navigate("/"); // 메인 페이지로 이동
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
              <label htmlFor="id">Id</label>
              <input
                type="id"
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
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
