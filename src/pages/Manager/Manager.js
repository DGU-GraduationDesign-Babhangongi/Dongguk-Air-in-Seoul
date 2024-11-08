import React, { useState } from 'react';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import ManageAll from '../../components/common/ManageAll/ManageAll';
import Memo from '../../components/common/Memo/Memo';
import styles from '../../assets/styles/Manager.module.css';
import { GoPerson } from "react-icons/go";

function Manager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedMemo, setSelectedMemo] = useState('');

  // 강의실 정보 목록
  const rooms = [
    { buildingName: "신공학관", roomNumber: "6144", sensorId: "0C:7B:C8:FF:55:5D" },
    { buildingName: "신공학관", roomNumber: "6119", sensorId: "0C:7B:C8:FF:56:8A" },
    { buildingName: "신공학관", roomNumber: "5147", sensorId: "0C:7B:C8:FF:5B:8F" },
    { buildingName: "신공학관", roomNumber: "5145", sensorId: "0C:7B:C8:FF:5C:C8" },
    { buildingName: "신공학관", roomNumber: "4142", sensorId: "0C:7B:C8:FF:57:5A" },
    { buildingName: "신공학관", roomNumber: "3173", sensorId: "0C:7B:C8:FF:5B:06" },
    { buildingName: "신공학관", roomNumber: "3115", sensorId: "0C:7B:C8:FF:56:F1" },
  ];

  // 팝업창 열기
  const openModal = (building, room) => {
    setSelectedBuilding(building);
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  // 팝업창 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBuilding('');
    setSelectedRoom('');
    setSelectedMemo('');
  };

  return (
    <div>
      <Header />
      <div className={styles.layout}>
        <SideBar />
        <div className={styles.container}>
          <div className={styles.banner}>
            <GoPerson size={36} color="#333" />
            <h1>이수민 관리자</h1>
          </div>
          <div className={styles.grid}>
            {rooms.map((room, index) => (
              <ManageAll
                key={index}
                openMemoModal={openModal}
                buildingName={room.buildingName}
                roomNumber={room.roomNumber}
                sensorId={room.sensorId}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 팝업창 렌더링 */}
      {isModalOpen && (
        <Memo
          closeModal={closeModal}
          selectedBuilding={selectedBuilding}
          selectedRoom={selectedRoom}
          selectedMemo={selectedMemo}
        />
      )}
    </div>
  );
}

export default Manager;
