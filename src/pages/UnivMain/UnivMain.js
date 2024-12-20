import React, { useState, useEffect, useRef } from "react";
import Header1 from "../../components/common/Header1/Header1";
import styles from "./UnivMain.module.css";

function Main() {
  const [showPopup, setShowPopup] = useState(false); // 팝업 상태 관리
  const [schools, setSchools] = useState([]); // 학교 데이터 상태 관리
  const [formData, setFormData] = useState({
    name: "",
    englishName: "",
    address: "",
    adminEmail: "",
    themeColor: "",
    logo: null,
  }); // 폼 데이터 상태
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // API를 호출하여 학교 데이터를 가져오는 함수
    const fetchSchools = async () => {
      try {
        const response = await fetch("/api/schools");
        if (response.ok) {
          const data = await response.json();
          setSchools(data); // 가져온 데이터를 상태에 저장
        } else {
          console.error("Failed to fetch schools");
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };

    fetchSchools();
  }, []); // 컴포넌트가 마운트될 때 한 번 실행

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({
      left: -240,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({
      left: 240,
      behavior: "smooth",
    });
  };

  const openPopup = () => {
    setShowPopup(true); // 팝업 열기
  };

  const closePopup = () => {
    setShowPopup(false); // 팝업 닫기
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      logo: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch("/api/schools", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        // 성공적으로 등록된 경우, 학교 목록을 갱신
        const newSchool = await response.json();
        setSchools((prevSchools) => [...prevSchools, newSchool]);
        closePopup(); // 팝업 닫기
      } else {
        console.error("Failed to register school");
      }
    } catch (error) {
      console.error("Error registering school:", error);
    }
  };

  return (
    <div>
      <Header1 />
      <div className={styles.mainContainer}>
        <div className={styles.welcomeMessage}>
          <h2>관리자님 환영합니다!</h2>
          <p>공기질을 확인할 대학교를 선택해주세요.</p>
        </div>
        <div className={styles.scrollContainer}>
          <button className={styles.scrollButton} onClick={scrollLeft}>
            &lt;
          </button>
          <div className={styles.buildingsWrapper} ref={scrollContainerRef}>
            <div className={styles.buildings}>
              {schools.map((school) => (
                <div className={styles.building} key={school.id}>
                  <img src={school.logoUrl} alt={school.name} />
                  <h2>{school.name}</h2>
                </div>
              ))}
            </div>
          </div>
          <button className={styles.scrollButton} onClick={scrollRight}>
            &gt;
          </button>
        </div>
        <div className={styles.registerMessage}>
          새로운 대학교를 등록하고 싶으신가요?{" "}
          <button className={styles.registerButton} onClick={openPopup}>
            등록하기
          </button>
        </div>
      </div>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h3 className={styles.popupTitle}>대학교 등록</h3>
            <form className={styles.popupForm} onSubmit={handleSubmit}>
              <label>학교 이름:</label>
              <input
                type="text"
                name="name"
                placeholder="예: 동국대학교"
                value={formData.name}
                onChange={handleInputChange}
              />
              <label>영어 이름:</label>
              <input
                type="text"
                name="englishName"
                placeholder="예: Dongguk University"
                value={formData.englishName}
                onChange={handleInputChange}
              />
              <label>로고:</label>
              <input type="file" name="logo" onChange={handleFileChange} />
              <label>주소:</label>
              <input
                type="text"
                name="address"
                placeholder="예: 서울특별시 중구 필동로 1길"
                value={formData.address}
                onChange={handleInputChange}
              />
              <label>최초 관리자 메일:</label>
              <input
                type="email"
                name="adminEmail"
                placeholder="예: admin@example.com"
                value={formData.adminEmail}
                onChange={handleInputChange}
              />
              <label htmlFor="themeColor">상징 색:</label>
              <input
                type="text"
                name="themeColor"
                placeholder="#000000"
                value={formData.themeColor}
                onChange={handleInputChange}
              />
              <div className={styles.popupActions}>
                <button
                  type="button"
                  className={`${styles.popupButton} cancel`}
                  onClick={closePopup}
                >
                  취소
                </button>
                <button type="submit" className={`${styles.popupButton} submit`}>
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
