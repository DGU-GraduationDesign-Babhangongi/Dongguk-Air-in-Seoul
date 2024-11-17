import React, { useState, useEffect } from 'react';
import styles from '../alarmScrollBox/alarmScrollBox.module.css';
import API from '../../../API/api';
import moment from 'moment';
import debounce from 'lodash.debounce';

const token = localStorage.getItem("token");

const SignificantScrollBox = ({ title, classRoom }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (classRoom) => {
    if (!classRoom) return;
    setLoading(true);
    setError(null);

    const encodedBuilding = encodeURIComponent('신공학관');
    const endpoint = `/api/memo/classroom?building=${encodedBuilding}&name=${classRoom}`;

    try {
      const response = await API.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

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

      setData(formattedData.reverse());
    } catch (e) {
      console.error("API 오류: ", e);
      setError('데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataDebounced = debounce(fetchData, 300);

  useEffect(() => {
    fetchDataDebounced(classRoom);
  }, [classRoom]);

  const formatMessage = (item) => {
    return `${item.timestamp}<br/> ${item.nickname}: ${item.content}`;
  };

  return (
    <div className={styles.Container}>
      <div style={{ marginLeft: '5%' }}>{title}</div>
      <div className={styles.scrollableContainer}>
        {loading ? (
          <div style={{margin:'0 25%', width: '50%', height:"100%", display:'flex', alignItems:'center', textAlign:'center'}}>Loading...</div>

        ) : error ? (
          <div>{error}</div>
        ) : data.length === 0 ? ( // 데이터가 없을 때 메시지 출력
          <div style={{margin:'0 1%', width: '98%', height:"100%", display:'flex', alignItems:'center'}}>해당 강의실의 메모가 없습니다.</div>
      
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
