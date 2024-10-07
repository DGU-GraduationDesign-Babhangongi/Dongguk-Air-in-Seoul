// src/pages/SignUp/SignUp.js
import React, { useState } from "react";
import styles from "./SignUp.module.css"; // 스타일 적용
import Header from "../../components/common/Header/Header";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [securityCode, setSecurityCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 회원가입 처리 로직을 추가
    alert("회원가입 완료!");
  };

  return (
    <div>
      <Header />
      <div className={styles.signupContainer}>
        <form onSubmit={handleSubmit} className={styles.signupContent}>
          <h2 className={styles.heading}>Let's Create an Account</h2>
          <p
            className={styles.signupText}
            style={{
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              marginLeft: "20px",
              marginTop: "20px",
            }}
          >
            아래 정보를 모두 입력해주세요.{" "}
          </p>
          <input
            type="text"
            placeholder="이름 Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="이메일 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="휴대폰 번호 Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="관할구역 Area of Responsibility"
            value={responsibility}
            onChange={(e) => setResponsibility(e.target.value)}
          />
          <input
            type="text"
            placeholder="보안 코드 Security code"
            value={securityCode}
            onChange={(e) => setSecurityCode(e.target.value)}
          />
          <button type="submit" className={styles.signupButton}>
            회원가입
          </button>
        </form>
        <p className={styles.loginLink}>
          이미 계정이 있으신가요? <a href="/login">로그인 하러 가기</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
