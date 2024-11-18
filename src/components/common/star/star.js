import React, { useState, useEffect } from 'react'; // useState, useEffect 가져오기
import { FaStar, FaRegStar } from 'react-icons/fa';
import API from '../../../API/api'; // API 가져오기

const Star = ({ width = '100%', height = '100%', building = '신공학관', classRoom, toggleRefresh }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  const encodedBuilding = encodeURIComponent(building);
  const token = localStorage.getItem('token');

  const fetchDataInit = async () => {
    const endpoint = `/api/classrooms/favorite/status?building=${encodedBuilding}&name=${encodeURIComponent(classRoom)}`;
    try {
      setLoading(true);
      const response = await API.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsFavorited(response.data);
    } catch (e) {
      console.error('API 오류: ', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    if (loading) return;

    const endpoint = `/api/classrooms/favorite?building=${encodedBuilding}&name=${encodeURIComponent(classRoom)}`;
    try {
      setLoading(true);
      const response = await API.post(endpoint, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: '*/*',
        },
      });
      console.log('API 요청 성공:', response);

      toggleRefresh(); // 새로고침 상태 변경 호출
    } catch (e) {
      console.error('API 오류: ', e);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = () => {
    setIsFavorited((prev) => !prev);
    if (!loading) {
      fetchData();
    }
  };

  useEffect(() => {
    fetchDataInit();
  }, [classRoom]);

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
