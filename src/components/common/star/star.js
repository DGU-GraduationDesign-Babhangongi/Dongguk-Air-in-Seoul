import React, { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import API from '../../../API/api';
import debounce from 'lodash.debounce';

const Star = ({ width = '100%', height = '100%', building = '신공학관', classRoom }) => {
  const [isFavorited, setIsFavorited] = useState(false); // 즐겨찾기 상태 관리
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // building을 제대로 URL에 인코딩
  const encodedBuilding = encodeURIComponent(building);

  const fetchData = async (classRoom) => {
    const token = localStorage.getItem("token");
    const endpoint = `/api/classrooms/favorite?building=${encodedBuilding}&name=${encodeURIComponent(classRoom)}`; // classRoom을 올바르게 URL에 추가
    try {
      const response = await API.post(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

    } catch (e) {
      console.error("API 오류: ", e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataDebounced = debounce(fetchData, 300);

  // 즐겨찾기 버튼 클릭 시 색상 변경 함수
  const handleFavoriteClick = () => {
    setIsFavorited((prev) => !prev); // 상태를 반전시켜 색상 변경
    favoriteFunction(); // 클릭 시 호출할 함수44
  };

  // 실제로 동작할 함수 (실제 동작은 필요 없으므로 빈 함수로 설정)
  const favoriteFunction = () => {
    fetchData(classRoom); // classRoom 값도 같이 넘기기
    console.log('즐겨찾기 클릭됨');
  };

  return (
    <div style={{ width, height, position: 'relative' }}>
      {/* 메인 아이콘 */}
      <FaStar
        size={'68%'} // 실제 아이콘 크기
        color={isFavorited ? '#FFD700' : '#A5A5A5'} // 메인 색상
        onClick={handleFavoriteClick}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', // 중앙으로 이동
          cursor: 'pointer',
          transition: 'color 0.3s ease',
          zIndex: 1,
        }}
      />

      {/* 테두리 역할을 하는 아이콘 */}
      <FaRegStar
        size={'100%'} // 테두리 크기, 부모 요소의 크기에 맞춰 설정
        color="#000000" // 테두리 색상
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', // 중앙으로 이동
          zIndex: 0,
        }}
      />
    </div>
  );
};

export default Star;
