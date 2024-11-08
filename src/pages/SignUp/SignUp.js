// src/pages/SignUp/SignUp.js
import React, { useState } from "react";
import styles from "./SignUp.module.css"; // 스타일 적용
import Header from "../../components/common/Header/Header";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [alarmStatus, setAlarmStatus] = useState(false); // 알림 상태 추가
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    //const token = localStorage.getItem("authToken"); // localStorage에서 토큰 가져오기
    const requestData = {
      username: username,
      password: password,
      email: email,
      phoneNumber: id, // API에 phoneNumber로 매핑
      areaOfResponsibility: responsibility,
      securityCode: securityCode,
      alarmStatus: alarmStatus,
    };
    const queryParams = new URLSearchParams(requestData).toString();

    try {
      const response = await fetch(`/api/join?${queryParams}`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          //"Content-Type": "application/json", // JSON 형식으로 데이터 전송
          //Authorization: `Bearer ${token}`, // 필요할 경우 추가
        },
      });

      if (response.ok) {
        // 성공 시
        const data = await response.text();
        console.log(data);
        alert("회원가입 완료!");
        navigate("/login");
      } else {
        // 오류 처리
        const errorData = await response.text();
        alert(`회원가입 실패: ${errorData.message || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  }

  return (
    <div>
      <Header />
      <div className={styles.signupContainer}>
        <form onSubmit={handleSubmit} className={styles.signupContent}>
          <h2 className={styles.heading}>Let's Create an Account</h2>
          <p className={styles.signupText}>아래 정보를 모두 입력해주세요. </p>
          <input
            type="text"
            placeholder="이름 Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="사용할 아이디 Id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}></div> */}
          <div
            style={{
              position: "relative",
              width: "100%",
              marginBottom: "10px",
            }}
          >
            <input
              type="email"
              placeholder="이메일 Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="button" className={styles.smallButton}>
              코드 받기
            </button>
          </div>
          <div
            style={{
              position: "relative",
              width: "100%",
              marginBottom: "10px",
            }}
          >
            <input
              type="text"
              placeholder="Security code"
              value={securityCode}
              onChange={(e) => setSecurityCode(e.target.value)}
            />
            <button type="button" className={styles.smallButton}>
              코드 인증
            </button>
          </div>

          <input
            type="text"
            placeholder="관할구역 Area of Responsibility"
            value={responsibility}
            onChange={(e) => setResponsibility(e.target.value)}
          />

          <div className={styles.extraOptions}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              <input
                type="checkbox"
                id="rememberMe"
                checked={alarmStatus}
                onChange={(e) => setAlarmStatus(e.target.checked)}
              />
              <label
                htmlFor="rememberMe"
                style={{ marginLeft: "8px", marginBottom: "16px" }}
              >
                위의 이메일로 알림 받기
              </label>
            </div>
          </div>

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
