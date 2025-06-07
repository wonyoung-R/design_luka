import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneIcon, ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 60% of the viewport height
      const shouldShow = window.scrollY > window.innerHeight * 0.6;
      if (shouldShow !== isVisible) {
        setIsVisible(shouldShow);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          {/* Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="bg-white rounded-xl shadow-xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="py-2 px-4 bg-primary-dark text-white text-sm font-medium">
                  빠른 연락하기
                </div>
                <a
                  href="tel:01012345678"
                  className="flex items-center py-3 px-4 hover:bg-neutral-lightest transition-colors"
                >
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mr-3">
                    <PhoneIcon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">전화 상담</p>
                    <p className="text-xs text-primary-light">010-1234-5678</p>
                  </div>
                </a>
                <a
                  href="#contact"
                  className="flex items-center py-3 px-4 hover:bg-neutral-lightest transition-colors"
                >
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mr-3">
                    <ChatBubbleLeftRightIcon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">무료 견적 상담</p>
                    <p className="text-xs text-primary-light">양식 작성하기</p>
                  </div>
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Estimate Button */}
          <motion.a
            href="#contact"
            className="bg-accent text-white py-3 px-6 rounded-full shadow-lg flex items-center space-x-2 hover:bg-accent-dark transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-medium">10초 견적 계산기</span>
          </motion.a>

          {/* Main Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center ${
              isOpen ? 'bg-primary-dark text-white' : 'bg-white text-primary-dark'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 