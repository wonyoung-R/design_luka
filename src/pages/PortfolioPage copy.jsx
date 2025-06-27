import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { XMarkIcon } from '@heroicons/react/24/outline';


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
        image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        aspectRatio: 'aspect-[3/4]',
        mainImage: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        subImages: [
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 2,
        title: '관악 드림타운 33py',
        location: '관악구 신림동',
        area: '33평',
        type: '아파트',
        style: '스칸디나비안',
        image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        aspectRatio: 'aspect-[4/5]',
        mainImage: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        subImages: [
          'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 3,
        title: '강남 타워팰리스',
        location: '강남구 도곡동',
        area: '45평',
        type: '아파트',
        style: '럭셔리 클래식',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        aspectRatio: 'aspect-[1/1]',
        mainImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        subImages: [
          'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 4,
        title: '서초 래미안',
        location: '서초구 서초동',
        area: '28평',
        type: '아파트',
        style: '모던 컨템포러리',
        image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        aspectRatio: 'aspect-[5/6]',
        mainImage: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        subImages: [
          'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 5,
        title: '송파 잠실 리센츠',
        location: '송파구 잠실동',
        area: '38평',
        type: '아파트',
        style: '내추럴 모던',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        aspectRatio: 'aspect-[2/3]',
        mainImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        subImages: [
          'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 6,
        title: '마포 상암 DMC',
        location: '마포구 상암동',
        area: '42평',
        type: '아파트',
        style: '인더스트리얼',
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        aspectRatio: 'aspect-[4/3]',
        mainImage: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        subImages: [
          'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
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
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        aspectRatio: 'aspect-[3/4]',
        mainImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        subImages: [
          'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 102,
        title: '서초 오피스',
        location: '서초구 서초동',
        area: '50평',
        type: '사무실',
        style: '모던 오피스',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        aspectRatio: 'aspect-[4/5]',
        mainImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        subImages: [
          'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 103,
        title: '압구정 뷰티샵',
        location: '강남구 압구정동',
        area: '15평',
        type: '뷰티샵',
        style: '미니멀 럭셔리',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        aspectRatio: 'aspect-[1/1]',
        mainImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        subImages: [
          'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 104,
        title: '송파 레스토랑',
        location: '송파구 잠실동',
        area: '35평',
        type: '레스토랑',
        style: '모던 클래식',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        aspectRatio: 'aspect-[2/3]',
        mainImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        subImages: [
          'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
      }
    ]
  };

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
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="group relative overflow-hidden rounded-2xl cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onClick={() => handleProjectClick(project)}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
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
          className="fixed top-6 right-6 z-60 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
          title="포트폴리오로 돌아가기"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex h-full">
          {/* Left side - Project info */}
          <motion.div
            className="w-1/3 p-16 flex flex-col justify-center bg-gray-50"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-6">
              {/* Project type & info */}
              <div className="flex items-center gap-2 text-sm text-gray-600 font-['Noto_Sans_KR']">
                <span className="px-3 py-1 bg-gray-200 rounded-full">
                  {project.type === 'residential' ? '주거 공간' : '상업 공간'}
                </span>
                <span>•</span>
                <span>{project.area}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 font-['Noto_Sans_KR']">{project.title}</h1>

              {/* Location */}
              <p className="text-lg text-gray-600 font-['Noto_Sans_KR']">{project.location}</p>

              {/* Style */}
              <p className="text-md text-gray-500 font-['Noto_Sans_KR']">{project.style}</p>

              {/* Description */}
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed font-['Noto_Sans_KR']">
                  {project.type === 'residential' ? 
                    `${project.style} 스타일의 아파트 인테리어 프로젝트입니다. 주거 공간의 기능성과 심미성을 모두 고려한 설계로, 일상 속 편안함과 세련된 분위기를 동시에 구현했습니다.` :
                    `${project.style} 스타일의 ${project.type} 인테리어 프로젝트입니다. 공간의 특성을 살린 디자인으로, 실용성과 아름다움을 조화롭게 구현했습니다.`
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right side - Image gallery (including main image) */}
          <motion.div
            className="w-2/3 p-16 overflow-y-auto"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {/* Main image first */}
              <motion.div
                className="break-inside-avoid mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => openModal(project.mainImage)}
                  />
                </div>
              </motion.div>

              {/* Sub images */}
              {project.subImages.map((image, index) => (
                <motion.div
                  key={index}
                  className="break-inside-avoid mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
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

  return (
    <div className="min-h-screen bg-white font-['Noto_Sans_KR']">
      {/* Main content - only show if no project is selected */}
      <Navbar />
      <AnimatePresence>
        {!selectedProject && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
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
              <div className="flex gap-4 py-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-64 h-12 rounded-xl text-lg  transition-all duration-300 font-['Noto_Sans_KR'] focus:outline-none ${
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
              <div className="flex flex-wrap gap-4">
                {activeTab === 'residential' ? (
                  ['20평▼', '30평형', '40평형', '50평형', '60평▲'].map((area) => (
                    <label key={area} className="flex items-center text-base font-['Noto_Sans_KR'] gap-2 cursor-pointer">
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
                    <label key={type} className="flex items-center text-base font-['Noto_Sans_KR'] gap-2 cursor-pointer">
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
            <section class="py-2"></section>
            {/* Main Content */}
            <section className="pb-16">
              <div className="w-full px-4">
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
              className="fixed bottom-8 right-8 z-40"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-black rounded-2xl shadow-2xl hover:bg-gray-100 transition-all duration-300 font-bold font-['Noto_Sans_KR']"
                onClick={() => window.location.href = '/design_luka/contact'}
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
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
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
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/50 text-white text-sm rounded-full font-['Noto_Sans_KR']">
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
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}