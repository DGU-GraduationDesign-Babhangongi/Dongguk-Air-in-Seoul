import React from 'react';
import './main.css';  // CSS 파일을 사용하여 스타일 적용

function App() {
  return (
    <div className="container">
      <header className="header">
        <div className="temp">
          <h1>32°C</h1>
          <p>흐리고 비</p>
          <p>34°C/24°C 체감온도 32°C</p>
          <p>오늘은 하루종일 비소식이 있으니 실내 습도 조절에 유의하세요</p>
        </div>
        <div className="date-time">
          <p>2024년 7월 25일 목</p>
          <p>PM 23:02</p>
        </div>
        <div>
        🌧️
        </div>
      </header>
      <div className="floor-selector">
        <h2>신공학관</h2>
        <p>원하는 층을 선택하여 현재 공기질 상태를 확인하세요</p>
      </div>
      <div className="floors">
        <Floor level="3th floor" rooms={['3115', '3173']} quality="Good" />
        <Floor level="4th floor" rooms={['4142']} quality="Bad" />
        <Floor level="5th floor" rooms={['5145', '5147']} quality="Bad" />
        <Floor level="6th floor" rooms={['6144', '6119']} quality="Good" />
      </div>
    </div>
  );
}

function Floor({ level, rooms, quality }) {
  return (
    <div className={`floor ${quality.toLowerCase()}`}>
      <div className="floor-info">
        <span>{level}</span>
        <div className="rooms">
          {rooms.map((room, index) => (
            <button key={index}>{room}</button>
          ))}
        </div>
      </div>
      <div className={`quality-icon ${quality.toLowerCase()}`}>
         <span>{quality === 'Good' ? '😊' : '😢'}</span>
      </div>

    </div>
  );
}

export default App;
