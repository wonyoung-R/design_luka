import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // 자동 슬라이드 기능
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10800); // 9000 * 1.2 = 10800ms (20% 느리게)

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000); // 10초 후 자동재생 재개
  }, []);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  }, []);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  }, []);

  // 터치 이벤트 핸들러 (모바일 스와이프)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNextSlide();
    }
    if (isRightSwipe) {
      goToPrevSlide();
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

  return (
    <>
      <Navbar />
      <main 
        className="relative w-full h-screen overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            {/* Background Image - 전체 화면 최적화 */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url(${slides[currentSlide].image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
              }}
            />
            
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
            
            {/* Brand Logo Watermark */}
            <motion.div
              className="absolute bottom-8 right-8 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
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
          className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 items-center justify-center group"
          aria-label="이전 슬라이드"
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={goToNextSlide}
          className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 items-center justify-center group"
          aria-label="다음 슬라이드"
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
          <motion.div
            className="h-full bg-white/60"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            key={currentSlide}
            transition={{ duration: 10.8, ease: "linear" }}
          />
        </div>

        {/* Mobile Touch Instruction */}
        <motion.div
          className="sm:hidden absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 text-white/40 text-xs text-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          좌우로 스와이프하여 이동
        </motion.div>
      </main>
    </>
  );
} 