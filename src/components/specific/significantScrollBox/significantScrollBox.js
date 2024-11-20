import React, { useState, useEffect } from 'react';
import styles from '../alarmScrollBox/alarmScrollBox.module.css';
import API from '../../../API/api';
import moment from 'moment';
import debounce from 'lodash.debounce';

const token = localStorage.getItem("token");

const SignificantScrollBox = ({ title, classRoom }) => {
  const [data, setData] = useState([]); // API로부터 받아온 데이터
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태

  // 데이터 Fetch 함수
  const fetchData = async (classRoom) => {
    if (!classRoom) return;
    setLoading(true); // 로딩 시작
    setError(null); // 오류 초기화

    const encodedBuilding = encodeURIComponent('신공학관');
    const endpoint = `/api/memo/classroom?building=${encodedBuilding}&name=${classRoom}`;

    try {
      const response = await API.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // 받은 데이터를 포맷팅하여 setData로 업데이트
      const formattedData = response.data
        ? response.data.map((item) => {
            const formattedTimestamp = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss');
            return {
              timestamp: formattedTimestamp,
              nickname: item.nickname,
              content: item.content,
            };
          })
        : [];

      setData(formattedData.reverse()); // 최신 데이터가 위로 오도록 reverse
    } catch (e) {
      console.error("API 오류: ", e);
      setError('데이터를 불러오는 중 오류가 발생했습니다.\n 다시 시도해 주세요.');
      setData([]); // 오류 시 빈 배열로 초기화
    } finally {
      setLoading(false); // 로딩 끝
    }
  };

  // debounce를 사용하여 API 호출 최적화 (300ms)
  const fetchDataDebounced = debounce(fetchData, 300);

  useEffect(() => {
    fetchDataDebounced(classRoom); // classRoom이 변경되면 데이터 다시 로드
  }, [classRoom]);

  // 데이터 포맷팅 함수
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
            강의실의 메모가 존재하지 않습니다.
          </div>
        ) : (
          data.map((item, index) => {
            const message = formatMessage(item);
            return <div key={index} dangerouslySetInnerHTML={{ __html: message }} />;
          })
        )}
      </div>
    </div>
  );
};

export default SignificantScrollBox;
