import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('로그인 시도:', email);
      await login(email, password);
      console.log('로그인 성공:', email);
      console.log('리다이렉션 경로:', '/design_luka/admin');
      window.location.href = '/design_luka/admin';
    } catch (error) {
      console.error('로그인 실패:', error.message);
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div>
      {/* 로그인 폼 부분 */}
    </div>
  );
};

export default AdminLoginPage; 