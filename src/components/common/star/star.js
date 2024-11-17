import React, { useState, useEffect, useCallback } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import API from '../../../API/api';
import debounce from 'lodash.debounce';

const Star = ({ width = '100%', height = '100%', building = '신공학관', classRoom, selectedFavorited = false }) => {
  const [isFavorited, setIsFavorited] = useState(selectedFavorited);
  const [loading, setLoading] = useState(false);

  const encodedBuilding = encodeURIComponent(building);
  const token = localStorage.getItem("token");

  const fetchData = async (classRoom) => {
    if (loading) return; // 요청 중이라면 실행하지 않음

    const endpoint = `/api/classrooms/favorite?building=${encodedBuilding}&name=${encodeURIComponent(classRoom)}`;

    try {
      setLoading(true);
      const response = await API.post(endpoint, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': '*/*',
        },
      });

      console.log('API 요청 성공:', response);
    } catch (e) {
      console.error("API 오류: ", e);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = () => {
    setIsFavorited((prev) => !prev);

    // 현재 요청이 없고, 클릭 이벤트가 발생했을 때만 API 호출
    if (!loading) {
      fetchData(classRoom);
    }
  };

  useEffect(() => {
    setIsFavorited(selectedFavorited);
  }, [selectedFavorited]);

  return (
    <div style={{ width, height, position: 'relative' }}>
      <FaStar
        size={'68%'}
        color={isFavorited ? '#FFD700' : '#A5A5A5'}
        onClick={handleFavoriteClick}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          cursor: 'pointer',
          transition: 'color 0.3s ease',
          zIndex: 1,
        }}
      />

      <FaRegStar
        size={'100%'}
        color="#000000"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
        }}
      />
    </div>
  );
};

export default Star;
