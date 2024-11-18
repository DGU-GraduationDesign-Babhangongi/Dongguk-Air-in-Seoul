import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import Header from "../../components/common/Header/Header"; //
import API from "../../API/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Login.js
  const handleLogin = async (event) => {
    event.preventDefault();

    const loginData = {
      username: username,
      password: password,
    };

    try {
      const response = await API.post("/api/login", loginData, {
        withCredentials: true,
      });
      console.log("Login Response:", response);

      if (response.status === 200) {
        // JWT 토큰을 로컬 스토리지에 저장
        const token = response.headers.get("authorization").split(" ")[1];
        localStorage.setItem("token", token);
        console.log("Received Token:", token);

        // 메인 페이지로 이동
        navigate("/");
      } else {
        console.error("로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const queryParams = new URLSearchParams({
  //     username,
  //     password,
  //   });

  //   try {
  //     console.log(`Sending request with query: ${queryParams}`);
  //     const response = await fetch(`/api/login`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(queryParams),
  //     });

  //     console.log("Response status: ", response.status);

  //     const textResponse = await response.text();
  //     console.log("Raw response text:", textResponse);

  //     let data;
  //     try {
  //       data = JSON.parse(textResponse);
  //     } catch (parsingError) {
  //       console.error("JSON 파싱 오류. 예상치 못한 응답 형식:", textResponse);
  //       throw new Error("Unexpected response format: Expected JSON");
  //     }

  //     const { token, nickname } = data || {};

  //     if (token && nickname) {
  //       console.log("Token:", token);
  //       console.log("Nickname:", nickname);

  //       localStorage.setItem("authToken", token);
  //       localStorage.setItem("nickname", nickname);
  //       alert(`${nickname}님, 환영합니다!`);
  //       navigate("/");
  //     } else {
  //       console.error("Missing token or nickname in response.");
  //       alert("로그인 실패. 서버에서 유효한 데이터를 받지 못했습니다.");
  //     }
  //     // } else {
  //     //   const errorData = await response.text();
  //     //   console.error("Login failed with response:", errorData);
  //     //   alert("로그인 실패. 다시 시도하세요.");
  //     // }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("로그인 중 오류가 발생했습니다.");
  //   }
  // };
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

          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
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
