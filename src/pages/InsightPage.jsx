import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { motion, LayoutGroup } from 'framer-motion';
import { Link } from 'react-router-dom';
import { database } from '../firebase/config';
import { ref, onValue } from 'firebase/database';
import { insightsRef } from '../firebase/config';
import { addTestInsights } from '../utils/testData';
import InsightDetailModal from './InsightDetailModal';
import lukaSlogan from '../images/aboutluka/LUKA slogan.png';


// Firebase imports (실제 프로젝트에서 사용)
//import { database, insightsRef } from '../firebase/config';
//import { onValue } from 'firebase/database';

export default function InsightPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInsightIndex, setSelectedInsightIndex] = useState(null);

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
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error, 'Date value:', dateValue);
      return '날짜 처리 오류';
    }
  };

  // 랜덤 aspect ratio 생성 (Firebase 데이터에 aspectRatio가 없을 때 사용)
  const getRandomAspectRatio = () => {
    const ratios = [
      'aspect-[3/4]',   // 세로형
      'aspect-[4/3]',   // 가로형  
      'aspect-[1/1]',   // 정사각형
      'aspect-[4/5]',   // 약간 세로형
      'aspect-[5/4]',   // 약간 가로형
      'aspect-[2/3]',   // 세로형
      'aspect-[3/2]',   // 가로형
      'aspect-[16/10]', // 와이드
    ];
    return ratios[Math.floor(Math.random() * ratios.length)];
  };

  // content에서 첫 번째 이미지 URL 추출 함수
  const extractFirstImageUrl = (content) => {
    if (!content) return null;
    
    // 마크다운 이미지 문법 ![alt](url) 패턴 매칭
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const matches = imageRegex.exec(content);
    
    if (matches && matches[2]) {
      return matches[2]; // URL 부분 반환
    }
    
    // HTML img 태그도 지원 <img src="url">
    const htmlImageRegex = /<img[^>]+src\s*=\s*['"]\s*([^'"]+)\s*['"]/i;
    const htmlMatches = htmlImageRegex.exec(content);
    
    if (htmlMatches && htmlMatches[1]) {
      return htmlMatches[1];
    }
    
    return null;
  };

  // 기본 placeholder 이미지 생성 함수
  const getPlaceholderImage = (index, category) => {
    // 카테고리별 기본 이미지 설정
    const categoryImages = {
      'trend': [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
        'https://images.unsplash.com/photo-1600210492493-0946911123ea',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea'
      ],
      'tip': [
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
        'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c'
      ],
      'news': [
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87'
      ]
    };

    const categoryImageList = categoryImages[category] || categoryImages['trend'];
    const imageIndex = index % categoryImageList.length;
    return `${categoryImageList[imageIndex]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
  };

  // 섬네일 이미지 URL 가져오기
  const getThumbnailUrl = (insight, index) => {
    // 1. content에서 이미지 URL 추출 시도
    const extractedImage = extractFirstImageUrl(insight.content);
    if (extractedImage) {
      return extractedImage;
    }
    
    // 2. thumbnail 필드가 있는 경우
    if (insight.thumbnail) {
      return insight.thumbnail;
    }
    
    // 3. 기본 placeholder 이미지 사용
    return getPlaceholderImage(index, insight.category);
  };

  // 이미지 로드 에러 처리
  const handleImageError = (e, insight, index) => {
    console.log('이미지 로드 실패:', e.target.src);
    
    // 구글 드라이브 이미지인 경우 대안 URL 시도
    const originalSrc = e.target.src;
    if (originalSrc.includes('drive.google.com')) {
      const fileIdMatch = originalSrc.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        const alternatives = [
          `https://drive.google.com/uc?id=${fileId}`,
          `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
          `https://lh3.googleusercontent.com/d/${fileId}`
        ];
        
        // 현재 URL이 아닌 다른 대안 시도
        const currentAltIndex = alternatives.findIndex(alt => alt === originalSrc);
        const nextAltIndex = currentAltIndex + 1;
        
        if (nextAltIndex < alternatives.length) {
          e.target.src = alternatives[nextAltIndex];
          return;
        }
      }
    }
    
    // 모든 대안이 실패하면 placeholder 이미지 사용
    e.target.src = getPlaceholderImage(index, insight.category);
  };

  // Firebase 데이터 로드
  useEffect(() => {
    console.log('InsightPage: Firebase 데이터 로드 시작');
    console.log('InsightPage: Firebase config 확인:', database);
    console.log('InsightPage: insightsRef 경로:', insightsRef().toString());
    
    const unsubscribe = onValue(insightsRef(), (snapshot) => {
      try {
        const data = snapshot.val();
        console.log('InsightPage: Firebase에서 받은 데이터:', data);
        console.log('InsightPage: 데이터 타입:', typeof data);
        console.log('InsightPage: 데이터가 null인가?', data === null);
        console.log('InsightPage: 데이터가 undefined인가?', data === undefined);
        
        if (data) {
          const insightsList = Object.entries(data).map(([id, insight]) => ({
            id,
            ...insight,
            date: insight.date || new Date().toISOString().split('T')[0],
            thumbnail: insight.thumbnail || '', // thumbnail이 없으면 빈 문자열로 설정
            url: insight.url || '', // url이 없으면 빈 문자열로 설정
            // aspectRatio는 동적으로 생성하거나 데이터에 포함
            aspectRatio: insight.aspectRatio || getRandomAspectRatio()
          }));
          // 날짜 순으로 정렬 (최신순)
          setInsights(insightsList.sort((a, b) => new Date(b.date) - new Date(a.date)));
          console.log('InsightPage: 처리된 인사이트 목록:', insightsList);
        } else {
          console.log('InsightPage: Firebase에서 데이터가 없습니다');
          setInsights([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('InsightPage: 데이터 처리 오류:', error);
        setInsights([]);
        setLoading(false);
      }
    }, (error) => {
      console.error('InsightPage: Firebase 연결 오류:', error);
      console.error('InsightPage: 오류 상세 정보:', error.code, error.message);
      // 네트워크 오류 등 처리
      setInsights([]);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const tabs = [
    { id: 'all', label: '전체' },
    { id: 'trend', label: '트렌드' },
    { id: 'tip', label: '인테리어 팁' },
    { id: 'news', label: '뉴스' }
  ];

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

  // Extract preview text
  const extractPreviewText = (content) => {
    if (!content) return '';
    
    // Remove markdown images
    let text = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '');
    
    // Remove markdown links (keep text only)
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    // Remove markdown headings
    text = text.replace(/^#{1,6}\s+/gm, '');
    
    // Remove markdown bold/italic
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    text = text.replace(/\*(.*?)\*/g, '$1');
    
    // Remove HTML tags
    text = text.replace(/<[^>]*>/g, '');
    
    // Multiple spaces/newlines to single space
    text = text.replace(/\s+/g, ' ').trim();
    
    // Limit to 120 characters
    return text.length > 120 ? text.substring(0, 120) + '...' : text;
  };

  const filteredInsights = activeTab === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === activeTab);

  // Modal open/close handlers
  const openModal = (index) => {
    setSelectedInsightIndex(index);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInsightIndex(null);
  };
  // Prev/Next navigation
  const handlePrev = () => {
    if (selectedInsightIndex > 0) {
      setSelectedInsightIndex(selectedInsightIndex - 1);
    }
  };
  const handleNext = () => {
    if (selectedInsightIndex < filteredInsights.length - 1) {
      setSelectedInsightIndex(selectedInsightIndex + 1);
    }
  };

  // ESC/뒤로가기 핸들링
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Masonry layout component
  const MasonryGrid = ({ insights }) => {
    return (
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {insights.map((insight, index) => (
          <motion.article
            key={insight.id}
            className="break-inside-avoid mb-6 group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            onClick={() => openModal(index)}
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
              {/* Thumbnail */}
              <div className={`relative overflow-hidden ${insight.aspectRatio || 'aspect-[4/5]'}`}>
                <img
                  src={getThumbnailUrl(insight, index)}
                  alt={insight.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => handleImageError(e, insight, index)}
                  loading="lazy"
                />
                
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Category badge */}
                <div className="absolute top-4 right-4">
                  <span className={`${getCategoryColor(insight.category)} text-white text-xs px-3 py-1 rounded-full font-medium font-['Noto_Sans_KR']`}>
                    {getCategoryLabel(insight.category)}
                  </span>
                </div>
                
                {/* 이미지 로딩 시 배경 표시 */}
                <div className="absolute inset-0 bg-gray-200 -z-10"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Date */}
                <div className="text-sm text-gray-500 mb-3 font-['Noto_Sans_KR']">
                  {formatDate(insight.date)}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-3 line-clamp-2 text-gray-900 group-hover:text-gray-700 transition-colors font-['Noto_Sans_KR']">
                  {insight.title}
                </h3>

                {/* Preview */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 font-['Noto_Sans_KR']">
                  {extractPreviewText(insight.content)}
                </p>

                {/* Read more */}
                <div className="mt-4">
                  <span className="text-gray-900 text-sm font-medium group-hover:text-gray-600 transition-colors font-['Noto_Sans_KR']">
                    자세히 보기 →
                  </span>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    );
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

  // Empty state
  if (insights.length === 0) {
    return (
      <div className="min-h-screen bg-white font-['Noto_Sans_KR']">
        {/* Navbar */}
        <Navbar />

        <main className="pt-16 py-0">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="w-full px-4">
              <motion.div
                className="text-center max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
                  Design
                  <span className="block text-4xl md:text-5xl font-light text-gray-600 mt-2">
                    Insights
                  </span>
                </h1>
                <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
                  영감을 주는 공간 이야기
                </p>
              </motion.div>
            </div>
          </section>
          
          <section className="py-12">
            <div className="w-full px-4">
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">등록된 인사이트가 없습니다.</p>
                <button
                  onClick={async () => {
                    console.log('테스트 데이터 추가 버튼 클릭됨');
                    const success = await addTestInsights();
                    if (success) {
                      alert('테스트 데이터가 추가되었습니다. 페이지를 새로고침해주세요.');
                    } else {
                      alert('테스트 데이터 추가에 실패했습니다.');
                    }
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  테스트 데이터 추가
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Main render
  return (
    <div className="flex flex-col min-h-screen bg-white font-['Noto_Sans_KR']">
      {/* Navbar */}
      <Navbar />
      

      {/* Main Content */}
      <main className="flex-1 pt-16 py-0 font-['Noto_Sans_KR']">
        {/* Hero Section - Simplified */}
        <section className="py-0 bg-gradient-to-br from-gray-50 to-white font-['Noto_Sans_KR']">
          <div className="w-full px-4">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-['Noto_Sans_KR']">Insight and Contents</h1>
            </motion.div>
          </div>
          <section className="py-8"></section>
        </section>

        {/* Content Section */}
        <section className="">
          <div className="w-full px-4">
            <div className="flex flex-col lg:flex-row gap-8 font-['Noto_Sans_KR']">
              
              {/* Left Sidebar - 3/12 */}
              <div className="lg:w-3/12 pl-4 font-['Noto_Sans_KR']">
                <div className="sticky top-24 space-y-8">
                  
                  {/* Category Navigation */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 font-['Noto_Sans_KR']">
                      카테고리
                    </h3>
                    <LayoutGroup>
                      {tabs.map((tab, index) => (
                        <motion.button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden font-['Noto_Sans_KR'] ${
                            activeTab === tab.id
                              ? 'text-white'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Background */}
                          <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                            activeTab === tab.id
                              ? 'bg-gray-900 scale-100'
                              : 'bg-gray-50 scale-95 hover:scale-100 hover:bg-gray-100'
                          }`} />
                          
                          {/* Text */}
                          <span className="relative z-10 font-['Noto_Sans_KR']">{tab.label}</span>
                          
                          {/* Active indicator */}
                          {activeTab === tab.id && (
                            <motion.div
                              className="absolute right-3 top-1/2 w-2 h-2 bg-white rounded-full"
                              layoutId="activeCategory"
                              style={{ transform: 'translateY(-50%)' }}
                            />
                          )}
                        </motion.button>
                      ))}
                    </LayoutGroup>
                  </motion.div>
                </div>
              </div>

              {/* Right Content - 9/12 */}
              <div className="lg:w-9/12 pr-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {filteredInsights.length > 0 ? (
                    <MasonryGrid insights={filteredInsights} />
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600 font-['Noto_Sans_KR']">
                        {activeTab === 'all' ? '등록된 인사이트가 없습니다.' : `${getCategoryLabel(activeTab)} 카테고리에 등록된 인사이트가 없습니다.`}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center flex justify-center items-center">
          <img 
            src={lukaSlogan} 
            alt="LUKA Slogan" 
            className="w-[25%] h-auto object-contain filter invert brightness-0"
          />
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && selectedInsightIndex !== null && (
        <InsightDetailModal
          insight={filteredInsights[selectedInsightIndex]}
          onClose={closeModal}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
}