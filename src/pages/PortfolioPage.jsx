import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { database } from '../firebase/config';
import { ref, onValue } from 'firebase/database';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { submitQnAForm } from '../utils/googleSheetsApi';

// Fallback image URLs (컴포넌트 외부로 이동)
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
];

// URL 변환 함수들 (컴포넌트 외부로 이동)
const getOptimizedCloudinaryUrl = (url) => {
  if (!url) return null;
  
  // 이미 Cloudinary URL인 경우 최적화
  if (url.includes('cloudinary.com')) {
    // 이미 최적화된 URL인 경우 그대로 반환
    if (url.includes('/upload/')) {
      return url;
    }
    
    // 기본 Cloudinary URL을 최적화된 형태로 변환
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
  }
  
  return url;
};

const convertToOptimizedUrl = (url) => {
  if (!url) return null;
  
  // Cloudinary URL인 경우
  if (url.includes('cloudinary.com')) {
    return getOptimizedCloudinaryUrl(url);
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
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [imageLoadStates, setImageLoadStates] = useState({});
  const [imageErrorStates, setImageErrorStates] = useState({});
  
  // 무한루프 방지를 위한 ref 추가
  const loadedImagesRef = useRef(new Set()); // 이미 로드된 이미지들 추적
  const errorAttemptsRef = useRef({}); // 에러 시도 횟수 추적

  // Function to get fallback image
  const getFallbackImage = (index = 0) => {
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  };

  // 무한루프 방지된 이미지 로드 핸들러
  const handleImageLoad = useCallback((projectId, imageIndex = 0) => {
    const imageKey = `${projectId}-${imageIndex}`;
    
    // 이미 처리된 이미지라면 무시
    if (loadedImagesRef.current.has(imageKey)) {
      return;
    }
    
    console.log(`Image loaded successfully (ONCE): ${imageKey}`);
    
    // 로드된 이미지로 마킹
    loadedImagesRef.current.add(imageKey);
    
    // state 업데이트 (한 번만)
    setImageLoadStates(prev => {
      if (prev[imageKey]) return prev; // 이미 true면 업데이트 안함
      return {
        ...prev,
        [imageKey]: true
      };
    });

    // 에러 상태 리셋
    if (errorAttemptsRef.current[imageKey]) {
      delete errorAttemptsRef.current[imageKey];
      setImageErrorStates(prev => {
        const newState = { ...prev };
        delete newState[imageKey];
        return newState;
      });
    }
  }, []);

  // 무한루프 방지된 이미지 에러 핸들러
  const handleImageError = useCallback((e, projectId, imageIndex = 0) => {
    const imageKey = `${projectId}-${imageIndex}`;
    const currentAttempts = errorAttemptsRef.current[imageKey] || 0;
    
    // 이미 최대 시도 횟수에 도달했으면 무시
    if (currentAttempts >= 3) {
      return;
    }

    const newAttempts = currentAttempts + 1;
    errorAttemptsRef.current[imageKey] = newAttempts;
    
    console.log(`Image error for ${imageKey}, attempt: ${newAttempts}`);

    // 최대 3번 재시도 후 최종 placeholder 사용
    if (newAttempts >= 3) {
      console.log(`Max attempts reached for ${imageKey}, using final placeholder`);
      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzE3OS4wOSAxNTAgMTYyIDE2Ny4wOSAxNjIgMTg4QzE2MiAyMDguOTEgMTc5LjA5IDIyNiAyMDAgMjI2QzIyMC45MSAyMjYgMjM4IDIwOC45MSAyMzggMTg4QzIzOCAxNjcuMDkgMjIwLjkxIDE1MCAyMDAgMTUwWk0yMDAgMjQ2QzE3OS4wOSAyNDYgMTYyIDI2My4wOSAxNjIgMjg0QzE2MiAzMDQuOTEgMTc5LjA5IDMyMiAyMDAgMzIyQzIyMC45MSAzMjIgMjM4IDMwNC45MSAyMzggMjg0QzIzOCAyNjMuMDkgMjIwLjkxIDI0NiAyMDAgMjQ2WiIgZmlsbD0iIzlDQTBBNiIvPgo8L3N2Zz4K';
      
      setImageErrorStates(prev => ({
        ...prev,
        [imageKey]: { attempts: newAttempts, isFinal: true }
      }));
      return;
    }

    // Fallback 이미지 시도
    const fallbackIndex = Math.min(newAttempts - 1, FALLBACK_IMAGES.length - 1);
    e.target.src = FALLBACK_IMAGES[fallbackIndex];
    
    setImageErrorStates(prev => ({
      ...prev,
      [imageKey]: { attempts: newAttempts, isFinal: false }
    }));
  }, []);

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

  // Firebase에서 포트폴리오 데이터 로드
  useEffect(() => {
    const loadProjectsFromFirebase = () => {
      const projectsRef = ref(database, 'portfolio');
      onValue(projectsRef, (snapshot) => {
        const data = snapshot.val();
        
        if (data) {
          const formattedData = { residential: [], commercial: [] };
          
          console.log('Raw Firebase data:', data);
          
          Object.entries(data).forEach(([id, project]) => {
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
              type: project.type === 'residential' ? '아파트' : (project.businessType || '상업공간'),
              style: project.style || '모던 스타일',
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
    setSelectedFilters(prev => {
      const prevArr = prev[category] || [];
      let newArr;
      if (prevArr.includes(value)) {
        newArr = prevArr.filter(item => item !== value);
      } else {
        newArr = [...prevArr, value];
      }
      return {
        ...prev,
        [category]: newArr
      };
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

  const handleFilterChange = (category, value, event) => {
    console.log('Filter changed:', category, value);
    toggleFilter(category, value);
  };

  const handleCTAClick = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log('CTA clicked - navigating to contact');
    window.location.href = '/contact';
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

  const handleProjectClick = (project, event) => {
    // 이벤트가 있으면 기본 동작 방지
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log('Project clicked:', project);
    setSelectedProject(project);
  };

  const closeDetailView = () => {
    console.log('Closing detail view');
    setSelectedProject(null);
  };

  // 모달 관련 함수들
  const openModal = (imageUrl, project = selectedProject) => {
    if (project) {
      // 모든 이미지를 하나의 배열로 사용
      const projectAllImages = project.images;
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

    if (selectedProject || isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    if (isModalOpen) {
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
      if (!isModalOpen) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [selectedProject, isModalOpen, selectedImageIndex, allImages]);

  // Masonry layout component
  const MasonryGallery = ({ projects }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="group relative overflow-hidden rounded-2xl cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onClick={(event) => handleProjectClick(project, event)}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <ProjectImage
                src={project.image}
                alt={project.title}
                projectId={project.id}
                imageIndex={0}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              />
              
              {/* Full overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-500" />
              
              {/* Hover content */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="text-center text-white px-6">
                  <h3 className="text-xl font-bold mb-2 font-['Noto_Sans_KR']">{project.title}</h3>
                  <p className="text-sm text-gray-200 mb-1 font-['Noto_Sans_KR']">{project.type}</p>
                  <p className="text-sm text-gray-300 font-['Noto_Sans_KR']">{project.style}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
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
            transition={{ duration: 0.8, delay: 0.2 }}
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

              {/* Style */}
              <p className="text-sm md:text-md text-gray-500 font-['Noto_Sans_KR'] text-left">{project.style}</p>

              {/* Description */}
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed font-['Noto_Sans_KR'] text-left text-sm md:text-base">
                  {activeTab === 'residential' ? 
                    `${project.style} 스타일의 아파트 인테리어 프로젝트입니다. 주거 공간의 기능성과 심미성을 모두 고려한 설계로, 일상 속 편안함과 세련된 분위기를 동시에 구현했습니다.` :
                    `${project.style} 스타일의 ${project.type} 인테리어 프로젝트입니다. 공간의 특성을 살린 디자인으로, 실용성과 아름다움을 조화롭게 구현했습니다.`
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right side - Image gallery (including main image) */}
          <motion.div
            className="w-full md:w-2/3 p-4 md:p-16 overflow-y-auto"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="columns-1 md:columns-2 gap-4 md:gap-6 space-y-4 md:space-y-6">
              {/* Main image first */}
              <motion.div
                className="break-inside-avoid mb-4 md:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="relative overflow-hidden rounded-xl aspect-[4/5]">
                  <ProjectImage
                    src={project.images[0]}
                    alt={project.title}
                    projectId={project.id}
                    imageIndex={0}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      openModal(project.images[0]);
                    }}
                  />
                </div>
              </motion.div>

              {/* Sub images */}
              {project.images.slice(1).map((image, index) => (
                <motion.div
                  key={index}
                  className="break-inside-avoid mb-4 md:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                >
                  <div className="relative overflow-hidden rounded-xl aspect-[4/5]">
                    <ProjectImage
                      src={image}
                      alt={`${project.title} detail ${index + 1}`}
                      projectId={project.id}
                      imageIndex={index + 1}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
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
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // 개선된 이미지 컴포넌트 - 중복 이벤트 방지
  const ProjectImage = ({ src, alt, projectId, imageIndex = 0, className, onClick }) => {
    const imageKey = `${projectId}-${imageIndex}`;
    const isLoaded = imageLoadStates[imageKey];
    const errorState = imageErrorStates[imageKey];
    const imageRef = useRef(null);

    // 이미지 로드 핸들러 - 한 번만 실행되도록 처리
    const handleLoad = useCallback((e) => {
      // 이미지가 실제로 완전히 로드되었는지 확인
      if (e.target.complete && e.target.naturalWidth > 0) {
        handleImageLoad(projectId, imageIndex);
      }
    }, [projectId, imageIndex, handleImageLoad]);

    const handleError = useCallback((e) => {
      handleImageError(e, projectId, imageIndex);
    }, [projectId, imageIndex, handleImageError]);

    return (
      <div className="relative">
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className={className}
          onClick={onClick}
          onError={handleError}
          onLoad={handleLoad}
          // 중요: loading="lazy"를 제거하거나 조건부로 사용
          loading={imageIndex === 0 ? "eager" : "lazy"}
        />
        
        {/* 로딩 오버레이 - 조건 개선 */}
        {!isLoaded && !errorState?.isFinal && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center rounded-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    );
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      loadedImagesRef.current.clear();
      errorAttemptsRef.current = {};
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
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
            <section className="pt-16 pb-0 bg-gradient-to-br from-gray-50 to-white">
              <div className="w-full px-4">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-5xl font-bold text-gray-900 mb-4 font-['Noto_Sans_KR']">Portfolio</h1>
                </motion.div>
                <section className="py-1"></section>
              </div>
            </section>

            {/* 카테고리 선택 버튼 (히어로 아래, 여백 없이 센터정렬) */}
            <div className="w-full flex justify-center items-center bg-white">
              <div className="flex gap-0 md:gap-4 py-0 w-full md:w-auto px-4 md:px-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={(event) => handleCategoryClick(tab.id, event)}
                    className={`flex-1 md:w-64 h-12 rounded-xl text-base md:text-lg transition-all duration-300 font-['Noto_Sans_KR'] focus:outline-none ${
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


            {/* 필터 체크박스 (버튼 없이 바로 노출) */}
            <div className="w-full flex justify-center items-center py-4 bg-white border-b border-gray-100">
              <div className="flex flex-wrap gap-2 md:gap-4 justify-center max-w-full px-4">
                {activeTab === 'residential' ? (
                  ['20평▼', '30평형', '40평형', '50평형', '60평▲'].map((area) => (
                    <label
                      key={area}
                      htmlFor={`area-checkbox-${area}`}
                      className="flex items-center text-sm md:text-base font-['Noto_Sans_KR'] gap-2 cursor-pointer"
                    >
                      <input
                        id={`area-checkbox-${area}`}
                        key={area}
                        type="checkbox"
                        checked={selectedFilters.area.includes(area)}
                        onChange={(event) => handleFilterChange('area', area, event)}
                        className="accent-black rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      />
                      <span className="text-gray-700">{area}</span>
                    </label>
                  ))
                ) : (
                  ['카페', '레스토랑', '사무실', '상가', '뷰티샵'].map((type) => (
                    <label
                      key={type}
                      htmlFor={`type-checkbox-${type}`}
                      className="flex items-center text-sm md:text-base font-['Noto_Sans_KR'] gap-2 cursor-pointer"
                    >
                      <input
                        id={`type-checkbox-${type}`}
                        key={type}
                        type="checkbox"
                        checked={selectedFilters.type.includes(type)}
                        onChange={(event) => handleFilterChange('type', type, event)}
                        className="accent-black rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                      />
                      <span className="text-gray-700">{type}</span>
                    </label>
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
                  <LayoutGroup>
                    <MasonryGallery projects={getProjectsToShow()} />
                  </LayoutGroup>
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
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative max-w-[95vw] max-h-[95vh] bg-white rounded-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 z-20 w-8 h-8 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
                title="닫기 (ESC)"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Previous Button */}
              {allImages.length > 1 && (
                <button
                  onClick={goToPreviousImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                  title="이전 이미지 (←)"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Next Button */}
              {allImages.length > 1 && (
                <button
                  onClick={goToNextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                  title="다음 이미지 (→)"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Image Counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/50 text-white text-sm rounded-full font-['Noto_Sans_KR']">
                  {selectedImageIndex + 1} / {allImages.length}
                </div>
              )}

              {/* Image Container */}
              <div 
                className="relative flex items-center justify-center cursor-pointer max-w-full max-h-[95vh] bg-black"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToNextImage();
                }}
                title="클릭하여 다음 이미지 보기"
              >
                <ProjectImage
                  src={selectedImage}
                  alt="Expanded view"
                  projectId={selectedProject.id}
                  imageIndex={selectedImageIndex}
                  className="max-w-full max-h-[95vh] object-contain select-none"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
                
                {/* Left Arrow Overlay */}
                {allImages.length > 1 && (
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1/3 flex items-center justify-start pl-4 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      goToPreviousImage();
                    }}
                    title="이전 이미지"
                  >
                    <div className="w-12 h-12 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors duration-200">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {/* Right Arrow Overlay */}
                {allImages.length > 1 && (
                  <div 
                    className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      goToNextImage();
                    }}
                    title="다음 이미지"
                  >
                    <div className="w-12 h-12 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors duration-200">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}