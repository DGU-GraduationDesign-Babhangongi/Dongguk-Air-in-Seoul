import React, { useState } from 'react';
import axios from 'axios';
import styles from './Memo.module.css';

function Memo({ closeModal, selectedBuilding, selectedRoom, selectedMemo }) {
  const [memoContent, setMemoContent] = useState(selectedMemo);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  // 메모 내용 변경 처리
  const handleChange = (e) => {
    setMemoContent(e.target.value);
  };

  // 메모 등록 함수
  const handleRegister = async () => {
    if (!memoContent.trim()) {
      alert('메모 내용을 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // 토큰 가져오기
      const response = await axios.post(
        'https://donggukseoul.com/api/memo/add',
        null, // 데이터는 query로 전달되므로 body는 비움
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: '*/*',
          },
          params: {
            building: selectedBuilding,
            name: selectedRoom,
            content: memoContent,
          },
        }
      );

      if (response.status === 200) {
        alert('메모가 성공적으로 등록되었습니다.');
        closeModal(); // 모달 닫기
      } else {
        alert('메모 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('메모 등록 중 오류 발생:', error);
      alert('메모 등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <img src={require('../../../assets/images/edit.png')} alt="Edit Icon" />
          <h2>{selectedBuilding} {selectedRoom}</h2>
          <button onClick={closeModal} className={styles.closeButton}>×</button>
        </div>
        <textarea
          value={memoContent}
          onChange={handleChange}
          placeholder="메모를 작성하세요"
          className={styles.textarea}
        />
        <div className={styles.buttonContainer}>
          <button
            className={styles.registerButton}
            onClick={handleRegister}
            disabled={loading} // 로딩 중 버튼 비활성화
          >
            {loading ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Memo;
