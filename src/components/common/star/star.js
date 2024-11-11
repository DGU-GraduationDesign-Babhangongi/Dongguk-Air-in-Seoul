import React, { useState, useCallback } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import axios from 'axios';  // axios 사용
import debounce from 'lodash.debounce';

const Star = ({ width = '100%', height = '100%', building = '신공학관', classRoom }) => {
  const [isFavorited, setIsFavorited] = useState(false); // 즐겨찾기 상태 관리
  const [loading, setLoading] = useState(false);

  // building을 제대로 URL에 인코딩
  const encodedBuilding = encodeURIComponent(building);

  const fetchData = async (classRoom) => {
    const token = localStorage.getItem("token"); // 로컬스토리지에서 토큰 가져오기
    const endpoint = `https://donggukseoul.com/api/classrooms/favorite?building=${encodedBuilding}&name=${encodeURIComponent(classRoom)}`; // 클래스룸 URL 파라미터 추가

    try {
      setLoading(true);  // 요청 시작

      // axios를 사용하여 API POST 요청
      const response = await axios.post(endpoint, null, {
        headers: {
          'Authorization': `Bearer ${token}`, // Authorization 헤더 추가
          'accept': '*/*', // accept 헤더 추가
        },
      });

      console.log('API 요청 성공:', response); // 성공적으로 요청이 완료되었을 경우 콘솔 출력
    } catch (e) {
      console.error("API 오류: ", e); // 오류 발생 시 콘솔에 출력
    } finally {
      setLoading(false); // 요청 완료 후 로딩 상태 변경
    }
  };

  // debounce된 함수 정의 (useCallback을 통해 메모이제이션)
  const fetchDataDebounced = useCallback(debounce(fetchData, 300), [encodedBuilding]);

  // 즐겨찾기 버튼 클릭 시 색상 변경 함수
  const handleFavoriteClick = () => {
    setIsFavorited((prev) => !prev); // 상태를 반전시켜 색상 변경
  };

  // 상태가 변경될 때마다 fetchDataDebounced 호출 (효과적으로 한번만 호출되도록)
  React.useEffect(() => {
    
      fetchDataDebounced(classRoom); // 상태가 true일 때만 API 호출
    
  }, [isFavorited, classRoom, fetchDataDebounced]);

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
