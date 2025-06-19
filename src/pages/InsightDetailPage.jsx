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
        return 'bg-blue-500';
      case 'tip':
        return 'bg-green-500';
      case 'news':
        return 'bg-purple-500';
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
      
      // 다양한 날짜 형식 처리
      if (typeof dateValue === 'string') {
        // YYYYMMDD HHMMSS 형식 처리
        if (/^\d{8}\s\d{6}$/.test(dateValue)) {
          const year = dateValue.substring(0, 4);
          const month = dateValue.substring(4, 6);
          const day = dateValue.substring(6, 8);
          const hour = dateValue.substring(9, 11);
          const minute = dateValue.substring(11, 13);
          const second = dateValue.substring(13, 15);
          date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
        }
        // YYYYMMDD 형식 처리
        else if (/^\d{8}$/.test(dateValue)) {
          const year = dateValue.substring(0, 4);
          const month = dateValue.substring(4, 6);
          const day = dateValue.substring(6, 8);
          date = new Date(`${year}-${month}-${day}`);
        }
        // ISO 문자열 형식 처리
        else if (dateValue.includes('T') || dateValue.includes('-')) {
          date = new Date(dateValue);
        }
        // 기타 문자열 형식
        else {
          date = new Date(dateValue);
        }
      } else if (dateValue instanceof Date) {
        date = dateValue;
      } else {
        date = new Date(dateValue);
      }

      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        console.warn('Invalid date value:', dateValue);
        return '날짜 형식 오류';
      }

      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error, 'Date value:', dateValue);
      return '날짜 처리 오류';
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

  return (
    <div className="min-h-screen bg-white font-['Noto_Sans_KR']">
      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <main className="pt-16">
        {/* Back Button Section */}
        <section className="py-6 border-b border-gray-100">
          <div className="w-full px-4">
            <motion.button
              onClick={handleBackClick}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ x: -4 }}
            >
              <svg 
                className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">인사이트 목록으로</span>
            </motion.button>
          </div>
        </section>

        {/* Hero Image Section */}
        <section className="relative">
          {/* Title Section */}
          <div className="p-6 md:p-8 bg-white">
            <div className="max-w-4xl mx-auto">
              <motion.h1
                className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {insight.title}
              </motion.h1>
              <motion.div
                className="flex items-center gap-4 text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <span className="text-sm font-medium">
                  {formatDate(insight.date)}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Category Badge */}
          <motion.div
            className="absolute top-6 right-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className={`${getCategoryColor(insight.category)} text-white text-sm px-4 py-2 rounded-full font-medium`}>
              {getCategoryLabel(insight.category)}
            </span>
          </motion.div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Main Content */}
              <motion.div
                className="lg:col-span-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h1:mb-6 prose-h2:text-2xl prose-h2:mb-4 prose-h3:text-xl prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-strong:text-gray-900 prose-strong:font-semibold prose-em:text-gray-800 prose-em:italic prose-a:text-blue-600 prose-a:no-underline prose-a:border-b prose-a:border-blue-300 hover:prose-a:border-blue-600 prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8 prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:mb-2 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // 이미지 컴포넌트 커스터마이징
                      img: ({ node, ...props }) => (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6 }}
                          className="my-8"
                        >
                          <img
                            {...props}
                            alt={props.alt || '이미지'}
                            className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <div 
                            className="hidden text-center p-4 bg-gray-100 rounded-lg text-gray-500"
                            style={{display: 'none'}}
                          >
                            이미지를 불러올 수 없습니다.
                          </div>
                        </motion.div>
                      ),
                      // 링크 컴포넌트 커스터마이징
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
                      // 제목 컴포넌트들에 애니메이션 추가
                      h1: ({ node, ...props }) => (
                        <motion.h1
                          {...props}
                          className="text-3xl font-bold text-gray-900 mb-6 mt-8"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <motion.h2
                          {...props}
                          className="text-2xl font-bold text-gray-900 mb-4 mt-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <motion.h3
                          {...props}
                          className="text-xl font-bold text-gray-900 mb-3 mt-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        />
                      ),
                      // 단락에 애니메이션 추가
                      p: ({ node, ...props }) => (
                        <motion.p
                          {...props}
                          className="text-gray-700 leading-relaxed mb-6 text-lg"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                        />
                      ),
                      // 목록에 애니메이션 추가
                      ul: ({ node, ...props }) => (
                        <motion.ul
                          {...props}
                          className="list-disc pl-6 mb-6 space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <motion.ol
                          {...props}
                          className="list-decimal pl-6 mb-6 space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                        />
                      ),
                      // 인용구 스타일링
                      blockquote: ({ node, ...props }) => (
                        <motion.blockquote
                          {...props}
                          className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-6 bg-gray-50 p-4 rounded-r-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                        />
                      ),
                      // 코드 블록 스타일링
                      code: ({ node, inline, ...props }) => {
                        if (inline) {
                          return (
                            <code
                              {...props}
                              className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800"
                            />
                          );
                        }
                        return (
                          <motion.pre
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                          >
                            <code
                              {...props}
                              className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono"
                            />
                          </motion.pre>
                        );
                      }
                    }}
                  >
                    {insight.content}
                  </ReactMarkdown>
                </div>

                {/* Related URL */}
                {insight.url && (
                  <motion.div
                    className="mt-12 p-6 bg-gray-50 rounded-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      관련 링크
                    </h3>
                    <a
                      href={insight.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700 transition-colors duration-200 font-medium"
                    >
                      <span>원문 보기</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </motion.div>
                )}
              </motion.div>

              {/* Sidebar */}
              <motion.div
                className="lg:col-span-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="sticky top-24 space-y-8">
                  
                  {/* Article Info */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">글 정보</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">카테고리</span>
                        <span className="font-medium text-gray-900">{getCategoryLabel(insight.category)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">발행일</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(insight.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Share Section */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">공유하기</h3>
                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm font-medium">
                        Facebook
                      </button>
                      <button className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors duration-200 text-sm font-medium">
                        Twitter
                      </button>
                      <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 text-sm font-medium">
                        Link
                      </button>
                    </div>
                  </div>

                  {/* Related Articles */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">관련 글</h3>
                    <div className="space-y-4">
                      <div className="group cursor-pointer">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
                          작은 공간을 넓게 보이는 10가지 비법
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">인테리어 팁</p>
                      </div>
                      <div className="group cursor-pointer">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
                          미니멀리즘을 넘어선 맥시멀리즘의 부상
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">트렌드</p>
                      </div>
                      <div className="group cursor-pointer">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
                          조명이 공간에 미치는 심리적 효과
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">인테리어 팁</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-xl font-bold mb-4">DESIGN LUKA</div>
          <p className="text-gray-400 font-['Noto_Sans_KR']">
            공간에 생명을 불어넣는 디자인
          </p>
        </div>
      </footer>
    </div>
  );
};

export default InsightDetailPage;