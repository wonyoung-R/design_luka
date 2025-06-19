// components/admin/InsightManagement.jsx - 업데이트된 버전
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { database } from '../../firebase/config';
import { ref, onValue, remove } from 'firebase/database';
import { useAuth } from '../../contexts/AuthContext';
import InsightEditor from './InsightEditor';

const InsightManagement = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [insights, setInsights] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/admin/login');
      return;
    }

    // insights 데이터 구독
    const insightsRef = ref(database, 'insights');
    const unsubscribe = onValue(insightsRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Received insights data:', data);
      if (data) {
        const insightsList = Object.entries(data).map(([id, insight]) => ({
          id,
          ...insight
        }));
        setInsights(insightsList.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)));
      } else {
        setInsights([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, navigate]);

  const handleDelete = async (insightId) => {
    if (window.confirm('정말로 이 인사이트를 삭제하시겠습니까?')) {
      try {
        const insightRef = ref(database, `insights/${insightId}`);
        await remove(insightRef);
        alert('인사이트가 삭제되었습니다.');
      } catch (error) {
        console.error('Error deleting insight:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'trend':
        return '트렌드';
      case 'tip':
        return '인테리어 팁';
      case 'news':
        return '뉴스';
      default:
        return category;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'trend':
        return 'bg-blue-100 text-blue-800';
      case 'tip':
        return 'bg-green-100 text-green-800';
      case 'news':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 마크다운 미리보기를 위한 간단한 변환
  const getPreviewText = (content) => {
    if (!content) return '';
    
    // 마크다운 제거 및 텍스트만 추출
    const cleanText = content
      .replace(/!\[.*?\]\(.*?\)/g, '[이미지]') // 이미지
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 링크
      .replace(/#{1,6}\s+/g, '') // 헤딩
      .replace(/\*\*(.*?)\*\*/g, '$1') // 굵은 텍스트
      .replace(/\*(.*?)\*/g, '$1') // 기울임
      .replace(/^-\s+/gm, '• ') // 목록
      .trim();
    
    return cleanText.length > 100 ? cleanText.substring(0, 100) + '...' : cleanText;
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    
    // YYYYMMDD HHMMSS 형식을 읽기 쉬운 형식으로 변환
    if (dateStr.length === 15 && dateStr.includes(' ')) {
      const [datePart, timePart] = dateStr.split(' ');
      if (datePart.length === 8 && timePart.length === 6) {
        const year = datePart.substring(0, 4);
        const month = datePart.substring(4, 6);
        const day = datePart.substring(6, 8);
        const hour = timePart.substring(0, 2);
        const minute = timePart.substring(2, 4);
        
        return `${year}.${month}.${day} ${hour}:${minute}`;
      }
    }
    
    return dateStr;
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
  };

  const handleEditorSave = () => {
    setIsEditorOpen(false);
    // 데이터는 자동으로 실시간 업데이트됨
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">인사이트 관리</h1>
            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
            >
              ✏️ 새 인사이트 작성
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {insights.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 인사이트가 없습니다</h3>
                <p className="text-gray-500 mb-6">첫 번째 인사이트를 작성해보세요!</p>
                <button
                  onClick={() => setIsEditorOpen(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  인사이트 작성하기
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {insights.map((insight) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="p-6">
                      {/* 헤더 */}
                      <div className="flex items-start justify-between mb-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(insight.category)}`}>
                          {getCategoryLabel(insight.category)}
                        </span>
                        <button
                          onClick={() => handleDelete(insight.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="삭제"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* 제목 */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {insight.title}
                      </h3>

                      {/* 날짜 */}
                      <p className="text-sm text-gray-500 mb-3">
                        {formatDisplayDate(insight.date)}
                      </p>

                      {/* 내용 미리보기 */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {getPreviewText(insight.content)}
                      </p>

                      {/* URL 링크 */}
                      {insight.url && (
                        <a
                          href={insight.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          링크 보기
                        </a>
                      )}

                      {/* 액션 버튼들 */}
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-400">
                          ID: {insight.id.substring(0, 8)}...
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              // 여기에 편집 기능 추가 가능
                              alert('편집 기능은 추후 구현 예정입니다.');
                            }}
                            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                          >
                            편집
                          </button>
                          <button
                            onClick={() => handleDelete(insight.id)}
                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Insight Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <InsightEditor
            onClose={handleEditorClose}
            onSave={handleEditorSave}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default InsightManagement;