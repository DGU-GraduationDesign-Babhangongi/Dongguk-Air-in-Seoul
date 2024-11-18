import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header/Header';
import SideBar from '../../components/common/SideBar/SideBar';
import ManageAll from '../../components/common/ManageAll/ManageAll';
import Memo from '../../components/common/Memo/Memo';
import styles from '../../assets/styles/Manager.module.css';
import { GoPerson } from 'react-icons/go';
import axios from 'axios';

function Manager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedMemo, setSelectedMemo] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState(''); // 닉네임 상태 추가
  const [refresh, setRefresh] = useState(false); // 새로고침 상태 추가

  const openModal = (building, room) => {
    setSelectedBuilding(building);
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBuilding('');
    setSelectedRoom('');
    setSelectedMemo('');
  };

  const fetchNickname = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('/api/user/nickname', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setNickname(response.data); // nickname 설정
        } else {
          console.error('닉네임을 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('오류 발생:', error);
      }
    }
  };

  useEffect(() => {
    fetchNickname();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://donggukseoul.com/api/classrooms/myFavorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          building: '신공학관',
          favoriteFirst: true,
          orderDirection: 'ASC',
        },
      });

      const formattedData = response.data
        .filter((room) => room.sensorType === 'Air')
        .map((room) => ({
          id: room.id,
          building: room.building,
          roomNumber: room.name,
          sensorId: room.sensorId,
          favorited: room.favorited,
          value: room.name,
          label: room.name,
        }))
        .sort((a, b) => b.favorited - a.favorited || a.roomNumber.localeCompare(b.roomNumber, 'en', { numeric: true }));

      setRooms(formattedData);
    } catch (error) {
      console.error('강의실 정보를 가져오는 데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [refresh]); // 새로고침 상태가 변경될 때 데이터 다시 불러오기

  const handleRefresh = () => {
    setRefresh((prev) => !prev); // 새로고침 상태 변경
  };

  return (
    <div>
      <Header i={"3"}/>
      <div className={styles.layout}>
        <SideBar />
        <div className={styles.container}>
          <div className={styles.banner}>
            <GoPerson size={36} color="#333" />
            <h1>{nickname} 관리자</h1> {/* 닉네임을 동적으로 표시 */}
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
                  favorited={room.favorited}
                  toggleRefresh={handleRefresh} // 새로고침 상태 변경 함수 전달
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <Memo closeModal={closeModal} selectedBuilding={selectedBuilding} selectedRoom={selectedRoom} selectedMemo={selectedMemo} />
      )}
    </div>
  );
}

export default Manager;
