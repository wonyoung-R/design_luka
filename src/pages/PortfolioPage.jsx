import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { FunnelIcon } from '@heroicons/react/24/outline';

const tabs = [
  { id: 'residential', label: '주거 공간' },
  { id: 'commercial', label: '상업 공간' }
];

export default function PortfolioPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('residential');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    area: [],
    type: []
  });

  useEffect(() => {
    // URL 경로에 따라 activeTab 설정
    const path = location.pathname;
    if (path.includes('/portfolio/residential')) {
      setActiveTab('residential');
    } else if (path.includes('/portfolio/commercial')) {
      setActiveTab('commercial');
    } else {
      setActiveTab('residential'); // 기본값
    }
  }, [location]);

  // Filter options
  const filterOptions = {
    residential: {
      area: ['20평 미만', '20-30평', '30-40평', '40평 이상']
    },
    commercial: {
      type: ['카페', '레스토랑', '사무실', '상가', '뷰티샵']
    }
  };

  // Sample portfolio data
  const portfolioData = {
    residential: [
      {
        id: 1,
        title: '신반포 APT 25py',
        location: '서초구 반포동',
        area: '25평',
        type: '아파트',
        style: '모던 미니멀',
        image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 2,
        title: '관악 드림타운 33py',
        location: '관악구 신림동',
        area: '33평',
        type: '아파트',
        style: '스칸디나비안',
        image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 3,
        title: '강남 타워팰리스',
        location: '강남구 도곡동',
        area: '45평',
        type: '아파트',
        style: '럭셔리 클래식',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 4,
        title: '서초 래미안',
        location: '서초구 서초동',
        area: '28평',
        type: '아파트',
        style: '모던 컨템포러리',
        image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      }
    ],
    commercial: [
      {
        id: 101,
        title: '강남 카페',
        location: '강남구 역삼동',
        area: '35평',
        type: '카페',
        style: '모던 인더스트리얼',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 102,
        title: '서초 오피스 리모델링',
        location: '서초구 서초동',
        area: '50평',
        type: '사무실',
        style: '모던 오피스',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 103,
        title: '압구정 뷰티샵',
        location: '강남구 압구정동',
        area: '15평',
        type: '뷰티샵',
        style: '미니멀 럭셔리',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 104,
        title: '송파 레스토랑',
        location: '송파구 잠실동',
        area: '35평',
        type: '레스토랑',
        style: '모던 클래식',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      }
    ]
  };

  // Filter projects based on selected filters
  const filteredProjects = (projects) => {
    return projects.filter(project => {
      if (activeTab === 'residential') {
        const areaMatch = selectedFilters.area.length === 0 || 
          selectedFilters.area.some(area => {
            if (area === '20평 미만') return parseInt(project.area) < 20;
            if (area === '20-30평') return parseInt(project.area) >= 20 && parseInt(project.area) < 30;
            if (area === '30-40평') return parseInt(project.area) >= 30 && parseInt(project.area) < 40;
            if (area === '40평 이상') return parseInt(project.area) >= 40;
            return false;
          });
        return areaMatch;
      } else {
        const typeMatch = selectedFilters.type.length === 0 || 
          selectedFilters.type.includes(project.type);
        return typeMatch;
      }
    });
  };

  const toggleFilter = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const getProjectsToShow = () => {
    switch (activeTab) {
      case 'residential':
        return filteredProjects(portfolioData.residential);
      case 'commercial':
        return filteredProjects(portfolioData.commercial);
      default:
        return filteredProjects(portfolioData.residential);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 font-['Noto_Sans_KR']">
        {/* Hero Section */}
        <section className="section bg-black text-white min-h-[175px] flex items-start py-12">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Portfolio
              </motion.h1>
              <motion.p
                className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                DESIGN LUKA의 프로젝트를 소개합니다
              </motion.p>
            </div>
          </div>
        </section>

        {/* Portfolio Content */}
        <section className="section bg-white">
          <div className="container">
            {/* Filter Tabs */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    // URL 업데이트
                    const newPath = `/portfolio/${tab.id}`;
                    window.history.pushState({}, '', newPath);
                  }}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>

            <LayoutGroup>
              {/* Filter Button and Panel Container */}
              <motion.div 
                className="flex justify-end mb-8 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <span>필터</span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${
                        showFilters ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Filter Panel */}
                  <AnimatePresence mode="wait">
                    {showFilters && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white/60 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden z-10"
                      >
                        <motion.div
                          layout
                          className="p-4"
                        >
                          {activeTab === 'residential' ? (
                            <div>
                              <h4 className="font-medium mb-2">평수</h4>
                              <div className="space-y-2">
                                {filterOptions.residential.area.map((area) => (
                                  <label key={area} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={selectedFilters.area.includes(area)}
                                      onChange={() => toggleFilter('area', area)}
                                      className="mr-2"
                                    />
                                    {area}
                                  </label>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h4 className="font-medium mb-2">공간 유형</h4>
                              <div className="space-y-2">
                                {filterOptions.commercial.type.map((type) => (
                                  <label key={type} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={selectedFilters.type.includes(type)}
                                      onChange={() => toggleFilter('type', type)}
                                      className="mr-2"
                                    />
                                    {type}
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Projects Grid */}
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8"
              >
                {getProjectsToShow().map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    className="group relative overflow-hidden bg-black"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                  >
                    <Link to={`/portfolio/${activeTab}/${project.id}`} className="block">
                      <div className="relative h-48 sm:h-56 md:h-64">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 text-white">
                          <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{project.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-300">{project.location}</p>
                          <p className="text-xs sm:text-sm text-gray-300">{project.style}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </LayoutGroup>
          </div>
        </section>

        {/* Floating CTA Button */}
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-[#2C3E50] text-white rounded-lg hover:bg-[#34495E] transition-colors duration-300"
            onClick={() => window.location.href = '/contact'}
          >
            이런 공간 우리도 가능할까요?
          </motion.button>
        </motion.div>
      </main>
      {/* <Footer /> */}
    </>
  );
}
