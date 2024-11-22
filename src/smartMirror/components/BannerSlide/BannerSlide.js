import React, { useState, useEffect } from 'react';
import styles from './BannerSlide.module.css';

// 배열을 랜덤하게 섞는 함수
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 두 요소를 바꿔주기
  }
  return shuffled;
};

const BannerSlide = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  const Datas = [
    {
      id: 1,
      name: '중앙동아리 CAPS',
      image: 'Caps.png',
      content:
        'CAPS는 프로그래밍에 관심이 있는 사람들이 모여 학술 활동과 친목 행사를 진행합니다!\n 전공, 지식 상관 없이 관심만 있으면 환영입니다 :)',
    },
    {
      id: 2,
      name: '대학연합동아리 쌍투스코러스',
      image: 'TwinChorus.jpg',
      content:
        "우리들은 노래로 사랑을 심어요!\n 쌍투스코러스는 노래와 사람을 사랑하는 사람들이 모인 \"대학 연합 합창 뮤지컬 동아리\"입니다.",
    },    
    {
      id: 3,
      name: '중앙동아리 동굴탐험연구회',
      image: 'Caving.jpg',
      content:
        "인생에서 쉽게 경험하기 힘든 동굴탐험, 암벽등반, 스쿠버다이빙, 스키캠프, 해외여행 등 다양한 활동을 해보고 싶다면 동굴탐험연구회로 오세요!",
    },
    {
      id: 4,
      name: 'AI융합대학 소모임 한소리',
      image: 'hansori.jpg',
      content:

        "한소리는 AI융합대학 풍물놀이 동아리입니다.\n 매년 여러 공연과 한소리 정기공연을 진행하고 있으며 풍물에 관심이 있으신 분들은 누구나 가입 가능합니다.",

    },
    {
      id: 5,
      name: '동아리 홍보 신청하기',
      image: 'qr.png',
      content:
        "동아리 및 다양한 홍보를 원하시면, 아래 QR 코드를 이용해 구글폼을 작성해 주세요!\n 작성해 주신 내용은 해당 위치에 게시됩니다.",
    },
  ];

  useEffect(() => {
    // Datas 배열을 랜덤으로 섞어서 setSlides로 설정
    setSlides(shuffleArray(Datas));
  }, []);

  // 5초마다 자동 슬라이드 전환
  useEffect(() => {
    const interval = setInterval(() => {
      if (slides.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  // 터치 시작 지점 기록
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  // 터치 종료 지점과 비교하여 슬라이드 전환
  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 75) {
      // 오른쪽으로 밀었을 때 (다음 슬라이드)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    } else if (touchStart - touchEnd < -75) {
      // 왼쪽으로 밀었을 때 (이전 슬라이드)
      setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    }
  };

  // 텍스트 내 \n을 <br />로 변환하는 함수 (content가 undefined일 경우 빈 문자열로 처리)
  const formatContent = (content) => {
    if (!content) return null; // content가 없으면 null 반환

    return content.split('\n').map((str, index) => (
      <React.Fragment key={index}>
        {str}
        <br />
      </React.Fragment>
    ));
  };

  // 이미지 경로 처리 함수 (정확한 이미지 경로 반환)
  const getImage = (imageName) => {
    try {
      if (imageName) {
        return require(`../../../assets/images/smartmirror/Promotion/${imageName}`);
      } else {
        return null; // 이미지가 없으면 null 반환
      }
    } catch (error) {
      console.error('이미지 로딩 실패:', error);
      return null; // 오류 발생 시 null 반환
    }
  };

  return (
    <div
      className={styles.whiteBox}
      style={{ fontSize: '3vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div style={{ width: '100%' }}>
        <h2 style={{ fontSize: '3.5vw' }}>{slides[currentIndex]?.name}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.2fr 5fr' }}>
          <img
            src={getImage(slides[currentIndex]?.image)} // 이미지 경로 처리 함수 사용
            alt={slides[currentIndex]?.name}
            style={{ width: '100%' }}
          />
          <br />
          <p style={{ display: 'flex', alignItems: 'center', fontSize: '2.6vw', textAlign: 'left', margin: 'auto' }}>
            {formatContent(slides[currentIndex]?.content)} {/* 텍스트 포맷팅 */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BannerSlide;
