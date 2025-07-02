import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Import main images (desktop)
import main01 from '../images/main/main01.jpg';
import main02 from '../images/main/main02.jpg';
import main03 from '../images/main/main03.jpg';
import main04 from '../images/main/main04.jpg';
import main05 from '../images/main/main05.jpg';
import main06 from '../images/main/main06.jpg';
import main07 from '../images/main/main07.jpg';
import main08 from '../images/main/main08.jpg';

// Import mobile images
import mobile01 from '../images/main/mobile/1.jpg';
import mobile02 from '../images/main/mobile/2.jpg';
import mobile03 from '../images/main/mobile/3.jpg';
import mobile04 from '../images/main/mobile/4.jpg';
import mobile05 from '../images/main/mobile/5.jpg';
import mobile06 from '../images/main/mobile/6.jpg';
import mobile07 from '../images/main/mobile/7.jpg';
import mobile08 from '../images/main/mobile/8.jpg';
import mobile09 from '../images/main/mobile/9.jpg';
import mobile10 from '../images/main/mobile/10.jpg';

const SLIDE_DURATION = 4500; // 4.5초로 변경

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [direction, setDirection] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const timerRef = useRef(null);
  const lastManualChangeRef = useRef(0);

  // 모바일/데스크탑 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 슬라이드 배열을 동적으로 생성 (모바일/데스크탑에 따라 다른 이미지 사용)
  const slides = [
    {
      id: 1,
      image: isMobile ? mobile01 : main01,
      title: '신반포 APT 25py'
    },
    {
      id: 2,
      image: isMobile ? mobile02 : main02,
      title: '관악 드림타운 33py'
    },
    {
      id: 3,
      image: isMobile ? mobile03 : main03,
      title: '럭셔리 아파트'
    },
    {
      id: 4,
      image: isMobile ? mobile04 : main04,
      title: '상업 공간 디자인'
    },
    {
      id: 5,
      image: isMobile ? mobile05 : main05,
      title: 'Design LUKA'
    },
    {
      id: 6,
      image: isMobile ? mobile06 : main06,
      title: '모던 인테리어'
    },
    {
      id: 7,
      image: isMobile ? mobile07 : main07,
      title: '프리미엄 공간'
    },
    {
      id: 8,
      image: isMobile ? mobile08 : main08,
      title: '엘레간트 디자인'
    },
    {
      id: 9,
      image: isMobile ? mobile09 : main01, // 모바일 전용 이미지
      title: '프리미엄 디자인'
    },
    {
      id: 10,
      image: isMobile ? mobile10 : main02, // 모바일 전용 이미지
      title: '럭셔리 인테리어'
    }
  ];

  // 자동 슬라이드 시작 함수
  const startAutoSlide = useCallback(() => {
    // 기존 타이머 클리어
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % slides.length;
        setDirection(1);
        setProgressKey(prevKey => prevKey + 1);
        return nextSlide;
      });
    }, SLIDE_DURATION);
  }, []);

  // 자동 슬라이드 기능
  useEffect(() => {
    startAutoSlide();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [startAutoSlide]);

  // 첫 번째 로드 후 isFirstLoad를 false로 설정
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFirstLoad(false);
    }, 100); // 첫 번째 슬라이드가 렌더링된 후 바로 false로 설정

    return () => clearTimeout(timer);
  }, []);

  // 통합된 슬라이드 변경 함수
  const handleSlideChange = useCallback((newSlide, newDirection = 1) => {
    const now = Date.now();
    
    // 수동 변경 시 타이머 재시작을 지연시켜 빠른 전환 방지
    if (now - lastManualChangeRef.current < SLIDE_DURATION) {
      // 기존 타이머 클리어
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // SLIDE_DURATION 후에 타이머 재시작
      setTimeout(() => {
        startAutoSlide();
      }, SLIDE_DURATION - (now - lastManualChangeRef.current));
    } else {
      // 충분한 시간이 지났으면 바로 재시작
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimeout(() => {
        startAutoSlide();
      }, 100);
    }

    setDirection(newDirection);
    setCurrentSlide(newSlide);
    setProgressKey(prev => prev + 1); // Progress bar 리셋
    lastManualChangeRef.current = now;
  }, [startAutoSlide]);

  const goToSlide = useCallback((index) => {
    const newDirection = index > currentSlide ? 1 : -1;
    handleSlideChange(index, newDirection);
  }, [currentSlide, handleSlideChange]);

  const goToPrevSlide = useCallback(() => {
    const prevSlide = (currentSlide - 1 + slides.length) % slides.length;
    handleSlideChange(prevSlide, -1);
  }, [currentSlide, handleSlideChange]);

  const goToNextSlide = useCallback(() => {
    const nextSlide = (currentSlide + 1) % slides.length;
    handleSlideChange(nextSlide, 1);
  }, [currentSlide, handleSlideChange]);

  // 터치 이벤트 핸들러 (모바일 스와이프)
  const minSwipeDistance = 15;

  const onTouchStart = (e) => {
    console.log('Touch start:', e.targetTouches[0].clientX);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    setDragOffset(0);
    
    // 드래그 중일 때 자동 슬라이드 중지
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const onTouchMove = (e) => {
    if (!touchStart) return;
    
    const currentTouch = e.targetTouches[0].clientX;
    const offset = currentTouch - touchStart;
    
    // 드래그 거리를 제한하여 과도한 이동 방지
    const maxDragDistance = window.innerWidth * 0.3;
    const clampedOffset = Math.max(-maxDragDistance, Math.min(maxDragDistance, offset));
    
    setDragOffset(clampedOffset);
    setTouchEnd(currentTouch);
  };

  const onTouchEnd = (e) => {
    console.log('Touch end:', touchStart, touchEnd);
    
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      // 자동 슬라이드 재시작
      setTimeout(() => {
      startAutoSlide();
      }, 100);
      return;
    }
    
    const distance = touchStart - touchEnd;
    console.log('Swipe distance:', distance);
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // 즉시 드래그 상태 해제
    setIsDragging(false);
    setDragOffset(0);

    if (isLeftSwipe) {
      console.log('Left swipe detected');
      goToNextSlide();
    } else if (isRightSwipe) {
      console.log('Right swipe detected');
      goToPrevSlide();
    } else {
      // 스와이프가 충분하지 않으면 원래 위치로 돌아감
      // 자동 슬라이드 재시작
      setTimeout(() => {
      startAutoSlide();
      }, 100);
    }
  };

  // 키보드 내비게이션
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      } else if (e.key === 'ArrowRight') {
        goToNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goToPrevSlide, goToNextSlide]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 모바일 뷰포트 높이 설정
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  // 이미지 프리로딩
  useEffect(() => {
    const preloadImages = () => {
      slides.forEach((slide) => {
        const img = new Image();
        img.src = slide.image;
      });
    };

    preloadImages();
  }, []);

  return (
    <>
      <Navbar />
      <main 
        className="relative w-screen h-screen overflow-hidden mobile-full-height"
        style={{ 
          height: '100vh',
          height: '100dvh',
          minHeight: '100vh',
          width: '100vw',
          overflow: 'hidden',
          position: 'relative',
          background: 'black'
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* 슬라이드 카루셀 구조 */}
        <div className="absolute inset-0 w-full h-full">
          {slides.map((slide, idx) => {
            // 현재 슬라이드와의 거리 계산
            const offset = idx - currentSlide;
            // 드래그 중이면 오프셋 적용
            const dragX = isDragging ? dragOffset : 0;
            // x값 계산 (px)
            const xValue = `calc(${offset * 100}vw + ${offset === 0 ? dragX : 0}px)`;
            return (
              <motion.div
                key={slide.id}
                className="absolute top-0 left-0 w-full h-full"
                animate={{ x: xValue }}
                transition={{ type: 'tween', duration: isDragging ? 0 : 0.6 }}
                style={{ willChange: 'transform', width: '100vw', height: '100vh' }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 w-full h-full"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                  }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
                {/* Brand Logo Watermark */}
                <motion.div
                  className="absolute bottom-8 right-8 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <div className="text-white/30 text-xs sm:text-sm font-light tracking-widest">
                    DESIGN LUKA
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Arrows - 데스크톱용 */}
        <button
          onClick={goToPrevSlide}
          className="hidden lg:flex absolute left-8 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 hover:bg-black/40 active:bg-black/50 backdrop-blur-sm transition-all duration-200 active:scale-95 items-center justify-center group"
          aria-label="이전 슬라이드"
        >
          <svg className="w-6 h-6 text-white transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={goToNextSlide}
          className="hidden lg:flex absolute right-8 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 hover:bg-black/40 active:bg-black/50 backdrop-blur-sm transition-all duration-200 active:scale-95 items-center justify-center group"
          aria-label="다음 슬라이드"
        >
          <svg className="w-6 h-6 text-white transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3 lg:space-x-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>

        {/* Progress Bar with Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
          <motion.div
            key={progressKey}
            className="h-full bg-gradient-to-r from-white/60 to-white/80"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: SLIDE_DURATION / 1000, 
              ease: [0.4, 0, 0.2, 1]
            }}
          />
        </div>

        {/* Mobile Touch Instruction */}
        {/* <motion.div
          className="sm:hidden absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 text-white/40 text-xs text-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          좌우로 스와이프하여 이동
        </motion.div> */}
      </main>
    </>
  );
};

export default HomePage; 