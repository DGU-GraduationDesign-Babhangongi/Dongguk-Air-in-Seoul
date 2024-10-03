import React, { useState } from 'react';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import ManageAll from '../../components/common/ManageAll/ManageAll';
import Memo from '../../components/common/Memo/Memo'; // Memo 컴포넌트 불러오기
import styles from '../../assets/styles/Manager.module.css';
import { GoPerson } from "react-icons/go";

function Manager() {
  // 팝업창을 위한 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedMemo, setSelectedMemo] = useState('');

  // 팝업창 열기
  const openModal = (building, room) => {
    setSelectedBuilding(building);
    setSelectedRoom(room);
    setIsModalOpen(true);    // 팝업창 열기
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
            <ManageAll openMemoModal={openModal} />
            <ManageAll openMemoModal={openModal} />
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
