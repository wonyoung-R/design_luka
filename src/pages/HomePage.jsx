import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Import main images
import main01 from '../images/main/main01.jpg';
import main02 from '../images/main/main02.jpg';
import main03 from '../images/main/main03.jpg';
import main04 from '../images/main/main04.jpg';
import main05 from '../images/main/main05.jpg';
import main06 from '../images/main/main06.jpg';
import main07 from '../images/main/main07.jpg';
import main08 from '../images/main/main08.jpg';

const SLIDE_DURATION = 3000; // 3초로 변경

const slides = [
  {
    id: 1,
    image: main01,
    title: '신반포 APT 25py'
  },
  {
    id: 2,
    image: main02,
    title: '관악 드림타운 33py'
  },
  {
    id: 3,
    image: main03,
    title: '럭셔리 아파트'
  },
  {
    id: 4,
    image: main04,
    title: '상업 공간 디자인'
  },
  {
    id: 5,
    image: main05,
    title: 'Design LUKA'
  },
  {
    id: 6,
    image: main06,
    title: '모던 인테리어'
  },
  {
    id: 7,
    image: main07,
    title: '프리미엄 공간'
  },
  {
    id: 8,
    image: main08,
    title: '엘레간트 디자인'
  }
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [direction, setDirection] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  
  const timerRef = useRef(null);

  // 통합된 슬라이드 변경 함수
  const handleSlideChange = useCallback((newSlide, newDirection = 1) => {
    // 기존 타이머 클리어
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setDirection(newDirection);
    setCurrentSlide(newSlide);
    setProgressKey(prev => prev + 1); // Progress bar 리셋

    // 자동 슬라이드 타이머 재시작
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % slides.length;
        setDirection(1);
        setProgressKey(prevKey => prevKey + 1);
        return nextSlide;
      });
    }, SLIDE_DURATION - 1000); // 슬라이드 전환을 1초 일찍 시작
  }, []);

  // 자동 슬라이드 시작 함수
  const startAutoSlide = useCallback(() => {
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
    setDragOffset(offset);
    setTouchEnd(currentTouch);
  };

  const onTouchEnd = (e) => {
    console.log('Touch end:', touchStart, touchEnd);
    setIsDragging(false);
    
    if (!touchStart || !touchEnd) {
      setDragOffset(0);
      // 자동 슬라이드 재시작
      startAutoSlide();
      return;
    }
    
    const distance = touchStart - touchEnd;
    console.log('Swipe distance:', distance);
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      console.log('Left swipe detected');
      setDragOffset(0);
      goToNextSlide();
    } else if (isRightSwipe) {
      console.log('Right swipe detected');
      setDragOffset(0);
      goToPrevSlide();
    } else {
      // 스와이프가 충분하지 않으면 원래 위치로 돌아감
      setDragOffset(0);
    }
    
    // 자동 슬라이드 재시작
    startAutoSlide();
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

  return (
    <>
      <Navbar />
      <main 
        className="relative w-full h-screen overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="sync" custom={direction}>
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            custom={direction}
            variants={{
              enter: (direction) => ({
                x: isFirstLoad ? 0 : (direction > 0 ? '100%' : '-100%'),
                opacity: 1
              }),
              center: {
                zIndex: 1,
                x: 0,
                opacity: 1
              },
              exit: (direction) => ({
                zIndex: 0,
                x: direction < 0 ? '100%' : '-100%',
                opacity: 1
              })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            style={{
              x: isDragging && Math.abs(dragOffset) > 5 ? dragOffset : 0
            }}
            transition={{
              x: { 
                type: "tween", 
                duration: isFirstLoad ? 0 : (isDragging ? 0 : 1.2), 
                ease: isDragging ? "linear" : [0.25, 0.46, 0.45, 0.94]
              },
              opacity: { 
                duration: isFirstLoad ? 0 : 0.3,
                ease: [0.25, 0.46, 0.45, 0.94]
              }
            }}
          >
            {/* Background Image - 전체 화면 최적화 */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url(${slides[currentSlide].image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            
            {/* Preload next and previous images for smooth transitions */}
            <div 
              className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
              style={{
                backgroundImage: `url(${slides[(currentSlide + 1) % slides.length].image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <div 
              className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
              style={{
                backgroundImage: `url(${slides[(currentSlide - 1 + slides.length) % slides.length].image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            
            {/* Gradient Overlay for better text readability */}
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
        </AnimatePresence>

        {/* Navigation Arrows - 데스크톱용 */}
        <button
          onClick={goToPrevSlide}
          className="hidden lg:flex absolute left-8 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full hover:bg-white/20 active:bg-white/35 backdrop-blur-sm transition-all duration-150 active:scale-95 items-center justify-center group"
          aria-label="이전 슬라이드"
        >
          <svg className="w-6 h-6 text-white group-hover:scale-110 group-active:scale-90 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={goToNextSlide}
          className="hidden lg:flex absolute right-8 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full hover:bg-white/20 active:bg-white/35 backdrop-blur-sm transition-all duration-150 active:scale-95 items-center justify-center group"
          aria-label="다음 슬라이드"
        >
          <svg className="w-6 h-6 text-white group-hover:scale-110 group-active:scale-90 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              ease: [0.25, 0.46, 0.45, 0.94]
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