import React, { useState, useEffect } from 'react';
import styles from '../alarmScrollBox/alarmScrollBox.module.css';
import API from '../../../API/api';
import moment from 'moment';
import debounce from 'lodash.debounce';

const token = localStorage.getItem("token");
const buildingName='신공학관';

const SignificantScrollBox = ({ title, classRoom }) => {
  const [data, setData] = useState([]); // 데이터 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태

  // 데이터 Fetch 함수
  const fetchData = async (classRoom) => {
    if (!classRoom) return;
    setLoading(true);
    setError(null);

    const endpoint = `/api/memo/classroom?building=${encodeURIComponent(buildingName)}&name=${classRoom}`;

    try {
      const response = await API.get(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      // 받은 데이터 포맷팅
      const formattedData = response.data ? response.data.map(item => ({
        timestamp: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        nickname: item.nickname,
        content: item.content,
      })) : [];
      setData(formattedData.reverse());
    } catch (e) {
      //console.error("API 오류: ", e);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // debounce로 API 호출 최적화 (300ms)
  const fetchDataDebounced = debounce(fetchData, 300);

  useEffect(() => {
    fetchDataDebounced(classRoom); // classRoom 변경 시 데이터 새로 로드
  }, [classRoom]);

  // 메시지 포맷 함수
  const formatMessage = (item) => {
    return `${item.timestamp}<br/> ${item.nickname}: ${item.content}`;
  };

  return (
    <div className={styles.Container}> 
      <div style={{ marginLeft: '5%' }}>{title}</div>
      <div className={styles.scrollableContainer}>
        {loading ? (
          <div style={{ margin: '0 25%', width: '50%', height: "100%", display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            Loading...
          </div>
        ) : error ? (
          <div>{error}</div>
        ) : data.length === 0 ? (
          <div style={{ margin: '0 1%', width: '98%', height: "100%", display: 'flex', alignItems: 'center' }}>
            강의실 메모가 존재하지 않습니다.
          </div>
        ) : (
          data.map((item, index) => (
            <div key={index} dangerouslySetInnerHTML={{ __html: formatMessage(item) }} />
          ))
        )}
      </div>
    </div>
  );
};

export default SignificantScrollBox;
