import React, { useState } from 'react';
import Dropbutton from '../../../../components/common/Dropbutton/BuildingDropbutton';
import ContentBoxHeader from '../contentBoxHeader';
import pin from '../../../../assets/images/img_pin.png'; // 핀 이미지 import

const RegisterRoom = ({ buildingOptions, token }) => {
  const [roomBuildingName, setRoomBuildingName] = useState(''); // 초기값은 빈 문자열
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [serialNum, setSerialNum] = useState('');
  const [sensorType, setSensorType] = useState('');
  const [drawingCoordinates, setDrawingCoordinates] = useState({ x: 0, y: 0 });
  const [drawingImage, setDrawingImage] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Refresh key for re-render
  const color = localStorage.getItem("schoolColor");
  const handleRegisterRoom = async () => {
    if (!roomBuildingName || !floor || !room || !serialNum || !sensorType) {
      alert('모든 필드를 채워주세요.');
      return;
    }

    const payload = {
      name: room,
      floor: parseInt(floor, 10),
      building: roomBuildingName,
      sensorId: serialNum,
      sensorType: sensorType,
      sensorX: drawingCoordinates.x,
      sensorY: drawingCoordinates.y,
    };

    try {
      const response = await fetch('https://donggukseoul.com/api/classrooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('강의실이 성공적으로 등록되었습니다!');
        // 등록 성공 후 상태 초기화
        setRoomBuildingName('');  // Dropbutton의 값을 초기화
        setFloor('');
        setRoom('');
        setSerialNum('');
        setSensorType('');
        setDrawingCoordinates({ x: 0, y: 0 });
        setDrawingImage(null); // 도면 이미지 초기화
        setRefreshKey(prevKey => prevKey + 1);
      } else {
        const errorData = await response.json();
        alert(`등록 실패: ${errorData.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('API 호출 에러:', error);
      alert('강의실 등록 중 문제가 발생했습니다.');
    }
  };

  const searchDrawing = async () => {
    try {
        const response = await fetch(`https://donggukseoul.com/api/buildings/${roomBuildingName}/floors/${floor}/floorPlan`, {
            method: 'GET',
            headers: {
              'Accept': '*/*',
            },
          });

      if (response.ok) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let result = '';
  
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          result += decoder.decode(value, { stream: true });
        }
  
        console.log(result); // 처리된 데이터를 콘솔에 출력
        setDrawingImage(result); 
      } else {
        alert('도면 불러오기 실패');
      }
    } catch (error) {
      console.error('Error fetching building data:', error);
    }
  };

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    setDrawingCoordinates({ x: xPercent.toFixed(2), y: yPercent.toFixed(2) });
    alert(`좌표가 설정되었습니다: X=${xPercent.toFixed(2)}%, Y=${yPercent.toFixed(2)}%`);
  };

  return (
    <div style={{ position: 'relative' }} key={refreshKey}>
      <ContentBoxHeader
        icon="building.png"
        title="새 강의실 등록"
        content="원하시는 건물이 없다면 건물을 등록할 수 있습니다"
      />
      <label>Building</label>
      <Dropbutton
        value={roomBuildingName} // Dropbutton의 value에 roomBuildingName 상태값 전달
        onSelect={(value) => setRoomBuildingName(value)} // Dropbutton에서 선택된 값 업데이트
        width="100%"
        height="auto"
        borderColor="#A5A5A5"
        borderWidth="1px"
        options={buildingOptions}
      />

      <label>Floor</label>
      <input
        type="text"
        placeholder="층수를 입력해주세요."
        value={floor}
        onChange={(e) => setFloor(e.target.value)}
      />

      <label>Room</label>
      <input
        type="text"
        placeholder="등록을 원하는 강의실 번호만 입력해주세요"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        style={{ marginBottom: '5px' }}
      />

      <button onMouseEnter={(e) => {
    e.target.style.backgroundColor = color; // hover 시 배경색 변경
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = 'lightgray'; // hover 벗어나면 원래 배경색으로 변경
  }} onClick={searchDrawing} style={{ fontSize: '14px', marginBottom: '22px' }}>
        해당 층 도면도 불러오기
      </button>

      {drawingImage ? (
        <div style={{ margin: '10px 0', border: '1px solid #ccc', padding: '10px', position: 'relative' }}>
          <img
            src={drawingImage}
            alt="도면 이미지"
            style={{
              width: '100%', // 부모 컨테이너에 맞춰서 크기 조정
              height: 'calc(100% * 2 / 3)', // 3:2 비율을 강제로 유지
              objectFit: 'fill', // 이미지가 크기에 맞춰 늘어나도록 설정
            }}
            onClick={handleImageClick}
          />
          {drawingCoordinates.x > 0 && drawingCoordinates.y > 0 && (
            <img
              src={pin}
              alt="핀 이미지"
              style={{
                position: 'absolute',
                left: `${drawingCoordinates.x}%`,
                top: `${drawingCoordinates.y}%`,
                transform: 'translate(-50%, -100%)',
                width: '30px',
                height: '30px',
              }}
            />
          )}
        </div>
      ) : (
        <div style={{ margin: '10px 0', textAlign: 'center', color: '#A5A5A5' }}>
          도면도를 검색해주세요.
        </div>
      )}

      <label>Serial Num</label>
      <input
        type="text"
        placeholder="센서번호를 입력해주세요."
        value={serialNum}
        onChange={(e) => setSerialNum(e.target.value)}
      />

      <label>Sensor Type</label>
      <input
        type="text"
        placeholder="센서타입을 입력해주세요."
        value={sensorType}
        onChange={(e) => setSensorType(e.target.value)}
      />

      <button onMouseEnter={(e) => {
    e.target.style.backgroundColor = color; // hover 시 배경색 변경
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = 'lightgray'; // hover 벗어나면 원래 배경색으로 변경
  }} onClick={handleRegisterRoom}>등록</button>
    </div>
  );
};

export default RegisterRoom;
