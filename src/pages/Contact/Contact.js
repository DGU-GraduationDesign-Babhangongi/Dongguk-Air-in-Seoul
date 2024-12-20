import React, { useState } from 'react';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import styles from '../../assets/styles/Contact.module.css';
import { FiCpu } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import AddNewBuilding from './components/contentBoxComponents/addNewBuilding';
import RegisterRoom from './components/contentBoxComponents/registerRoom';
import RemoveRoomComponent from './components/contentBoxComponents/removeRoomComponent';
import AddEmail from './components/contentBoxComponents/addEmail';
function Contact() {
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0); // 현재 슬라이드 그룹 인덱스
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const totalItems = [
    <AddNewBuilding />,
    <RegisterRoom buildingOptions={buildingOptions} loading={loading} token={token} />,
    <RemoveRoomComponent buildingOptions={buildingOptions} token={token} />,
    <AddEmail />,
   //<RemoveRoomComponent buildingOptions={buildingOptions} token={token} />
  ];

  const slideCount = 3; // 한 번에 3개씩 보여줄 항목 수

  const goToNextSlide = () => {
    if (currentSlide + slideCount < totalItems.length) {
      setCurrentSlide(prev => prev + 1); // 다음 슬라이드 그룹으로 이동
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1); // 이전 슬라이드 그룹으로 이동
    }
  };

  // 한 번에 3개씩 슬라이드 항목을 보여줌
  const currentItems = totalItems.slice(currentSlide, currentSlide + slideCount);

  return (
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        <SideBar i='5' />
        <div className={styles.container}>
          <div className={styles.banner}>
            <FiCpu size={36} color="#333" />
            <h1>관리자 페이지</h1>
          </div>

          <div className={styles.registerSection}>
            <div className={styles.sliderContainer}>
              {currentItems.map((item, index) => (
                <div className={styles.ContentBox} key={index}>
                  {item}
                </div>
              ))}
            </div>

          
          </div>
          <div style={{ display: 'flex', justifyContent:'center'}}>

          <div className={styles.navigation}>
              <button onClick={goToPrevSlide} disabled={currentSlide === 0}>
                <span>&lt;</span>
              </button>
              <button onClick={goToNextSlide} disabled={currentSlide + slideCount >= totalItems.length}>
                <span>&gt;</span>
              </button>
            </div>
            </div>
        </div>
      </div> 
    </div>
  );
}

export default Contact;
