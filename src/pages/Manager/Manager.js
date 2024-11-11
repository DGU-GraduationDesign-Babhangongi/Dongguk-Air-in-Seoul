import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import ManageAll from '../../components/common/ManageAll/ManageAll';
import Memo from '../../components/common/Memo/Memo';
import styles from '../../assets/styles/Manager.module.css';
import { GoPerson } from "react-icons/go";
import axios from 'axios';

function Manager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedMemo, setSelectedMemo] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // API를 통해 강의실 정보 가져오기
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('https://donggukseoul.com/api/classrooms/myFavorites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            building: '신공학관',
            favoriteFirst: true,
            orderDirection: 'ASC'
          }
        });

        // sensorType이 'Air'인 경우만 필터링하고 데이터 구조를 변환
        const formattedData = response.data
          .filter(room => room.sensorType === 'Air') // sensorType이 'Air'인 경우만 필터링
          .map(room => ({
            id: room.id,
            building: room.building,
            roomNumber: room.name,
            sensorId: room.sensorId,
            favorited: room.favorited, // favorited 필드를 추가합니다.
            value: room.name, // 필요에 따라 추가
            label: room.name  // 필요에 따라 추가
          }))
          // favorited 값과 roomNumber로 정렬합니다.
          .sort((a, b) => {
            if (a.favorited === b.favorited) {
              return a.roomNumber.localeCompare(b.roomNumber, 'en', { numeric: true });
            }
            return b.favorited - a.favorited;
          });

        setRooms(formattedData);
      } catch (error) {
        console.error("강의실 정보를 가져오는 데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

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
          {loading ? (
            <p>로딩 중...</p>
          ) : (
            <div className={styles.grid}>
              {rooms.map((room) => (
                <ManageAll
                  key={room.id}
                  openMemoModal={openModal}
                  buildingName={room.building}
                  roomNumber={room.roomNumber}
                  sensorId={room.sensorId}
                  favorited={room.favorited} // 필요하다면 전달
                />
              ))}
            </div>
          )}
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
