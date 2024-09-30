import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API/api';

function Test() {

  const Doit = () => {
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
        setData(response.data); // 데이터를 설정할 때 response.data.data에 접근
      } catch (e) {
        console.error("API 오류: ", e);
        navigate('/');
      }
    };

    return (
      <div style={{ display: "flex" }}>
        {/* data 배열이 비어있지 않으면 첫 번째 데이터를 표시 */}

          <div>
            <p>id: {data.id}</p>
            <p>name: {data.name}</p>
            <p>floor: {data.floor}</p>
            <p>building: {data.building}</p>
            <p>sensorId: {data.sensorId}</p>
          </div>
        
      </div>
    );
  };

  return (
    <Doit />
  );
}

export default Test;
