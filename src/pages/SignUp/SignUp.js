import React, { useState } from "react";
import styles from "./SignUp.module.css"; // 스타일 적용
import Header from "../../components/common/Header/Header";
import { useNavigate } from "react-router-dom";
import API from "../../API/api";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [alarmStatus, setAlarmStatus] = useState(false); // 알림 상태 추가
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false); // 이메일 전송 상태 추가
  const navigate = useNavigate();

  const sendEmail = async (email) => {
    if (loading) return;

    const endpoint = `/api/sendSecurityCode?email=${encodeURIComponent(email)}`;
    try {
      setLoading(true);
      const response = await API.post(endpoint, null, {
        headers: {
          Accept: "*/*",
        },
      });
      console.log("API 요청 성공:", response);

      // 성공적으로 이메일이 전송되면 상태 변경
      setEmailSent(true);
      alert("인증 코드가 이메일로 전송되었습니다.");
    } catch (e) {
      console.error("API 오류: ", e);
      alert("코드 전송 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    const endpoint = "/api/join";
    try {
      const requestData = {
        username,
        password,
        nickname,
        email,
        areaOfResponsibility: responsibility,
        securityCode,
        alarmStatus,
      };

      const response = await API.post(
        endpoint,
        JSON.stringify(requestData),
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );

      console.log("회원가입 Response:", response);
      console.log("endpoint:", endpoint);

      if (response.status === 200) {
        alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
        navigate("/login");
      } else {
        const errorText = await response.text();
        const errorData = errorText
          ? JSON.parse(errorText)
          : { message: "알 수 없는 오류" };
        alert(`회원가입 실패: ${errorData.message}`);
      }
    } catch (error) {
      console.error("회원가입 처리 중 오류:", error);

      // 서버에서 반환한 오류 코드에 따라 메시지 분기 처리
      if (error.response && error.response.status === 400) {
        alert("인증 코드가 유효하지 않습니다.");
      } else {
        alert("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.signupContainer}>
        <form onSubmit={handleSignUp} className={styles.signupContent}>
          <h2 className={styles.heading}>Let's Create an Account</h2>
          <p className={styles.signupText}>아래 정보를 모두 입력해주세요. </p>
          <input
            type="text"
            placeholder="아이디  Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              position: "relative",
              width: "100%",
            }}
          />

          <input
            type="password"
            placeholder="비밀번호  Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              position: "relative",
              width: "100%",
            }}
          />
          <input
            type="text"
            placeholder="사용자 이름  Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            style={{
              position: "relative",
              width: "100%",
            }}
          />
          <div
            style={{
              position: "relative",
              width: "100%",
            }}
          >
            <input
              type="email"
              placeholder="이메일  Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                position: "relative",
                width: "100%",
              }}
            />
            <button
              type="button"
              className={styles.smallButton}
              onClick={() => sendEmail(email)}
              disabled={loading}
            >
              {emailSent ? "재전송" : "코드 받기"}
            </button>
          </div>
          <div
            style={{
              position: "relative",
              width: "100%",
            }}
          >
            <input
              type="text"
              placeholder="보안 코드  Security code"
              value={securityCode}
              required
              onChange={(e) => setSecurityCode(e.target.value)}
              style={{
                position: "relative",
                width: "100%",
              }}
            />
          </div>

          <input
            type="text"
            placeholder="관할구역  Area of Responsibility"
            value={responsibility}
            onChange={(e) => setResponsibility(e.target.value)}
            style={{
              position: "relative",
              width: "100%",
            }}
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
