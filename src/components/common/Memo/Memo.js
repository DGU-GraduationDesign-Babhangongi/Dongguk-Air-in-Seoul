import React, { useState } from 'react';
import styles from './Memo.module.css';

function Memo({ closeModal, selectedBuilding, selectedRoom, selectedMemo }) {
  const [memoContent, setMemoContent] = useState(selectedMemo);

  // 메모 내용 변경 처리
  const handleChange = (e) => {
    setMemoContent(e.target.value);
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
          <button className={styles.registerButton}>Register</button>
        </div>
      </div>
    </div>
  );
}

export default Memo;
