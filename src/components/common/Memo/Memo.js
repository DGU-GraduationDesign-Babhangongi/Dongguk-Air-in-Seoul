import React, { useState } from 'react';
import styles from './Memo.module.css';

function Memo({ closeModal, selectedMemo }) {
  const [memoContent, setMemoContent] = useState(selectedMemo);

  // 메모 내용 변경 처리
  const handleChange = (e) => {
    setMemoContent(e.target.value);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>메모 수정</h2>
        <textarea value={memoContent} onChange={handleChange} placeholder="메모를 작성하세요" />
        <div className={styles.buttons}>
          <button onClick={closeModal} className={styles.closeButton}>닫기</button>
          <button className={styles.saveButton}>저장</button>
        </div>
      </div>
    </div>
  );
}

export default Memo;
