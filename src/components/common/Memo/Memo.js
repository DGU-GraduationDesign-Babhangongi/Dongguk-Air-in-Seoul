import React, { useState } from 'react';
import axios from 'axios';
import styles from './Memo.module.css';

function Memo({ closeModal, selectedBuilding, selectedRoom, selectedMemo }) {
  const [memoContent, setMemoContent] = useState(selectedMemo);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setMemoContent(e.target.value);
  };

  const handleRegister = async () => {
    if (!memoContent.trim()) {
      alert('메모 내용을 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        'https://donggukseoul.com/api/memo/add',
        null,
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
        closeModal();
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
            disabled={loading}
          >
            {loading ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Memo;
