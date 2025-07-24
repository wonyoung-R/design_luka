import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { database } from '../firebase/config';
import { ref, onValue } from 'firebase/database';
import Navbar from '../components/Navbar';

// Fallback image URLs (컴포넌트 외부로 이동)
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
];

// 반응형 이미지 URL 생성 함수들 (컴포넌트 외부로 이동)
const getResponsiveCloudinaryUrl = (url, width = null) => {
  if (!url) return null;
  
  // Cloudinary URL인 경우 반응형 최적화
  if (url.includes('cloudinary.com')) {
    const baseUrl = url.split('/upload/')[0] + '/upload/';
    const imagePath = url.split('/upload/')[1];
    
    // 고화질 반응형 파라미터 추가
    let params = 'f_auto,q_auto:good,fl_progressive'; // 고화질 자동 최적화
    
    if (width) {
      params += `,w_${width}`; // 특정 너비 지정
    }
    
    return `${baseUrl}${params}/${imagePath}`;
  }
  
  return url;
};

const generateResponsiveSrcSet = (url) => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }
  
  // 다양한 화면 크기에 맞는 이미지 URL 생성
  const widths = [320, 640, 960, 1280, 1920];
  const srcSet = widths.map(width => {
    const responsiveUrl = getResponsiveCloudinaryUrl(url, width);
    return `${responsiveUrl} ${width}w`;
  }).join(', ');
  
  return srcSet;
};

const convertToOptimizedUrl = (url) => {
  if (!url) return null;
  
  // Cloudinary URL인 경우 고화질 반응형 최적화
  if (url.includes('cloudinary.com')) {
    return getResponsiveCloudinaryUrl(url);
  }
  
  // 기타 URL은 그대로 반환
  return url;
};

const tabs = [
  { id: 'residential', label: '주거 공간' },
  { id: 'commercial', label: '상업 공간' }
];

export default function PortfolioPage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('residential');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const [portfolioData, setPortfolioData] = useState({ residential: [], commercial: [] });
  const [selectedFilters, setSelectedFilters] = useState({
    area: [],
    type: []
  });
    // 모바일 최적화를 위한 간단한 상태 관리
  
  // 모바일 디버깅을 위한 useEffect 추가
  useEffect(() => {
    console.log('PortfolioPage 컴포넌트 마운트됨');
    console.log('현재 화면 크기:', window.innerWidth, 'x', window.innerHeight);
    console.log('User Agent:', navigator.userAgent);
    
    // 모바일에서 에러 확인용
    const handleError = (event) => {
      console.error('PortfolioPage JavaScript 에러:', event.error);
      alert('포트폴리오 페이지 에러 발생: ' + (event.error?.message || '알 수 없는 에러'));
  };

    // Firebase 연결 상태 확인
    const checkFirebaseConnection = () => {
      console.log('Firebase 연결 상태 확인 중...');
      try {
        const testRef = ref(database, 'portfolio');
        onValue(testRef, (snapshot) => {
          console.log('Firebase 연결 성공!');
          console.log('데이터 존재 여부:', snapshot.exists());
          if (snapshot.exists()) {
            console.log('데이터 개수:', Object.keys(snapshot.val()).length);
    }
        }, (error) => {
          console.error('Firebase 연결 실패:', error);
          alert('Firebase 연결 실패: ' + error.message);
        });
      } catch (error) {
        console.error('Firebase 초기화 에러:', error);
        alert('Firebase 초기화 에러: ' + error.message);
      }
    };

    // 3초 후 Firebase 연결 확인
    setTimeout(checkFirebaseConnection, 3000);
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  const navigate = useNavigate();

  // Function to get fallback image
  const getFallbackImage = (index = 0) => {
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  };

  // 모바일 최적화를 위한 간단한 컴포넌트

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

  // businessType을 한글로 변환하는 함수 추가
  const convertBusinessTypeToKorean = (businessType) => {
    const typeMap = {
      'cafe': '카페',
      'restaurant': '레스토랑', 
      'office': '사무실',
      'retail': '상가',
      'beauty': '뷰티샵'
    };
    return typeMap[businessType] || businessType;
  };

  // Firebase에서 포트폴리오 데이터 로드
  useEffect(() => {
    const loadProjectsFromFirebase = () => {
      const projectsRef = ref(database, 'portfolio');
      onValue(projectsRef, (snapshot) => {
        const data = snapshot.val();
        
        if (data) {
          const formattedData = { residential: [], commercial: [] };
          const processedIds = new Set(); // 중복 제거를 위한 Set
          
          console.log('Raw Firebase data:', data);
          
          Object.entries(data).forEach(([id, project]) => {
            // 중복 ID 체크
            if (processedIds.has(id)) {
              console.log(`Duplicate project ID found: ${id}, skipping...`);
              return;
            }
            
            console.log(`Processing project ${id}:`, project);
            console.log(`Project images:`, project.images);
            
            let allImages = [];
            
            if (project.images && Array.isArray(project.images) && project.images.length > 0) {
              allImages = project.images
                .map(img => {
                  console.log(`Processing image for project ${id}:`, img);
                  
                  // 이미지 객체가 문자열인 경우 (직접 URL)
                  if (typeof img === 'string') {
                    return convertToOptimizedUrl(img);
                  }
                  
                  // 이미지 객체가 객체인 경우
                  if (img && typeof img === 'object') {
                    // Cloudinary URL이 있는 경우
                    if (img.url) {
                      return convertToOptimizedUrl(img.url);
                    }
                    // Cloudinary ID가 있는 경우 (public_id)
                    else if (img.id) {
                      return `https://res.cloudinary.com/dti1gtd3u/image/upload/f_auto,q_auto/${img.id}`;
                    }
                  }
                  
                  return null;
                })
                .filter(url => url);
            }
            
            if (allImages.length === 0) {
              allImages = [FALLBACK_IMAGES[0]];
            }
            
            // 로그를 한 번만 출력
            console.log(`Project ${id} final images (${allImages.length} images):`, allImages);
            
            const formattedProject = {
              id,
              title: project.title || `프로젝트 ${id}`,
              location: project.address || '위치 정보 없음',
              area: project.type === 'residential' ? project.area : project.businessType,
              type: project.type === 'residential' ? '아파트' : convertBusinessTypeToKorean(project.businessType || '상업공간'),
              style: project.style || '모던 스타일',
              styleDescription: project.styleDescription || '',
              image: allImages[0],
              aspectRatio: 'aspect-[4/5]',
              images: allImages,
              originalProject: project
            };
            
            if (project.type === 'residential') {
              formattedData.residential.push(formattedProject);
            } else {
              formattedData.commercial.push(formattedProject);
            }
            
            // 처리된 ID를 Set에 추가
            processedIds.add(id);
          });
          
          // 중복 제거 및 정렬
          const uniqueResidential = formattedData.residential.filter((project, index, self) => 
            index === self.findIndex(p => p.id === project.id)
          );
          
          const uniqueCommercial = formattedData.commercial.filter((project, index, self) => 
            index === self.findIndex(p => p.id === project.id)
          );
          
          // 순서 필드 기준으로 정렬 (order 필드가 있으면 사용, 없으면 생성일 기준)
          const sortedResidential = uniqueResidential.sort((a, b) => {
            // order 필드가 있으면 그것을 우선 사용
            if (a.originalProject?.order !== undefined && b.originalProject?.order !== undefined) {
              return a.originalProject.order - b.originalProject.order;
            }
            // order 필드가 없으면 생성일 기준 (최신순)
            const dateA = a.originalProject?.createdAt ? new Date(a.originalProject.createdAt) : new Date(0);
            const dateB = b.originalProject?.createdAt ? new Date(b.originalProject.createdAt) : new Date(0);
            return dateB - dateA;
          });
          
          const sortedCommercial = uniqueCommercial.sort((a, b) => {
            // order 필드가 있으면 그것을 우선 사용
            if (a.originalProject?.order !== undefined && b.originalProject?.order !== undefined) {
              return a.originalProject.order - b.originalProject.order;
            }
            // order 필드가 없으면 생성일 기준 (최신순)
            const dateA = a.originalProject?.createdAt ? new Date(a.originalProject.createdAt) : new Date(0);
            const dateB = b.originalProject?.createdAt ? new Date(b.originalProject.createdAt) : new Date(0);
            return dateB - dateA;
          });
          
          console.log('Final processed data:', {
            residential: sortedResidential.length,
            commercial: sortedCommercial.length
          });
          
          // 모바일에서 데이터 확인용 알림
          const totalProjects = sortedResidential.length + sortedCommercial.length;
          console.log(`총 ${totalProjects}개의 프로젝트 로드됨`);
          
          if (totalProjects === 0) {
            alert('⚠️ 포트폴리오 데이터가 없습니다. 관리자 페이지에서 프로젝트를 추가해주세요.');
          } else {
            console.log('✅ 포트폴리오 데이터 로드 완료');
          }
          
          setPortfolioData({
            residential: sortedResidential,
            commercial: sortedCommercial
          });
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
                image: FALLBACK_IMAGES[0],
                aspectRatio: 'aspect-[4/5]',
                images: [FALLBACK_IMAGES[0], FALLBACK_IMAGES[1]]
              }
            ],
            commercial: []
          });
        }
      });
    };

    loadProjectsFromFirebase();
  }, []);

  // URL 파라미터에서 카테고리 읽어오기
  useEffect(() => {
    const category = searchParams.get('category');
    if (category && (category === 'residential' || category === 'commercial')) {
      setActiveTab(category);
    } else {
      // URL 파라미터가 없으면 기본값으로 리셋
      setActiveTab('residential');
    }
  }, [searchParams]);

  // Filter projects based on selected filters
  const filteredProjects = (projects) => {
    return projects.filter(project => {
      if (activeTab === 'residential') {
        // 주거공간 필터
        if (selectedFilters.area.length === 0 || selectedFilters.area.includes("전체")) {
          return true;
        }
        
        const areaNum = parseInt(project.area);
        
        // 선택된 필터 중 하나라도 조건에 맞으면 true 반환
        return selectedFilters.area.some(filter => {
          switch (filter) {
            case "10PY":
              return areaNum < 20;
            case "20PY":
              return areaNum >= 20 && areaNum < 30;
            case "30PY":
              return areaNum >= 30 && areaNum < 40;
            case "40PY":
              return areaNum >= 40 && areaNum < 50;
            case "50PY~":
              return areaNum >= 50;
            default:
              return false;
          }
        });
      } else {
        // 상업공간 필터
        if (selectedFilters.type.length === 0 || selectedFilters.type.includes("전체")) {
          return true;
        }
        return selectedFilters.type.includes(project.type);
      }
    });
  };

  const handleFilterChange = (category, value) => {
    setSelectedFilters(prev => {
      if (value === "전체") {
        // 전체를 누르면 해당 카테고리만 전체 선택
        return {
          ...prev,
          [category]: []
        };
      } else {
        // 전체가 아닌 항목을 누르면 전체는 해제
        const prevArr = prev[category] || [];
        let newArr;
        if (prevArr.includes(value)) {
          newArr = prevArr.filter(item => item !== value);
        } else {
          newArr = [...prevArr.filter(item => item !== "전체"), value];
        }
        return {
          ...prev,
          [category]: newArr
        };
      }
    });
  };

  const handleCategoryClick = (category, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log('Category clicked:', category);
    setActiveTab(category);
  };

  const handleCTAClick = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log('CTA clicked - navigating to contact');
    navigate('/contact');
  };

  const getProjectsToShow = () => {
    const projects = activeTab === 'residential' ? portfolioData.residential : portfolioData.commercial;
    const filtered = filteredProjects(projects);
    console.log(`getProjectsToShow: ${activeTab} 탭, ${projects.length}개 중 ${filtered.length}개 표시`);
    return filtered;
  };

  const handleProjectClick = (project, event) => {
    // 이벤트가 있으면 기본 동작 방지
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log('Project clicked:', project);
    setSelectedProject(project);
    
    // 상세 페이지 열 때 히스토리에 상태 추가
    window.history.pushState({ detailView: true, projectId: project.id }, '', window.location.href);
  };

  const closeDetailView = () => {
    console.log('Closing detail view');
    setSelectedProject(null);
    
    // 상세 페이지 닫을 때 히스토리에서 상태 제거
    if (window.history.state?.detailView) {
      window.history.back();
    }
  };

  // 모달 관련 함수들
  const openModal = (imageUrl, project = selectedProject) => {
    if (project) {
      const projectAllImages = project.images;
      setAllImages(projectAllImages);
      // 클릭한 이미지의 인덱스 찾기
      const imageIndex = projectAllImages.findIndex(img => img === imageUrl);
      setSelectedImageIndex(imageIndex !== -1 ? imageIndex : 0);
      setSelectedImage(imageUrl);
    }
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
    window.history.pushState({ modalOpen: true }, '', window.location.href);
  };

  const closeModal = () => {
    console.log('Closing modal');
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
        event.preventDefault();
        if (isModalOpen) {
          closeModal();
        } else if (selectedProject) {
          closeDetailView();
        }
      } else if (isModalOpen) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          goToPreviousImage();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          goToNextImage();
        }
      }
    };

    // Handle browser back button
    const handlePopState = (event) => {
      event.preventDefault();
      if (isModalOpen) {
        closeModal();
      } else if (selectedProject) {
        closeDetailView();
      }
    };

    // 상세 페이지에서도 popstate 이벤트 리스너 추가
    if (selectedProject) {
      window.addEventListener('popstate', handlePopState);
    }

    if (selectedProject || isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    if (isModalOpen || selectedProject) {
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
      if (!isModalOpen) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [selectedProject, isModalOpen, selectedImageIndex, allImages, navigate]);

  // Masonry layout component
  const MasonryGallery = ({ projects }) => {
    console.log('MasonryGallery 렌더링:', projects.length, '개 프로젝트');
    
    if (projects.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg font-['Noto_Sans_KR']">
            표시할 프로젝트가 없습니다.
          </div>
          <div className="text-gray-400 text-sm mt-2">
            관리자 페이지에서 프로젝트를 추가해주세요.
          </div>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {projects.map((project, index) => {
          console.log(`프로젝트 ${index + 1}/${projects.length}:`, project.title, project.id);
          
          // 프로젝트 데이터가 유효하지 않으면 건너뛰기
          if (!project || !project.id) {
            console.warn('유효하지 않은 프로젝트 데이터:', project);
            return null;
          }
          
          return (
          <div
            key={project.id}
            className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            onClick={(event) => handleProjectClick(project, event)}
          >
            <div className="relative aspect-[4/5] overflow-hidden" style={{ pointerEvents: 'auto' }}>
              <ProjectImage
                src={(() => {
                  if (project.images && project.images.length > 0) {
                    const thumbnailIndex = project.originalProject?.thumbnailIndex || 0;
                    const selectedImage = project.images[thumbnailIndex];
                    return selectedImage || project.images[0];
                  }
                  return project.image;
                })()}
                alt={project.title}
                projectId={project.id}
                imageIndex={0}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  handleProjectClick(project, e);
                }}
              />
              
              {/* Full overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-500" />
              
              {/* Hover content */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="text-center text-white px-3 py-2" style={{ minWidth: '120px', height: '60px', width: 'fit-content' }}>
                  <h3 className="text-sm font-bold mb-1 font-['Noto_Sans_KR'] whitespace-nowrap">{project.title}</h3>
                  <p className="text-xs text-gray-200 mb-0.5 font-['Noto_Sans_KR'] whitespace-nowrap">{project.type}</p>
                  <p className="text-xs text-gray-300 font-['Noto_Sans_KR'] whitespace-nowrap">{project.style}</p>
                </div>
              </div>
            </div>
          </div>
        );
        })}
      </div>
    );
  };

  // Detail View Component with masonry layout for sub images
  const DetailView = ({ project }) => {
    return (
      <motion.div
        className="fixed inset-0 z-50 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Close button */}
        <button
          onClick={closeDetailView}
          className="fixed top-3 right-3 z-60 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
          title="포트폴리오로 돌아가기"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Left side - Project info */}
          <motion.div
            className="w-full md:w-1/3 p-4 md:p-16 flex flex-col justify-start bg-white"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-4 md:space-y-6 text-left">
              {/* Project type & info */}
              <div className="flex items-center gap-2 text-sm text-gray-600 font-['Noto_Sans_KR']">
                <span className="px-3 py-1 bg-gray-200 rounded-full">
                  {activeTab === 'residential' ? '주거 공간' : '상업 공간'}
                </span>
                <span>•</span>
                <span>{project.area}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 font-['Noto_Sans_KR'] text-left">{project.title}</h1>

              {/* Location */}
              <p className="text-base md:text-lg text-gray-600 font-['Noto_Sans_KR'] text-left">{project.location}</p>

              {/* Short Style Description */}
              <p className="text-sm md:text-md text-gray-500 font-['Noto_Sans_KR'] text-left">{project.style}</p>

              {/* Description */}
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed font-['Noto_Sans_KR'] text-left text-sm md:text-base">
                  {project.styleDescription || '상세 설명이 없습니다.'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right side - Image gallery (including main image) */}
          <motion.div
            className="w-full md:w-2/3 p-4 md:p-16 overflow-y-auto"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex" style={{ display: 'flex', gap: '8px' }}>
              {/* 왼쪽 컬럼 - 홀수번째 이미지들 (1, 3, 5, 7, 9...) */}
              <div className="flex-1 flex flex-col" style={{ gap: '8px' }}>
                {project.images.filter((_, index) => index % 2 === 0).map((image, index) => (
              <motion.div
                    key={`left-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <div className="relative overflow-hidden rounded-xl">
                  <ProjectImage
                        src={image}
                        alt={`${project.title} detail ${index * 2 + 1}`}
                    projectId={project.id}
                        imageIndex={index * 2}
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                        loading="eager"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                          openModal(image);
                    }}
                  />
                </div>
              </motion.div>
                ))}
              </div>

              {/* 오른쪽 컬럼 - 짝수번째 이미지들 (2, 4, 6, 8, 10...) */}
              <div className="flex-1 flex flex-col" style={{ gap: '8px' }}>
                {project.images.filter((_, index) => index % 2 === 1).map((image, index) => (
                <motion.div
                    key={`right-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <ProjectImage
                      src={image}
                        alt={`${project.title} detail ${index * 2 + 2}`}
                      projectId={project.id}
                        imageIndex={index * 2 + 1}
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                      loading="eager"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        openModal(image);
                      }}
                    />
                  </div>
                </motion.div>
              ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // 반응형 이미지 컴포넌트 - 중복 이벤트 방지
  const ProjectImage = ({ src, alt, projectId, imageIndex = 0, className, onClick }) => {
    const [imageError, setImageError] = useState(false);
    const [imageSrc, setImageSrc] = useState(src || FALLBACK_IMAGES[0]);

    // src가 변경될 때마다 imageSrc 업데이트
    useEffect(() => {
      setImageSrc(src || FALLBACK_IMAGES[0]);
      setImageError(false);
    }, [src]);

    const handleImageError = () => {
      console.error('이미지 로딩 실패:', imageSrc);
      if (!imageError) {
        setImageError(true);
        setImageSrc(FALLBACK_IMAGES[0]);
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    return (
        <img
        src={imageSrc}
          alt={alt}
          className={className}
          onClick={onClick}
        loading="lazy"
        onError={handleImageError}
        onContextMenu={handleContextMenu}
        style={{ pointerEvents: 'auto' }}
        draggable={false}
      />
    );
  };

  // 모바일 최적화를 위한 간단한 컴포넌트

  // 썸네일 네비게이션 ref 추가
  const thumbnailNavRef = useRef(null);
  // 데스크탑 마우스 드래그 상태 관리
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [scrollStartX, setScrollStartX] = useState(0);

  // 마우스 드래그 핸들러
  const handleThumbMouseDown = (e) => {
    // 오직 데스크탑(마우스)에서만 동작
    if (e.type === 'mousedown' && e.button === 0 && thumbnailNavRef.current) {
      setIsDragging(true);
      setDragStartX(e.clientX);
      setScrollStartX(thumbnailNavRef.current.scrollLeft);
      document.body.style.cursor = 'grabbing';
    }
  };
  const handleThumbMouseMove = (e) => {
    if (isDragging && thumbnailNavRef.current) {
      const dx = e.clientX - dragStartX;
      thumbnailNavRef.current.scrollLeft = scrollStartX - dx;
    }
  };
  const handleThumbMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = '';
  };
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleThumbMouseMove);
      window.addEventListener('mouseup', handleThumbMouseUp);
    } else {
      window.removeEventListener('mousemove', handleThumbMouseMove);
      window.removeEventListener('mouseup', handleThumbMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleThumbMouseMove);
      window.removeEventListener('mouseup', handleThumbMouseUp);
    };
  }, [isDragging]);

  // 썸네일 중앙 정렬 useEffect (scrollLeft 직접 계산, 양끝 보정, 썸네일 적을 때 예외)
  useEffect(() => {
    if (isModalOpen && thumbnailNavRef.current && allImages.length > 0) {
      const container = thumbnailNavRef.current;
      const buttons = Array.from(container.children).filter(el => el.tagName === 'BUTTON');
      const center = buttons[selectedImageIndex];
      if (!center) return;
      const containerWidth = container.clientWidth;
      const centerLeft = center.offsetLeft;
      const centerWidth = center.offsetWidth;
      const totalWidth = container.scrollWidth;

      let scrollTo = centerLeft + centerWidth / 2 - containerWidth / 2;
      if (scrollTo < 0) scrollTo = 0;
      const maxScroll = totalWidth - containerWidth;
      if (scrollTo > maxScroll) scrollTo = maxScroll;
      container.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  }, [isModalOpen, selectedImageIndex, allImages.length, selectedProject?.id]);

  // 우클릭 방지 함수
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className="min-h-screen bg-white" onContextMenu={handleContextMenu}>
      {/* Main content - only show if no project is selected */}
      <Navbar />
      <AnimatePresence>
        {!selectedProject && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="font-['Noto_Sans_KR']"
          >
            {/* Hero Section - Simplified */}
            <section className="pt-16 pb-4 md:pb-8 bg-gradient-to-br from-gray-50 to-white">
              <div className="w-full px-4">
                <motion.div
                  className="text-center max-w-4xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 md:mb-4 tracking-tight font-['Noto_Sans_KR']">Portfolio</h1>
                </motion.div>
              </div>
            </section>

            {/* 카테고리 선택 버튼 (히어로 아래, 여백 없이 센터정렬) */}
            <div className="flex justify-center py-8 md:py-4">
              <div className="flex gap-0 md:gap-4 py-0 w-full md:w-auto px-4 md:px-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={(event) => handleCategoryClick(tab.id, event)}
                    className={`flex-1 md:w-64 h-12 rounded-xl text-base md:text-lg font-['Noto_Sans_KR'] transition-all duration-300 focus:outline-none ${
                      activeTab === tab.id
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-bold">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* 필터 토글 버튼 - 디바이스별 유연한 레이아웃 */}
            <div className="w-full flex justify-center items-center py-4 bg-white border-b border-gray-100">
              <div className="flex gap-0.25 sm:gap-0.5 md:gap-1 justify-center max-w-full px-2 sm:px-4 overflow-x-auto scrollbar-hide">
                {activeTab === 'residential' ? (
                  ["전체", "10PY", "20PY", "30PY", "40PY", "50PY~"].map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => handleFilterChange('area', area)}
                      className={`px-2 sm:px-3 md:px-4 py-2 rounded-full text-xs sm:text-xs md:text-sm font-['Noto_Sans_KR'] transition-all duration-200 whitespace-nowrap flex-shrink-0
                        ${selectedFilters.area.includes(area) || (selectedFilters.area.length === 0 && area === "전체")
                          ? 'text-black font-bold'
                          : 'text-gray-400'}
                      `}
                    >
                      {area}
                    </button>
                  ))
                ) : (
                  ["전체", "카페", "레스토랑", "사무실", "상가", "뷰티샵"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleFilterChange('type', type)}
                      className={`px-2 sm:px-3 md:px-4 py-2 rounded-full text-xs sm:text-xs md:text-sm font-['Noto_Sans_KR'] transition-all duration-200 whitespace-nowrap flex-shrink-0
                        ${selectedFilters.type.includes(type) || (selectedFilters.type.length === 0 && type === "전체")
                          ? 'text-black font-bold'
                          : 'text-gray-400'}
                      `}
                    >
                      {type}
                    </button>
                  ))
                )}
              </div>
            </div>
            <section class="py-2"></section>
            {/* Main Content */}
            <section className="pb-16">
              <div className="w-full px-2 md:px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <MasonryGallery projects={getProjectsToShow()} />
                </motion.div>
              </div>
            </section>

            {/* Fixed CTA Button */}
            <motion.div
              className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-40"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 md:px-8 py-3 md:py-4 bg-white text-black rounded-2xl shadow-2xl hover:bg-gray-100 transition-all duration-300 font-bold font-['Noto_Sans_KR'] text-sm md:text-base"
                onClick={handleCTAClick}
              >
                이런 공간 우리도 가능할까요?
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail View */}
      <AnimatePresence>
        {selectedProject && (
          <DetailView project={selectedProject} />
        )}
      </AnimatePresence>

      {/* Image Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 backdrop-blur-sm p-2"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative w-full h-full max-w-[99vw] max-h-[99vh] bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with close button and counter */}
              <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={closeModal}
                    className="absolute top-0 right-0 m-4 z-30 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-105"
                    title="닫기 (ESC)"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  {allImages.length > 1 && (
                    <div className="px-4 py-2 bg-black/50 text-white text-sm rounded-full font-['Noto_Sans_KR'] backdrop-blur-sm">
                      {selectedImageIndex + 1} / {allImages.length}
                    </div>
                  )}
                </div>
                
                <div className="hidden md:flex items-center space-x-2">
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={goToPreviousImage}
                        className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-105"
                        title="이전 이미지 (←)"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={goToNextImage}
                        className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-105"
                        title="다음 이미지 (→)"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Main Image Container */}
              <div className="relative w-full h-full flex items-center justify-center p-2">
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  {/* 모바일 좌/우 터치(탭) 영역 */}
                  <div className="block md:hidden absolute left-0 top-0 bottom-0 w-1/2 z-5" onClick={goToPreviousImage} style={{cursor:'pointer'}} />
                  <div className="block md:hidden absolute right-0 top-0 bottom-0 w-1/2 z-5" onClick={goToNextImage} style={{cursor:'pointer'}} />
                  {selectedImage && selectedImage.includes('cloudinary.com') ? (
                    <picture>
                      {/* 모바일용 작은 이미지 */}
                      <source
                        media="(max-width: 640px)"
                        srcSet={getResponsiveCloudinaryUrl(selectedImage, 320)}
                        sizes="100vw"
                      />
                      {/* 태블릿용 중간 이미지 */}
                      <source
                        media="(max-width: 1024px)"
                        srcSet={getResponsiveCloudinaryUrl(selectedImage, 640)}
                        sizes="100vw"
                      />
                      {/* 데스크탑용 큰 이미지 */}
                      <source
                        media="(min-width: 1025px)"
                        srcSet={getResponsiveCloudinaryUrl(selectedImage, 1280)}
                        sizes="100vw"
                      />
                      {/* 기본 이미지 */}
                      <img
                        src={getResponsiveCloudinaryUrl(selectedImage)}
                        alt="Gallery view"
                        className="w-full h-full object-contain select-none rounded-lg shadow-2xl"
                        style={{ touchAction: 'pan-x pan-y', userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      />
                    </picture>
                  ) : (
                  <ProjectImage
                    src={selectedImage}
                    alt="Gallery view"
                    projectId={selectedProject?.id || 'modal'}
                    imageIndex={selectedImageIndex}
                    className="w-full h-full object-contain select-none rounded-lg shadow-2xl"
                    style={{ touchAction: 'pan-x pan-y', userSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  />
                  )}
                </motion.div>
              </div>

              {/* Bottom Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 py-6 px-4 bg-gradient-to-t from-black/80 to-transparent z-20 min-h-[96px] max-w-[90vw] mx-auto flex items-center box-border">
                  <div
                    className="flex h-full items-center justify-start space-x-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory select-none w-full max-w-full box-border"
                    style={{scrollBehavior:'smooth', touchAction:'pan-x', cursor: isDragging ? 'grabbing' : 'grab', WebkitOverflowScrolling:'touch'}}
                    ref={thumbnailNavRef}
                    tabIndex={0}
                    onMouseDown={handleThumbMouseDown}
                  >
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedImageIndex(index);
                          setSelectedImage(image);
                        }}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 snap-center user-select-none self-center box-border ${
                          index === selectedImageIndex 
                            ? 'border-white scale-[1.10]' 
                            : 'border-white/30 hover:border-white/60'
                        }`}
                        style={{ pointerEvents: 'auto', userSelect: 'none' }}
                      >
                        {image && image.includes('cloudinary.com') ? (
                          <picture>
                            <source
                              media="(max-width: 640px)"
                              srcSet={getResponsiveCloudinaryUrl(image, 64)}
                            />
                            <source
                              media="(min-width: 641px)"
                              srcSet={getResponsiveCloudinaryUrl(image, 128)}
                            />
                            <img
                              src={getResponsiveCloudinaryUrl(image, 64)}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover user-select-none"
                              draggable={false}
                              style={{ userSelect: 'none' }}
                            />
                          </picture>
                        ) : (
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover user-select-none"
                          draggable={false}
                          style={{ userSelect: 'none' }}
                        />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}