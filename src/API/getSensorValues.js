import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API/api';

function Test() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const endpoint = "api/classrooms/1";
    try {
      const response = await API.get(endpoint, {
        headers: {
          // 필요한 헤더가 있으면 추가
        }
      });
      console.log("응답 데이터:", response.data); // 응답 확인용
      setData(response.data); // 데이터를 설정할 때 response.data에 접근
    } catch (e) {
      console.error("API 오류: ", e);
      navigate('/');
    }
  };

  return (
    <div>
      {/* 데이터를 렌더링하는 부분 */}
      {data.length > 0 ? (
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.name}</li> // item의 구조에 맞게 수정
          ))}
        </ul>
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </div>
  );
}

export default Test;
