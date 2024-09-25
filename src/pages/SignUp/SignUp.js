// src/pages/SignUp/SignUp.js
import React, { useState } from "react";
import "./SignUp.css"; // 스타일 적용
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
    <div className="signup-container">
      <Header />
      <h2>Create an account</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          placeholder="Enter Your Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter Your Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter your area of responsibility"
          value={responsibility}
          onChange={(e) => setResponsibility(e.target.value)}
        />
        <input
          type="text"
          placeholder="Security code"
          value={securityCode}
          onChange={(e) => setSecurityCode(e.target.value)}
        />
        <button type="submit" className="signup-button">
          회원가입
        </button>
      </form>
      <p className="login-link">
        이미 계정이 있으신가요? <a href="/login">로그인 하러 가기</a>
      </p>
    </div>
  );
};

export default SignUp;
