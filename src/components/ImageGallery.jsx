import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ImageGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 이미지 최적화를 위한 사이즈 계산
  const getImageSize = (index) => {
    if (isMobile) return 'w-full';
    
    // 데스크톱에서 지그재그 패턴을 위한 사이즈 조정
    const isEven = index % 2 === 0;
    return isEven ? 'md:col-span-1 md:row-span-2' : 'md:col-span-1 md:row-span-1';
  };

  // 이미지 로딩 최적화
  const getImageUrl = (url, size = 'medium') => {
    // 실제 구현시에는 이미지 CDN이나 최적화 서비스를 사용
    // 예: Cloudinary, Imgix, 또는 Next.js Image Optimization
    return url;
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* 데스크톱: 지그재그 그리드 */}
      <div className="hidden md:grid grid-cols-2 auto-rows-[200px] gap-4">
        {images.map((img, index) => (
          <motion.div
            key={index}
            className={`relative overflow-hidden rounded-lg cursor-pointer ${getImageSize(index)}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => setSelectedImage(img)}
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={getImageUrl(img)}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover"
              loading={index < 4 ? "eager" : "lazy"}
            />
          </motion.div>
        ))}
      </div>

      {/* 모바일: 그라데이션 더보기 */}
      <div className="md:hidden">
        <div 
          className={`space-y-4 transition-all duration-500 ${
            !showMore ? 'max-h-[60vh] overflow-hidden' : ''
          }`}
        >
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative aspect-[4/3] overflow-hidden rounded-lg"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={getImageUrl(img)}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index < 2 ? "eager" : "lazy"}
              />
            </motion.div>
          ))}
        </div>
        
        {!showMore && images.length > 2 && (
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none">
            <button
              onClick={() => setShowMore(true)}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-2 rounded-full pointer-events-auto hover:bg-gray-800 transition-colors"
            >
              더보기
            </button>
          </div>
        )}
      </div>

      {/* 이미지 모달 */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Selected image"
                className="max-w-full max-h-[90vh] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 