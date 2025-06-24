import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { database } from '../firebase/config';
import { ref, onValue } from 'firebase/database';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { submitQnAForm } from '../utils/googleSheetsApi';



const tabs = [
  { id: 'residential', label: '주거 공간' },
  { id: 'commercial', label: '상업 공간' }
];

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState('residential');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [portfolioData, setPortfolioData] = useState({ residential: [], commercial: [] });
  const [selectedFilters, setSelectedFilters] = useState({
    area: [],
    type: []
  });

  // Filter options
  const filterOptions = {
    residential: {
      area: ['20평 미만', '20-30평', '30-40평', '40평 이상']
    },
    commercial: {
      type: ['카페', '레스토랑', '사무실', '상가', '뷰티샵']
    }
  };

  const businessTypeLabels = {
    cafe: '카페',
    restaurant: '레스토랑',
    office: '사무실',
    retail: '상가',
    beauty: '뷰티샵'
  };

  // Firebase에서 프로젝트 데이터 불러오기
  useEffect(() => {
    const loadProjectsFromFirebase = () => {
      const projectsRef = ref(database, 'portfolio');
      onValue(projectsRef, (snapshot) => {
        const data = snapshot.val();
        
        if (data) {
          // 프로젝트를 타입별로 분류하고 이미지 형태 변환
          const formattedData = { residential: [], commercial: [] };
          
          Object.entries(data).forEach(([id, project]) => {
            const formattedProject = {
              id,
              title: project.title,
              location: project.address,
              area: project.type === 'residential' ? project.area : project.businessType,
              type: project.type === 'residential' ? '아파트' : businessTypeLabels[project.businessType],
              style: project.style || (project.type === 'residential' ? '모던 스타일' : '모던 인테리어'),
              image: project.images && project.images.length > 0 
                ? project.images[0].url
                : 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              aspectRatio: 'aspect-[4/5]', // 기본 비율
              mainImage: project.images && project.images.length > 0 
                ? project.images[0].url
                : 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
              subImages: project.images && project.images.length > 1
                ? project.images.slice(1).map(img => img.url)
                : [],
              originalProject: project // 원본 프로젝트 데이터 보관
            };
            
            if (project.type === 'residential') {
              formattedData.residential.push(formattedProject);
            } else {
              formattedData.commercial.push(formattedProject);
            }
          });
          
          setPortfolioData(formattedData);
        } else {
          // 샘플 데이터 (프로젝트가 없을 때)
          setPortfolioData({
            residential: [
              {
                id: 'sample1',
                title: '샘플 아파트 (데이터 없음)',
                location: '서울시 강남구',
                area: '34py',
                type: '아파트',
                style: '포트폴리오 관리에서 프로젝트를 추가해주세요',
                image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                aspectRatio: 'aspect-[4/5]',
                mainImage: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                subImages: [
                  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                ]
              }
            ],
            commercial: []
          });
        }
      });
    };

    loadProjectsFromFirebase();
  }, []);

  // Filter projects based on selected filters
  const filteredProjects = (projects) => {
    return projects.filter(project => {
      if (activeTab === 'residential') {
        const areaMatch = selectedFilters.area.length === 0 || 
          selectedFilters.area.some(area => {
            const areaNum = parseInt(project.area);
            if (area === '20평▼') return areaNum < 20;
            if (area === '30평형') return areaNum >= 30 && areaNum < 40;
            if (area === '40평형') return areaNum >= 40 && areaNum < 50;
            if (area === '50평형') return areaNum >= 50 && areaNum < 60;
            if (area === '60평▲') return areaNum >= 60;
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

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const closeDetailView = () => {
    setSelectedProject(null);
  };

  // 모달 관련 함수들
  const openModal = (imageUrl, project = selectedProject) => {
    if (project) {
      // 메인 이미지와 서브 이미지들을 합친 전체 이미지 배열 생성
      const projectAllImages = [project.mainImage, ...project.subImages];
      setAllImages(projectAllImages);
      
      // 현재 클릭한 이미지의 인덱스 찾기
      const imageIndex = projectAllImages.findIndex(img => img === imageUrl);
      setSelectedImageIndex(imageIndex !== -1 ? imageIndex : 0);
      setSelectedImage(imageUrl);
    }
    
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
    
    // Add history entry when modal opens
    window.history.pushState({ modalOpen: true }, '', window.location.href);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage('');
    setSelectedImageIndex(0);
    setAllImages([]);
    document.body.style.overflow = 'unset';
    
    // Remove history entry when modal closes
    if (window.history.state?.modalOpen) {
      window.history.back();
    }
  };

  const goToPreviousImage = () => {
    if (allImages.length > 0) {
      const newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : allImages.length - 1;
      setSelectedImageIndex(newIndex);
      setSelectedImage(allImages[newIndex]);
    }
  };

  const goToNextImage = () => {
    if (allImages.length > 0) {
      const newIndex = selectedImageIndex < allImages.length - 1 ? selectedImageIndex + 1 : 0;
      setSelectedImageIndex(newIndex);
      setSelectedImage(allImages[newIndex]);
    }
  };

  // ESC key to close detail view and modal, arrow keys for modal navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' || event.key === 'Backspace') {
        if (isModalOpen) {
          closeModal();
        } else if (selectedProject) {
          closeDetailView();
        }
      } else if (isModalOpen) {
        if (event.key === 'ArrowLeft') {
          goToPreviousImage();
        } else if (event.key === 'ArrowRight') {
          goToNextImage();
        }
      }
    };

    const handleWheel = (event) => {
      if (isModalOpen && allImages.length > 1) {
        event.preventDefault();
        if (event.deltaY > 0) {
          goToNextImage();
        } else {
          goToPreviousImage();
        }
      }
    };

    // Handle browser back button
    const handlePopState = () => {
      if (isModalOpen) {
        closeModal();
      } else if (selectedProject) {
        closeDetailView();
      }
    };

    if (selectedProject || isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    if (isModalOpen) {
      document.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('wheel', handleWheel);
      window.removeEventListener('popstate', handlePopState);
      if (!isModalOpen) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [selectedProject, isModalOpen, selectedImageIndex, allImages]);

  // Masonry layout component
  const MasonryGallery = ({ projects }) => {
    if (projects.length === 0) {
      return (
        <div className="col-span-full text-center py-16">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {portfolioData.residential.length === 0 && portfolioData.commercial.length === 0 
              ? '저장된 프로젝트가 없습니다' 
              : '해당 카테고리에 프로젝트가 없습니다'
            }
          </h3>
          <p className="text-gray-500 mb-4">
            {portfolioData.residential.length === 0 && portfolioData.commercial.length === 0 
              ? '포트폴리오 관리에서 새 프로젝트를 추가해보세요.'
              : '다른 카테고리를 선택하거나 해당 카테고리에 프로젝트를 추가해보세요.'
            }
          </p>
          {portfolioData.residential.length === 0 && portfolioData.commercial.length === 0 && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-yellow-800 text-sm">
                <strong>💡 확인사항:</strong><br/>
                1. 포트폴리오 관리에서 프로젝트를 업로드했는지 확인<br/>
                2. 브라우저 localStorage 데이터 확인<br/>
                3. 같은 브라우저/탭에서 확인하고 있는지 확인
              </p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="group relative overflow-hidden rounded-2xl cursor-pointer"
            style={{
              opacity: 0,
              transform: 'translateY(20px)',
              animation: `fadeInUp 0.6s ease forwards ${index * 0.1}s`
            }}
            onClick={() => handleProjectClick(project)}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                }}
              />
              
              {/* Full overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-500" />
              
              {/* Hover content */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="text-center text-white px-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-200 mb-1">{project.type}</p>
                  <p className="text-sm text-gray-300">{project.style}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Detail View Component with masonry layout for sub images
  const DetailView = ({ project }) => {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        {/* Close button */}
        <button
          onClick={closeDetailView}
          className="fixed top-6 right-6 z-60 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
          title="포트폴리오로 돌아가기"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex h-full">
          {/* Left side - Project info */}
          <div className="w-1/3 p-16 flex flex-col justify-center bg-gray-50">
            <div className="space-y-6">
              {/* Project type & info */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="px-3 py-1 bg-gray-200 rounded-full">
                  {activeTab === 'residential' ? '주거 공간' : '상업 공간'}
                </span>
                <span>•</span>
                <span>{project.area}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900">{project.title}</h1>

              {/* Location */}
              <p className="text-lg text-gray-600">{project.location}</p>

              {/* Style */}
              <p className="text-md text-gray-500">{project.style}</p>

              {/* Description */}
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {activeTab === 'residential' ? 
                    `${project.style} 스타일의 아파트 인테리어 프로젝트입니다. 주거 공간의 기능성과 심미성을 모두 고려한 설계로, 일상 속 편안함과 세련된 분위기를 동시에 구현했습니다.` :
                    `${project.style} 스타일의 ${project.type} 인테리어 프로젝트입니다. 공간의 특성을 살린 디자인으로, 실용성과 아름다움을 조화롭게 구현했습니다.`
                  }
                </p>
              </div>

              {/* 구글 드라이브 링크 (원본 프로젝트 데이터가 있는 경우) */}
              {project.originalProject?.folderId && (
                <div>
                  <a
                    href={`https://drive.google.com/drive/folders/${project.originalProject.folderId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    구글 드라이브에서 보기 →
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Image gallery (including main image) */}
          <div className="w-2/3 p-16 overflow-y-auto">
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {/* Main image first */}
              <div className="break-inside-avoid mb-6">
                <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => openModal(project.mainImage)}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                </div>
              </div>

              {/* Sub images */}
              {project.subImages.map((image, index) => (
                <div
                  key={index}
                  className="break-inside-avoid mb-6"
                >
                  <div className={`relative overflow-hidden rounded-xl ${
                    index % 4 === 0 ? 'aspect-[3/4]' :
                    index % 4 === 1 ? 'aspect-[4/3]' :
                    index % 4 === 2 ? 'aspect-[1/1]' : 'aspect-[4/5]'
                  }`}>
                    <img
                      src={image}
                      alt={`${project.title} detail ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => openModal(image)}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Main content - only show if no project is selected */}
      {!selectedProject && (
        <div>
          {/* Hero Section - Simplified */}
          <section className="pt-16 pb-0 bg-gradient-to-br from-gray-50 to-white">
            <div className="w-full px-4">
              <div className="text-center">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">Portfolio</h1>
              </div>
              <section className="py-1"></section>
            </div>
          </section>

          {/* 데이터 디버깅 정보 */}
          <div className="w-full flex justify-center items-center py-2 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-blue-800">
                📊 데이터: 주거 {portfolioData.residential.length}개 | 상업 {portfolioData.commercial.length}개
              </span>
              <button
                onClick={() => {
                  try {
                    const projectsRef = ref(database, 'portfolio');
                    onValue(projectsRef, (snapshot) => {
                      const data = snapshot.val();
                      if (data) {
                        const projects = Object.entries(data).map(([id, project]) => project);
                        const residential = projects.filter(p => p.type === 'residential');
                        const commercial = projects.filter(p => p.type === 'commercial');
                        
                        const info = `포트폴리오 화면 데이터 확인

Firebase 경로: portfolio
총 저장된 프로젝트: ${projects.length}개
주거 프로젝트: ${residential.length}개
상업 프로젝트: ${commercial.length}개

현재 화면 표시 상태:
주거 탭 프로젝트: ${portfolioData.residential.length}개
상업 탭 프로젝트: ${portfolioData.commercial.length}개
현재 선택된 탭: ${activeTab}
필터링된 프로젝트: ${getProjectsToShow().length}개

주거 프로젝트 목록:
${residential.map((p, i) => `${i+1}. ${p.title} (${p.address}) - ${p.area} - 이미지 ${p.images?.length || 0}개`).join('\n') || '없음'}

상업 프로젝트 목록:
${commercial.map((p, i) => `${i+1}. ${p.title} (${p.address}) - ${p.businessType} - 이미지 ${p.images?.length || 0}개`).join('\n') || '없음'}

문제 해결 방법:
1. 데이터가 0개인 경우: 포트폴리오 관리에서 프로젝트 업로드 확인
2. 저장은 되었는데 화면에 안보이는 경우: 새로고침 버튼 클릭
3. 계속 문제가 있는 경우: Firebase 연결 상태 확인`;
                        
                        alert(info);
                      } else {
                        alert('❌ Firebase에 저장된 데이터가 없습니다!\n\n해결 방법:\n1. 포트폴리오 관리에서 프로젝트를 업로드해주세요\n2. Firebase 연결 상태를 확인해주세요');
                      }
                    }, { onlyOnce: true });
                  } catch (error) {
                    alert('데이터 확인 중 오류 발생: ' + error.message);
                  }
                }}
                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
              >
                상세 확인
              </button>
              <button
                onClick={() => {
                  // Firebase에서 데이터 다시 로드
                  const projectsRef = ref(database, 'portfolio');
                  onValue(projectsRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                      try {
                        // 데이터 다시 로드 로직 실행
                        const formattedData = { residential: [], commercial: [] };
                        
                        Object.entries(data).forEach(([id, project]) => {
                          const formattedProject = {
                            id,
                            title: project.title,
                            location: project.address,
                            area: project.type === 'residential' ? project.area : project.businessType,
                            type: project.type === 'residential' ? '아파트' : businessTypeLabels[project.businessType],
                            style: project.style || (project.type === 'residential' ? '모던 스타일' : '모던 인테리어'),
                            image: project.images && project.images.length > 0 
                              ? project.images[0].url
                              : 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                            aspectRatio: 'aspect-[4/5]',
                            mainImage: project.images && project.images.length > 0 
                              ? project.images[0].url
                              : 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                            subImages: project.images && project.images.length > 1
                              ? project.images.slice(1).map(img => img.url)
                              : [],
                            originalProject: project
                          };
                          
                          if (project.type === 'residential') {
                            formattedData.residential.push(formattedProject);
                          } else {
                            formattedData.commercial.push(formattedProject);
                          }
                        });
                        
                        setPortfolioData(formattedData);
                        alert(`✅ 데이터 새로고침 완료!\n주거: ${formattedData.residential.length}개, 상업: ${formattedData.commercial.length}개`);
                      } catch (error) {
                        alert('❌ 데이터 파싱 오류: ' + error.message);
                      }
                    } else {
                      alert('❌ 저장된 데이터가 없습니다.\n포트폴리오 관리에서 프로젝트를 먼저 업로드해주세요.');
                    }
                  }, { onlyOnce: true });
                }}
                className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
              >
                데이터 새로고침
              </button>
            </div>
          </div>

          {/* 카테고리 선택 버튼 */}
          <div className="w-full flex justify-center items-center bg-white">
            <div className="flex gap-4 py-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-64 h-12 rounded-xl text-lg transition-all duration-300 focus:outline-none ${
                    activeTab === tab.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <section className="py-1"></section>

          {/* 필터 체크박스 */}
          <div className="w-full flex justify-center items-center py-4 bg-white border-b border-gray-100">
            <div className="flex flex-wrap gap-4">
              {activeTab === 'residential' ? (
                ['20평▼', '30평형', '40평형', '50평형', '60평▲'].map((area) => (
                  <label key={area} className="flex items-center text-base gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.area.includes(area)}
                      onChange={() => toggleFilter('area', area)}
                      className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                    />
                    <span className="text-gray-700">{area}</span>
                  </label>
                ))
              ) : (
                ['카페', '레스토랑', '사무실', '상가', '뷰티샵'].map((type) => (
                  <label key={type} className="flex items-center text-base gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.type.includes(type)}
                      onChange={() => toggleFilter('type', type)}
                      className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                    />
                    <span className="text-gray-700">{type}</span>
                  </label>
                ))
              )}
            </div>
          </div>
          <section className="py-2"></section>

          {/* Main Content */}
          <section className="pb-16">
            <div className="w-full px-4">
              <div>
                <MasonryGallery projects={getProjectsToShow()} />
              </div>
            </div>
          </section>

          {/* Fixed CTA Button */}
          <div className="fixed bottom-8 right-8 z-40">
            <button
              className="px-8 py-4 bg-white text-black rounded-2xl shadow-2xl hover:bg-gray-100 transition-all duration-300 font-bold hover:scale-105 hover:-translate-y-1"
              onClick={() => window.location.href = '/design_luka/contact'}
            >
              이런 공간 우리도 가능할까요?
            </button>
          </div>
        </div>
      )}

      {/* Detail View */}
      {selectedProject && (
        <DetailView project={selectedProject} />
      )}

      {/* Image Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-[90vw] h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
              title="닫기 (ESC)"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous Button */}
            {allImages.length > 1 && (
              <button
                onClick={goToPreviousImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                title="이전 이미지 (←)"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next Button */}
            {allImages.length > 1 && (
              <button
                onClick={goToNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                title="다음 이미지 (→)"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            )}

            {/* Image */}
            <div 
              className="w-full h-full flex items-center justify-center p-4 cursor-pointer"
              onClick={goToNextImage}
              title="클릭하여 다음 이미지 보기"
            >
              <img
                src={selectedImage}
                alt="Expanded view"
                className="max-w-full max-h-full object-contain select-none"
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}