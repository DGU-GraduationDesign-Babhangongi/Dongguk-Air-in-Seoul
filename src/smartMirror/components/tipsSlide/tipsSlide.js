import React, { useState, useEffect } from 'react';
import styles from './tipsSlide.module.css';

const TipsSlide = ({ contents }) => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  // 상태에 따른 메시지 생성
  const getStatusMessage = (status, type) => {
    const advice = getAdvice(type);
    switch (status) {
      case "Fair": return `현재 ${type} 상태가 좋지 않습니다. <br/> ${advice}`;
      case "Poor": return `현재 ${type} 상태가 나쁩니다. <br/> ${advice}`;
      case "Inadequate": return `현재 ${type} 상태가 심각합니다. <br/> ${advice}`;
      default: return null;
    }
  };

  // 상태가 나쁠 때의 대응책
  const getAdvice = (type) => {
    const adviceMap = {
      "소음": "소음을 줄이고 싶다면 조용한 공간으로 가거나 <br/>소음 차단 헤드폰을 사용하세요.",
      "습도": "가습기를 틀거나 창문을 열어 신선한 공기를 들이세요.",
      "TVOC": "실내 공기 청정기를 가동하거나 <br/>창문을 열어 환기를 시켜보세요.",
      "PM2.5": "실내 공기 청정기를 가동하거나 <br/>창문을 열어 환기 시켜보세요.",
      "온도": "에어컨이나 히터를 사용해 적정온도를 유지해 보세요."
    };
    return adviceMap[type] || '';
  };

  // contents가 변경되면 슬라이드 업데이트
  useEffect(() => {
    if (contents) {
      const newSlides = [];
      const statuses = [
        contents.temperatureStatus,
        contents.humidityStatus,
        contents.tvocStatus,
        contents.pm25Status,
        contents.ambientNoiseStatus,
      ];

      // 상태가 모두 Good 이상일 경우
      const allGood = statuses.every((status) => status === "Good" || status === "Excellent");
      if (allGood) {
        newSlides.push("현재 강의실의 공기질이 최상입니다! <br/>좋은 환경에서 즐겁게 공부하세요!");
      } else {
        const messages = [
          getStatusMessage(contents.ambientNoiseStatus, "소음"),
          getStatusMessage(contents.humidityStatus, "습도"),
          getStatusMessage(contents.tvocStatus, "TVOC"),
          getStatusMessage(contents.pm25Status, "PM2.5"),
          getStatusMessage(contents.temperatureStatus, "온도"),
        ];
        messages.forEach(message => { if (message) newSlides.push(message); });
      }
      setSlides(newSlides);
    } else {
      setSlides(["현재 상태 정보가 없습니다."]);
    }
  }, [contents]);

  // 5초마다 슬라이드 전환
  useEffect(() => {
    const interval = setInterval(() => {
      if (slides.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // 터치 시작 지점 기록
  const handleTouchStart = (e) => { setTouchStart(e.targetTouches[0].clientX); };

  // 터치 종료 지점에 따른 슬라이드 전환
  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 75) setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    else if (touchStart - touchEnd < -75) setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  return (
    <div className={styles.slideContainer} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {slides.length > 0 ? (
        <div className={styles.slideContent} dangerouslySetInnerHTML={{ __html: slides[currentIndex] }} />
      ) : (
        <div className={styles.slideContent}>추후 추가될 예정입니다.</div>
      )}
    </div>
  );
};

export default TipsSlide;
