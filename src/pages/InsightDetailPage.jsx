import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

import { motion } from 'framer-motion';
import { database } from '../firebase/config';
import { ref, get } from 'firebase/database';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


// Firebase imports (실제 프로젝트에서 사용)
// import { useParams, useNavigate } from 'react-router-dom';
// import { database } from '../firebase/config';
// import { ref, get } from 'firebase/database';

// 실제 프로젝트 적용 방법:
// 1. Router imports 주석 해제
// 2. Firebase 연결 코드 주석 해제  
// 3. Mock data 제거
// 4. useParams()로 URL에서 ID 가져오기
// 5. useNavigate()로 뒤로가기 구현

const InsightDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        console.log('InsightDetailPage: 인사이트 ID로 데이터 요청:', id);
        const insightRef = ref(database, `insights/${id}`);
        const snapshot = await get(insightRef);
        
        if (snapshot.exists()) {
          const rawData = snapshot.val();
          // 기존 데이터에 thumbnail 필드가 없는 경우를 위한 호환성 처리
          const insightData = { 
            id, 
            ...rawData,
            thumbnail: rawData.thumbnail || '', // thumbnail이 없으면 빈 문자열로 설정
            url: rawData.url || '' // url이 없으면 빈 문자열로 설정
          };
          console.log('InsightDetailPage: 받은 인사이트 데이터:', insightData);
          setInsight(insightData);
        } else {
          console.log('InsightDetailPage: 해당 ID의 인사이트를 찾을 수 없음:', id);
          setError('인사이트를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('InsightDetailPage: 인사이트 로드 오류:', error);
        setError('인사이트를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [id]);

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
        return 'bg-black';
      case 'tip':
        return 'bg-black';
      case 'news':
        return 'bg-black';
      default:
        return 'bg-gray-500';
    }
  };

  const handleBackClick = () => {
    navigate('/insight');
  };

  // 안전한 날짜 처리 함수
  const formatDate = (dateValue) => {
    if (!dateValue) {
      return '날짜 없음';
    }

    try {
      let date;
      const trimmedValue = typeof dateValue === 'string' ? dateValue.trim() : String(dateValue);
      
      // 다양한 날짜 형식 처리
      if (typeof dateValue === 'string') {
        // 한글 날짜 형식 처리: "2025년 12월 16일 / 15시 27분 04초" (다양한 공백/슬래시 변형 지원)
        const koreanDateWithTimeMatch = trimmedValue.match(/(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일\s*[\/\s]*\s*(\d{1,2})\s*시\s*(\d{1,2})\s*분\s*(\d{1,2})\s*초/);
        if (koreanDateWithTimeMatch) {
          const year = koreanDateWithTimeMatch[1];
          const month = String(koreanDateWithTimeMatch[2]).padStart(2, '0');
          const day = String(koreanDateWithTimeMatch[3]).padStart(2, '0');
          const hour = String(koreanDateWithTimeMatch[4]).padStart(2, '0');
          const minute = String(koreanDateWithTimeMatch[5]).padStart(2, '0');
          const second = String(koreanDateWithTimeMatch[6]).padStart(2, '0');
          date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
        }
        
        // 한글 날짜 형식 처리 (시간 없음): "2025년 12월 16일"
        const koreanDateMatch = trimmedValue.match(/(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
        if (koreanDateMatch) {
          const year = koreanDateMatch[1];
          const month = String(koreanDateMatch[2]).padStart(2, '0');
          const day = String(koreanDateMatch[3]).padStart(2, '0');
          date = new Date(`${year}-${month}-${day}`);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
        }
        
        // YYYYMMDD HHMMSS 형식 처리
        if (/^\d{8}\s+\d{6}$/.test(trimmedValue)) {
          const year = trimmedValue.substring(0, 4);
          const month = trimmedValue.substring(4, 6);
          const day = trimmedValue.substring(6, 8);
          const hour = trimmedValue.substring(9, 11);
          const minute = trimmedValue.substring(11, 13);
          const second = trimmedValue.substring(13, 15);
          date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
        }
        
        // YYYYMMDD 형식 처리
        if (/^\d{8}$/.test(trimmedValue)) {
          const year = trimmedValue.substring(0, 4);
          const month = trimmedValue.substring(4, 6);
          const day = trimmedValue.substring(6, 8);
          date = new Date(`${year}-${month}-${day}`);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
        }
        
        // ISO 문자열 형식 처리 (YYYY-MM-DD, YYYY-MM-DDTHH:MM:SS 등)
        if (trimmedValue.includes('T') || /^\d{4}-\d{2}-\d{2}/.test(trimmedValue)) {
          date = new Date(trimmedValue);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
        }
        
        // 마지막 시도: JavaScript Date 생성자로 파싱
        date = new Date(trimmedValue);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
      } else if (dateValue instanceof Date) {
        date = dateValue;
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
      } else {
        date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
      }

      // 모든 파싱 시도 실패 시 fallback 처리
      console.warn('Invalid date value:', dateValue);
      if (typeof dateValue === 'string' && dateValue.length > 0) {
        // 한글 날짜 형식이 부분적으로라도 있으면 그 부분만 표시
        const partialMatch = trimmedValue.match(/(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
        if (partialMatch) {
          return `${partialMatch[1]}년 ${partialMatch[2]}월 ${partialMatch[3]}일`;
        }
        // 숫자 패턴이 있으면 추출 시도
        const numberMatch = trimmedValue.match(/(\d{4})[-\/\.]?(\d{1,2})[-\/\.]?(\d{1,2})/);
        if (numberMatch) {
          const year = numberMatch[1];
          const month = String(numberMatch[2]).padStart(2, '0');
          const day = String(numberMatch[3]).padStart(2, '0');
          date = new Date(`${year}-${month}-${day}`);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
        }
        // 숫자만 있는 경우 처음 8자리 추출 시도
        const digitsOnly = trimmedValue.replace(/\D/g, '');
        if (digitsOnly.length >= 8) {
          const year = digitsOnly.substring(0, 4);
          const month = digitsOnly.substring(4, 6);
          const day = digitsOnly.substring(6, 8);
          date = new Date(`${year}-${month}-${day}`);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
        }
      }
      
      return '날짜 정보 없음';
    } catch (error) {
      console.error('Date formatting error:', error, 'Date value:', dateValue);
      // 에러 발생 시에도 원본 값에서 날짜 추출 시도
      if (typeof dateValue === 'string') {
        const partialMatch = dateValue.match(/(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
        if (partialMatch) {
          return `${partialMatch[1]}년 ${partialMatch[2]}월 ${partialMatch[3]}일`;
        }
      }
      return '날짜 정보 없음';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white font-['Noto_Sans_KR']">
        {/* Navbar */}
        <Navbar />
        
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white font-['Noto_Sans_KR']">
        {/* Navbar */}
        <Navbar />

        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
            <button
              onClick={handleBackClick}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors duration-300 font-medium"
            >
              인사이트 목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!insight) {
    return null;
  }

  // Dummy prev/next navigation (replace with real logic if needed)
  const handlePrev = () => {
    // TODO: implement real prev navigation
    window.alert('이전 글로 이동 (구현 필요)');
  };
  const handleNext = () => {
    // TODO: implement real next navigation
    window.alert('다음 글로 이동 (구현 필요)');
  };

  return (
    <div className="min-h-screen bg-white font-['Noto_Sans_KR']">
      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <main className="pt-16">
        {/* Title Section */}
        <section className="py-6">
          <div className="w-full px-4">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-tight font-['Noto_Sans_KR']">
              {insight.title}
            </h1>
          </div>
        </section>

        {/* Content Section */}
        <section className="pb-12 md:pb-16">
          <div className="max-w-3xl mx-auto px-4">
            <div className="prose prose-lg max-w-none font-['Noto_Sans_KR']">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ node, ...props }) => (
                    <div className="my-8">
                      <img
                        {...props}
                        alt={props.alt || '이미지'}
                        className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        loading="lazy"
                        style={{ display: 'block' }}
                      />
                    </div>
                  ),
                  a: ({ node, children, ...props }) => (
                    <a
                      {...props}
                      className="text-blue-600 hover:text-blue-800 border-b border-blue-300 hover:border-blue-600 transition-colors duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children || '링크'}
                    </a>
                  ),
                  h1: ({ node, ...props }) => (
                    <h1 {...props} className="text-3xl font-bold text-gray-900 mb-6 mt-8 font-['Noto_Sans_KR']" />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 {...props} className="text-2xl font-bold text-gray-900 mb-4 mt-6 font-['Noto_Sans_KR']" />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 {...props} className="text-xl font-bold text-gray-900 mb-3 mt-4 font-['Noto_Sans_KR']" />
                  ),
                  p: ({ node, ...props }) => (
                    <p {...props} className="text-gray-700 leading-relaxed mb-6 text-lg font-['Noto_Sans_KR']" />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul {...props} className="list-disc pl-6 mb-6 space-y-2 font-['Noto_Sans_KR']" />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol {...props} className="list-decimal pl-6 mb-6 space-y-2 font-['Noto_Sans_KR']" />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote {...props} className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-6 bg-gray-50 p-4 rounded-r-lg font-['Noto_Sans_KR']" />
                  ),
                  code: ({ node, inline, ...props }) => {
                    if (inline) {
                      return (
                        <code {...props} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800" />
                      );
                    }
                    return (
                      <pre>
                        <code {...props} className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono" />
                      </pre>
                    );
                  }
                }}
              >
                {insight.content}
              </ReactMarkdown>
            </div>
          </div>
        </section>

        {/* Prev/Next Navigation */}
        <section className="pb-12">
          <div className="max-w-3xl mx-auto px-4 flex justify-between items-center">
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group text-lg font-bold"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              이전 글
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group text-lg font-bold"
            >
              다음 글
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default InsightDetailPage;
export default InsightDetailPage;