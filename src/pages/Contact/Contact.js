import React, { useState } from 'react';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import styles from '../../assets/styles/Contact.module.css';
import Dropbutton from '../../components/common/Dropbutton/Dropbutton';
import { FiCpu } from "react-icons/fi";

function Contact() {
  const [buildingName, setBuildingName] = useState('');
  const [maxFloors, setMaxFloors] = useState('');
  const [drawings, setDrawings] = useState({});
  const [selectedRoom, setSelectedRoom] = useState('');
  const [serialNum, setSerialNum] = useState('');
  const [removeBuilding, setRemoveBuilding] = useState('');
  const [removeRoom, setRemoveRoom] = useState('');
  const [removeReason, setRemoveReason] = useState('');

  const handleRegisterBuilding = () => {
    console.log('Building Registered:', buildingName, maxFloors, drawings);
  };

  const handleRegisterRoom = () => {
    console.log('Room Registered:', selectedRoom, serialNum);
  };

  const handleRemoveRoom = () => {
    console.log('Room Removed:', removeBuilding, removeRoom, removeReason);
  };

  const handleDrawingChange = (floor, file) => {
    setDrawings((prevDrawings) => ({
      ...prevDrawings,
      [floor]: file,
    }));
  };

  const handleMaxFloorsChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && Number(value) > 0) {
      setMaxFloors(value);
    } else {
      setMaxFloors('');
    }
  };

  return (
    <div>
      <Header /> {/* 헤더 */}
      <div style={{ display: 'flex' }}>
        <SideBar /> {/* 사이드바 */}
        <div className={styles.container}>
          
          {/* 노란 배너와 아이콘 */}
          <div className={styles.banner}>
            <FiCpu size={49} color="#333" />
            <h1>관리자 페이지</h1>
          </div>
          <div className={styles.registerSection}>
            
            {/* 새 건물 등록 */}
            <div className={styles.registerBuilding}>
              <div className={styles.title}>
              <img src="/Main/building.png" className={styles.bannerIcon} alt="Building" />
              <h2>새 건물 등록</h2></div>
              <p>최대 7일의 시간이 소요될 수 있습니다.</p>
              <label>Building Name</label>
              <input
                type="text"
                placeholder="ex) 신공학관"
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
              />
              
              <label>Max Floors</label>
              <input
                type="text"
                placeholder="숫자만 입력해주세요"
                value={maxFloors}
                onChange={handleMaxFloorsChange}
              />
              
              {/* maxFloors 값에 따라 동적으로 층 입력 필드 생성 */}
              {Number(maxFloors) > 0 && (
                <div className={styles.floorDrawings}>
                  <label>Register the drawing</label>
                  {[...Array(Number(maxFloors))].map((_, index) => (
                    <div key={index} className={styles.Contact_registerBuilding__map}>
                      <label>{index + 1} floor</label>
                      <input
                        type="file"
                        onChange={(e) => handleDrawingChange(index + 1, e.target.files[0])}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <button onClick={handleRegisterBuilding}>등록</button>
            </div>

            {/* 새 강의실 등록 */}
            <div className={styles.registerRoom}>
            <div className={styles.title}>
              <img src="/Main/building.png" className={styles.bannerIcon} alt="Building" />
              <h2>새 강의실 등록</h2></div>
              <p>원하시는 건물이 없다면 건물 등록</p>
              <label>Building</label>
              <Dropbutton 
                onSelect={(value) => setBuildingName(value)} 
                width="100%" 
                height="auto"
                borderColor="#A5A5A5" 
                borderWidth="1px"
              />
              <label>Room</label>
              <input
                type="text"
                placeholder="등록을 원하는 강의실 번호만 입력해주세요"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
              />
              <label>Serial Num</label>
              <input
                type="text"
                value={serialNum}
                placeholder="센서번호를 입력해주세요 ex) 3B73-A1C6-8IK21-R406"
                onChange={(e) => setSerialNum(e.target.value)}
              />
              <button onClick={handleRegisterRoom}>등록</button>
            </div>

            {/* 강의실 삭제 */}
            <div className={styles.removeRoom}>
              <div className={styles.title}>
              <img src="/Main/building.png" className={styles.bannerIcon} alt="Building" />
              <h2>강의실 삭제</h2></div>
              <p>최대 1일의 시간이 소요될 수 있습니다.</p>
              
              <label>Building</label>
              <Dropbutton 
                onSelect={(value) => setRemoveBuilding(value)} 
                width="100%" 
                height="auto"
                borderColor="#A5A5A5" 
                borderWidth="1px"
              />
              
              <label>Room</label>
              <input
                type="text"
                placeholder="등록을 원하는 강의실 번호만 입력해주세요"
                value={removeRoom}
                onChange={(e) => setRemoveRoom(e.target.value)}
              />
              
              <label>Reason</label>
              <textarea
                className={styles.reasonTextarea} // 스크롤이 가능한 텍스트 영역
                value={removeReason}
                placeholder="삭제를 원하시는 이유를 작성해주세요"
                onChange={(e) => setRemoveReason(e.target.value)}
              />
              
              <button onClick={handleRemoveRoom}>삭제</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
