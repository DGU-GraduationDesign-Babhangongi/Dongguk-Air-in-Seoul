import React, { useState, useEffect } from 'react';
import Dropbutton from '../../../../components/common/Dropbutton/BuildingDropbutton';
import styles from '../../../../assets/styles/Contact.module.css';
import ContentBoxHeader from '../contentBoxHeader';

const RemoveRoomComponent = ({ token }) => {
  const [removeBuilding, setRemoveBuilding] = useState('');
  const [removeRoom, setRemoveRoom] = useState('');
  const [removeReason, setRemoveReason] = useState('');
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // key 상태 추가
  const color = localStorage.getItem("schoolColor");
  const fetchBuildings = async () => {
    try {
      const response = await fetch('https://donggukseoul.com/api/buildings', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const options = data.map((building) => ({
          value: building.id,
          label: building.name,
        }));
        setBuildingOptions(options);
      } else {
        console.error('Failed to fetch building data');
      }
    } catch (error) {
      console.error('Error fetching building data:', error);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, [token]);

  const handleRemoveRoom = async () => {
    if (!removeBuilding || !removeRoom || !removeReason) {
      alert("모든 필드를 채워주세요.");
      return;
    }

    const url = `https://donggukseoul.com/api/classrooms/name?building=${encodeURIComponent(removeBuilding)}&name=${encodeURIComponent(removeRoom)}&reason=${encodeURIComponent(removeReason)}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
        },
      });

      if (response.ok) {
        alert('강의실이 성공적으로 삭제되었습니다!');
        setRemoveBuilding('');
        setRemoveRoom('');
        setRemoveReason('');
        // 건물 목록을 다시 가져오고 컴포넌트를 새로 리렌더링하기 위해 key를 변경
        setRefreshKey(prevKey => prevKey + 1);
      } else {
        const errorData = await response.json();
        alert(`삭제 실패: ${errorData.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('API 호출 에러:', error);
      alert('강의실 삭제 중 문제가 발생했습니다.');
    }
  };

  return (
    <div key={refreshKey}> {/* key를 변경하여 컴포넌트를 새로 렌더링 */}
      <ContentBoxHeader
        icon="building.png"
        title="강의실 삭제"
        content="센서가 더 이상 존재하지 않는 강의실을 삭제할 수 있습니다." 
      />
      <label>Building</label>
      <Dropbutton
        value={removeBuilding}
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
      <button onMouseEnter={(e) => {
    e.target.style.backgroundColor = color; // hover 시 배경색 변경
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = 'lightgray'; // hover 벗어나면 원래 배경색으로 변경
  }} onClick={handleRemoveRoom}>삭제</button>
    </div>
  );
};

export default RemoveRoomComponent;
