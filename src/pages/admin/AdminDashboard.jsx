import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { runDataMigration } from '../../utils/updateExistingInsights';

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-100">
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
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
                  (구현준비중) 주거/상업 프로젝트를 관리하고 새로운 프로젝트를 등록할 수 있습니다.
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
                  (이미지 구현 진행중)
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

            {/* Data Migration Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">데이터 업데이트</h2>
                <p className="text-gray-500 mb-4">
                  기존 인사이트 데이터에 thumbnail과 url 필드를 추가하여 새로운 기능과 호환되도록 합니다.
                </p>
                <button
                  onClick={handleDataMigration}
                  className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                >
                  기존 데이터 업데이트
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 