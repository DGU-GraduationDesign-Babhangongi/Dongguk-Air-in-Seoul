import React, { useState } from 'react';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import styles from '../../assets/styles/Contact.module.css';
import Dropbutton from '../../components/common/Dropbutton/Dropbutton';
import { FiCpu } from "react-icons/fi";
import building from "../../assets/images/main/building.png";

function Contact() {
  const [buildingName, setBuildingName] = useState('');
  const [roomBuildingName, setRoomBuildingName] = useState('');
  const [maxFloors, setMaxFloors] = useState('');
  const [drawings, setDrawings] = useState({});
  const [buildingOptions, setBuildingOptions] = useState([
    { value: '신공학관', label: '신공학관' },
    { value: '원흥관', label: '원흥관' },
    { value: '정보문화관 P', label: '정보문화관 P' },
    { value: '정보문화관 Q', label: '정보문화관 Q' },
    { value: '명진관', label: '명진관' },
  ]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [serialNum, setSerialNum] = useState('');
  const [removeBuilding, setRemoveBuilding] = useState('');
  const [removeRoom, setRemoveRoom] = useState('');
  const [removeReason, setRemoveReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegisterBuilding = async () => {
    if (!buildingName || !maxFloors || Object.keys(drawings).length === 0) {
      alert("모든 필드를 채워주세요.");
      return;
    }

    if (loading) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('name', buildingName);
    formData.append('maxFloor', maxFloors);
    Object.keys(drawings).forEach((floor) => {
      formData.append('floorPlans', drawings[floor]);
    });

    try {
      const response = await fetch('https://donggukseoul.com/api/buildings', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();

        // 중복 제거
        const uniqueNames = Array.from(new Set(result.name.split(',')));

        uniqueNames.forEach((name) => {
          if (!buildingOptions.find((option) => option.value === name)) {
            setBuildingOptions((prevOptions) => [
              ...prevOptions,
              { value: name, label: name },
            ]);
          }
        });

        alert(`건물 "${uniqueNames.join(', ')}"이 성공적으로 등록되었습니다!`);
        setBuildingName('');
        setMaxFloors('');
        setDrawings({});
      } else {
        const errorData = await response.json();
        alert(`등록 실패: ${errorData.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('API 호출 에러:', error);
      alert('건물 등록 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRoom = async () => {
    if (!roomBuildingName || !selectedRoom || !serialNum) {
      alert("모든 필드를 채워주세요.");
      return;
    }

    const payload = {
      name: selectedRoom,
      floor: 0,
      building: roomBuildingName,
      sensorId: serialNum,
      sensorType: "default",
    };

    try {
      const response = await fetch('/api/classrooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('강의실이 성공적으로 등록되었습니다!');
        setRoomBuildingName('');
        setSelectedRoom('');
        setSerialNum('');
      } else {
        const errorData = await response.json();
        alert(`등록 실패: ${errorData.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('API 호출 에러:', error);
      alert('강의실 등록 중 문제가 발생했습니다.');
    }
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
      <Header />
      <div style={{ display: 'flex' }}>
        <SideBar />
        <div className={styles.container}>
          <div className={styles.banner}>
            <FiCpu size={36} color="#333" />
            <h1>관리자 페이지</h1>
          </div>
          <div className={styles.registerSection}>
            <div className={styles.registerBuilding}>
              <div className={styles.title}>
                <img src={building} className={styles.bannerIcon} alt="Building" />
                <h2>새 건물 등록</h2>
              </div>
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
            <div className={styles.registerRoom}>
              <div className={styles.title}>
                <img src={building} className={styles.bannerIcon} alt="Building" />
                <h2>새 강의실 등록</h2>
              </div>
              <p>원하시는 건물이 없다면 건물 등록</p>
              <label>Building</label>
              <Dropbutton 
                onSelect={(value) => setRoomBuildingName(value)}
                width="100%" 
                height="auto"
                borderColor="#A5A5A5" 
                borderWidth="1px"
                options={buildingOptions}
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
            <div className={styles.removeRoom}>
              <div className={styles.title}>
                <img src={building} className={styles.bannerIcon} alt="Building" />
                <h2>강의실 삭제</h2>
              </div>
              <p>최대 1일의 시간이 소요될 수 있습니다.</p>
              <label>Building</label>
              <Dropbutton 
                onSelect={(value) => setRemoveBuilding(value)} 
                width="100%" 
                height="auto"
                borderColor="#A5A5A5" 
                borderWidth="1px"
                options={buildingOptions}
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
                className={styles.reasonTextarea}
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
