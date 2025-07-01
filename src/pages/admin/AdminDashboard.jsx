import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { runDataMigration } from '../../utils/updateExistingInsights';

const CLOUDINARY_API_KEY = '324293491948238';
const CLOUDINARY_API_SECRET = 'Mb8GBN8qaPzHmKpmapoBCXIwD_A';
const CLOUDINARY_CLOUD_NAME = 'dti1gtd3u';

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Cloudinary 사용량 상태
  const [cloudinaryUsage, setCloudinaryUsage] = useState(null);
  const [cloudinaryError, setCloudinaryError] = useState(null);

  useEffect(() => {
    // Cloudinary 사용량 fetch (간단한 demo, 실제 서비스에서는 서버 프록시 필요)
    const fetchCloudinaryUsage = async () => {
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/usage`,
          {
            headers: {
              Authorization: 'Basic ' + btoa(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`)
            }
          }
        );
        if (!response.ok) throw new Error('Cloudinary API 오류');
        const data = await response.json();
        setCloudinaryUsage(data);
      } catch (err) {
        setCloudinaryError('Cloudinary 사용량 정보를 불러올 수 없습니다.');
      }
    };
    fetchCloudinaryUsage();
  }, []);

  // 인증 상태 확인
  useEffect(() => {
    if (!currentUser) {
      navigate('/admin/login', { replace: true });
    }
  }, [currentUser, navigate]);

  // URL이 잘못된 경우 메인 페이지로 리다이렉트
  useEffect(() => {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    
    // 잘못된 admin 경로나 해시가 있는 경우 처리
    if (currentPath !== '/admin' && currentPath.startsWith('/admin')) {
      navigate('/admin', { replace: true });
    }
    
    // 해시가 있는 경우 제거
    if (currentHash && currentHash !== '#/admin') {
      window.history.replaceState(null, '', '/admin');
    }
  }, [navigate]);

  // 로딩 중이거나 인증되지 않은 경우
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleDataMigration = () => {
    if (window.confirm('기존 인사이트 데이터에 thumbnail과 url 필드를 추가하시겠습니까?\n\n이 작업은 기존 데이터를 수정합니다.')) {
      runDataMigration();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Cloudinary 사용량 표시 */}
      <div className="w-full bg-blue-50 border-b border-blue-200 py-2 px-4 text-sm text-blue-900 flex flex-col md:flex-row md:items-center md:justify-between gap-1">
        <div>
          <b>Cloudinary 사용량</b> {' '}
          {cloudinaryUsage ? (
            <>
              저장공간: {(cloudinaryUsage.storage?.usage || 0) / 1024 / 1024} GB /
              {cloudinaryUsage.storage?.limit ? (cloudinaryUsage.storage.limit / 1024 / 1024) + ' GB' : '무제한'}
              &nbsp;|&nbsp;
              트래픽: {(cloudinaryUsage.bandwidth?.usage || 0) / 1024 / 1024} GB /
              {cloudinaryUsage.bandwidth?.limit ? (cloudinaryUsage.bandwidth.limit / 1024 / 1024) + ' GB' : '무제한'}
              {cloudinaryUsage.credit_usage && (
                <>
                  &nbsp;|&nbsp;
                  <b>Credit Usage (30일):</b> {cloudinaryUsage.credit_usage.used} / {cloudinaryUsage.credit_usage.limit} {cloudinaryUsage.credit_usage.unit}
                </>
              )}
            </>
          ) : cloudinaryError ? (
            <span className="text-red-500">{cloudinaryError}</span>
          ) : (
            <span>로딩 중...</span>
          )}
        </div>
      </div>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Portfolio Management Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">포트폴리오 관리</h2>
                <p className="text-gray-500 mb-4">
                  주거/상업 프로젝트를 관리하고 새로운 프로젝트를 등록할 수 있습니다.
                </p>
                <button
                  onClick={() => navigate('/admin/portfolio')}
                  className="w-full px-4 py-2 bg-[#2C3E50] text-white rounded-md hover:bg-[#34495E] transition-colors"
                >
                  포트폴리오 관리하기
                </button>
              </div>
            </motion.div>

            {/* Insight Management Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">인사이트 관리</h2>
                <p className="text-gray-500 mb-4">
                  트렌드, 인테리어 팁, 뉴스 등의 콘텐츠를 관리할 수 있습니다.
                </p>
                <button
                  onClick={() => navigate('/admin/insight')}
                  className="w-full px-4 py-2 bg-[#2C3E50] text-white rounded-md hover:bg-[#34495E] transition-colors"
                >
                  인사이트 관리하기
                </button>
              </div>
            </motion.div>

            {/* Q&A Sheet Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Q&amp;A 결과 보기</h2>
                <p className="text-gray-500 mb-4">
                  문의/리드 결과를 구글 시트에서 실시간으로 확인할 수 있습니다.<br />
                  <span className="text-xs text-gray-400"> 🔐 구글 로그인 정보 : brucekim2377 / Luka2377! </span>
                </p>
                <a
                  href="https://docs.google.com/spreadsheets/d/1gkwg3WZW_0F9NIfo8Bit7PkXwAdrbBTqp-4KgpdVdZw/edit?gid=0#gid=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block px-4 py-2 bg-green-600 text-white rounded-md text-center hover:bg-green-700 transition-colors"
                >
                  구글 시트 바로가기
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      {/* 관리자 연락처 하단 고정 */}
      <footer className="w-full bg-gray-900 text-white text-center py-4 mt-auto">
        관리자 : 유원영 &nbsp;|&nbsp; 010-8569-7271
      </footer>
    </div>
  );
};

export default AdminDashboard; 