import React, { useState, useEffect } from "react";
import './main.css';
import logo from '../../assets/images/smartmirror/logo.png';
import map from '../../assets/images/smartmirror/map.png';
import locationIcon from '../../assets/images/smartmirror/location.png';
import helpIcon from '../../assets/images/smartmirror/help.png';
import dateIcon from '../../assets/images/smartmirror/date.png';
import checkIcon from '../../assets/images/smartmirror/check.png';
import touchIcon from '../../assets/images/smartmirror/touch.png';

const Main = () => {
  const [currentTime, setCurrentTime] = useState('');

  // 현재 시간을 가져와 포맷하는 함수
  const updateTime = () => {
    const now = new Date();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = days[now.getDay()];
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const date = String(now.getDate()).padStart(2, '0');
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // 12시간제로 변환
    const formattedTime = `${year}년 ${month}월 ${date}일 ${dayName} ${ampm} ${formattedHours}:${minutes}`;
    
    setCurrentTime(formattedTime);
  };

  useEffect(() => {
    // 페이지 로드 시 시간을 업데이트
    updateTime();
    // 매 1분마다 시간을 업데이트
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 제거
  }, []);

  return (
    <div className="container">
      <header>
        <div className="header-content">
          <div className="date">
            <img src={dateIcon} alt="Date Icon" />
            <span>{currentTime}</span> {/* 실시간 시간 표시 */}
          </div>
          <div className="logo">
            <img src={logo} alt="Clean Air Logo" />
          </div>
          <div className="check">
            <span>외모 check</span>
            <img src={checkIcon} alt="Check Icon" />
          </div>
        </div>
      </header>
      
      <div className="main-content">
        <div className="weather">
          <h2>32°C</h2>
          <p>흐리고 비</p>
          <p>34°C/24°C</p>
          <p>오늘은 하루종일 비소식이 있으니 실내 습도 조절에 유의하세요</p>
        </div>
        <div className="external-info"></div>
      </div>

      <section className="building-info">
        <div className="location">
          <img src={locationIcon} alt="Location Icon" />
          <span>신공학관</span>
        </div>
        <p>원하는 층을 선택하여 현재 공기질 상태를 확인하세요</p>

        <div className="floor-buttons">
          <div className="floor active">
            <span>3th floor</span>
            <button>3115</button>
            <button>3173 ✨</button>
          </div>
          <div className="floor">
            <span>4th floor</span>
            <button>4142</button>
          </div>
          <div className="floor selected">
            <span>5th floor</span>
            <button>5145</button>
            <button>5147</button>
          </div>
          <div className="floor">
            <span>6th floor</span>
            <button>6119</button>
            <button>6144</button>
          </div>
        </div>
      </section>

      <div className="floor-plan">
        <h4>5th floor</h4>
        <img src={map} alt="5th floor map" />
      </div>
    </div>
  );
};

export default Main;
