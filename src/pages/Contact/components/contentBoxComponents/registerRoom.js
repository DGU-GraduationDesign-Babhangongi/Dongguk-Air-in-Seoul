import React, { useState } from 'react';
import Dropbutton from '../../../../components/common/Dropbutton/BuildingDropbutton';
import ContentBoxHeader from '../contentBoxHeader';

const RegisterRoom = ({ buildingOptions, token }) => {
  const [roomBuildingName, setRoomBuildingName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [serialNum, setSerialNum] = useState('');

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
          'Authorization': `Bearer ${token}`,
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

  return (
    <div >
      <ContentBoxHeader
        icon="building.png" // 이미지 파일 이름
        title="새 강의실 등록" // 제목
        content="원하시는 건물이 없다면 건물 등록" 
      />
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
  );
};

export default RegisterRoom;
