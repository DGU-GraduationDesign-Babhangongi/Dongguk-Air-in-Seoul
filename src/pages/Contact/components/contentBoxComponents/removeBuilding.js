import React, { useState } from 'react';
import styles from '../../../../assets/styles/Contact.module.css';
import ContentBoxHeader from '../contentBoxHeader';

const removeBuilding = ({}) => {
  const [buildingName, setBuildingName] = useState('');
  const [maxFloors, setMaxFloors] = useState('');
  const [drawings, setDrawings] = useState({});
  const [buildingImage, setBuildingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);  // key 상태 추가
  const token = localStorage.getItem("token");
  const color = localStorage.getItem("schoolColor");
  const handleRegisterBuilding = async () => {
    // 필수 입력값 체크
    if (!buildingName || !maxFloors || !buildingImage || Object.keys(drawings).length < Number(maxFloors)) {
      alert("모든 필드를 채워주세요.");
      console.log("drawings:", drawings); // debug: drawings 객체 출력
      return;
    }
  
    if (loading) return;
    setLoading(true);
  
    const formData = new FormData();
    formData.append('name', buildingName);
    formData.append('maxFloor', Number(maxFloors));
    formData.append('buildingImage', buildingImage);
    Object.keys(drawings).forEach(floor => {
      formData.append('floorPlans', drawings[floor]);
    });
  
    try {
      const response = await fetch('https://donggukseoul.com/api/buildings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      formData.forEach((value, key) => {
        console.log(`${key}:`, value); // debug: 전송된 폼 데이터 출력
      });
  
      if (response.status === 200) {
        const result = await response.json();
        const uniqueNames = Array.from(new Set(result.name.split(',')));
        alert(`건물 "${uniqueNames.join(', ')}"이 성공적으로 등록되었습니다!`);
        setBuildingName('');
        setMaxFloors('');
        setDrawings({});
        setBuildingImage(null);
        setFileInputKey(prevKey => prevKey + 1);  // 파일 입력 리셋
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
  

  const handleDrawingChange = (floor, file) => {
    setDrawings(prevDrawings => ({
      ...prevDrawings,
      [floor]: file,
    }));
  };

  const handleMaxFloorsChange = (e) => {
    const value = e.target.value;
    // 숫자만 입력되도록 검사
    if (!isNaN(value) && Number(value) > 0) {
      setMaxFloors(value);
    } else {
      setMaxFloors(''); // 숫자가 아닐 경우 빈 값으로 초기화
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected image:', file);
      setBuildingImage(file);
    } else {
      console.log('No image selected');
    }
  };

  return (
    <div>
      <ContentBoxHeader
        icon="building.png"
        title="새 건물 등록"
        content="최대 7일의 시간이 소요될 수 있습니다."
      />
      <label>Building Name</label>
      <input
        type="text"
        placeholder="ex) 신공학관"
        value={buildingName}
        onChange={(e) => setBuildingName(e.target.value)}
      />

      {/* Building Image Input */}
      <label>Building Image</label>
      <input
        key={fileInputKey}  // key 속성에 상태 값 사용
        type="file"
        accept="image/*"
        onChange={handleImageChange}
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

      <button onMouseEnter={(e) => {
    e.target.style.backgroundColor = color; // hover 시 배경색 변경
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = 'lightgray'; // hover 벗어나면 원래 배경색으로 변경
  }} onClick={handleRegisterBuilding} disabled={loading}>등록</button>
    </div>
  );
};

export default removeBuilding;
