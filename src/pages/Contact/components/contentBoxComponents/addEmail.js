import React, { useState } from 'react';
import styles from '../../../../assets/styles/Contact.module.css';
import ContentBoxHeader from '../contentBoxHeader';

const AddEmail = ({ }) => {
  const [email, setEmail] = useState('');  // 이메일 상태 추가
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleRegisterEmail = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('https://donggukseoul.com/api/email?email='+JSON.stringify( email ), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),  // 이메일을 body에 포함시켜 보내기
      });

      if (response.status === 200) {
        alert(`이메일 "${email}"이 성공적으로 등록되었습니다!`);
        setEmail('');  // 이메일 상태 초기화
      } else {
        const errorData = await response.json();
        alert(`등록 실패: ${errorData.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('API 호출 에러:', error);
      alert('이메일 등록 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ContentBoxHeader
        icon="mailIcon.png"
        title="새 이메일 등록"
        content="최대 7일의 시간이 소요될 수 있습니다."
      />
      <label>New Email</label>
      <input
        type="text"
        placeholder="0000@000.com"
        value={email}  // 이메일 상태 바인딩
        onChange={(e) => setEmail(e.target.value)}  // 이메일 상태 업데이트
      />

      <button onClick={handleRegisterEmail} disabled={loading}>
        {loading ? '등록 중...' : '등록'}
      </button>
    </div>
  );
};

export default AddEmail;
