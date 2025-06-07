import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { DevicePhoneMobileIcon, SwatchIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// Example color palettes
const colorPalettes = [
  {
    id: 1,
    name: '모던 그레이',
    colors: ['#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA', '#6C757D', '#343A40'],
    roomImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    name: '내추럴 베이지',
    colors: ['#F8F9FA', '#FAF3E0', '#D4C7B0', '#A69CAC', '#6C757D', '#343A40'],
    roomImage: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    name: '블루 그린',
    colors: ['#F8F9FA', '#E3F2FD', '#BBDEFB', '#90CAF9', '#4FC3F7', '#1565C0'],
    roomImage: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  },
];

export default function InteractiveFeatures() {
  const [currentPaletteIndex, setCurrentPaletteIndex] = useState(0);
  const [showARInfo, setShowARInfo] = useState(false);
  
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const nextPalette = () => {
    setCurrentPaletteIndex((prev) => (prev + 1) % colorPalettes.length);
  };

  const currentPalette = colorPalettes[currentPaletteIndex];

  return (
    <section id="interactive-features" className="section bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-accent/5 rounded-bl-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 rounded-tr-full -z-10"></div>
      
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="inline-block px-3 py-1 text-sm font-medium bg-accent-light/10 text-accent rounded-full mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            인터랙티브 도구
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            공간을 미리 경험해보세요
          </motion.h2>
          <motion.p
            className="text-primary-light text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            최신 기술로 공간의 변화를 미리 시뮬레이션하고 인테리어 결정에 확신을 더하세요.
          </motion.p>
        </div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* AR Furniture Placement */}
          <motion.div
            className="rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <LazyLoadImage
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                alt="AR Furniture Placement"
                effect="blur"
                className="w-full h-[350px] object-cover"
              />
              <div 
                className="absolute inset-0 bg-primary-dark/70 flex flex-col items-center justify-center text-white text-center p-6"
                style={{ opacity: showARInfo ? 1 : 0, transition: 'opacity 0.3s ease' }}
              >
                <h3 className="text-2xl font-bold mb-4">AR 가구 배치 체험하기</h3>
                <p className="mb-6">
                  스마트폰 카메라로 실제 공간을 비추면 가상 가구를 배치해볼 수 있습니다.
                  다양한 스타일과 크기의 가구를 실시간으로 시뮬레이션하세요.
                </p>
                <a href="#ar-demo" className="btn-primary">
                  AR 데모 시작하기
                </a>
              </div>
              <motion.button
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                onClick={() => setShowARInfo(!showARInfo)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="bg-white rounded-full p-4 shadow-lg">
                  <DevicePhoneMobileIcon className="w-8 h-8 text-accent" />
                </div>
              </motion.button>
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-xl font-bold mb-2">AR 가구 배치</h3>
              <p className="text-primary-light mb-4">
                증강현실 기술로 실제 공간에 가구를 배치해보고 어울리는지 확인해보세요.
              </p>
              <div className="flex items-center">
                <span className="text-xs font-medium bg-accent/10 text-accent px-2 py-1 rounded-full">
                  모바일 전용
                </span>
              </div>
            </div>
          </motion.div>

          {/* Color Palette Tester */}
          <motion.div
            className="rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <LazyLoadImage
                src={currentPalette.roomImage}
                alt="Color Palette Tester"
                effect="blur"
                className="w-full h-[350px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-2">{currentPalette.name}</h3>
                <div className="flex space-x-2 mb-4">
                  {currentPalette.colors.map((color, index) => (
                    <motion.div
                      key={index}
                      className="w-8 h-8 rounded-full shadow-md"
                      style={{ backgroundColor: color }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    />
                  ))}
                </div>
                <motion.button
                  className="flex items-center text-white bg-white/20 px-3 py-2 rounded-full backdrop-blur-sm"
                  onClick={nextPalette}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  다음 팔레트 보기
                </motion.button>
              </div>
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-xl font-bold mb-2">색상 팔레트 테스터</h3>
              <p className="text-primary-light mb-4">
                다양한 색상 조합을 실제 공간에 적용해보고 분위기 변화를 경험해보세요.
              </p>
              <div className="flex items-center">
                <SwatchIcon className="w-5 h-5 text-accent mr-2" />
                <span className="text-sm text-primary-light">
                  {colorPalettes.length}개의 큐레이션된 팔레트
                </span>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-16 text-center">
          <motion.a
            href="#tools"
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            모든 인터랙티브 도구 보기
          </motion.a>
        </div>
      </div>
    </section>
  );
} 