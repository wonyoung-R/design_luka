import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDownIcon } from '@heroicons/react/24/outline';

const heroImage = "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80";

export default function Hero() {
  const scrollToFooter = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
    }
  };

  return (
    <section className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Modern interior design"
          className="object-cover h-full w-full"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/80 to-primary-dark/40"></div>
      </div>

      {/* Content */}
      <motion.div
        className="container relative z-10 text-white pt-16 px-4 text-center sm:text-left"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl mx-auto sm:mx-0"
          variants={itemVariants}
        >
          <span className="block">공간의 가치를</span>
          <span className="block text-accent-light">재창조합니다</span>
        </motion.h1>
        
        <motion.p 
          className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl max-w-2xl text-neutral-light mx-auto sm:mx-0"
          variants={itemVariants}
        >
          보다 실용적이고 아름다운 공간을 위한 맞춤형 인테리어 솔루션을 제공합니다. 
          당신의 공간에 새로운 에너지를 불어넣어 보세요.
        </motion.p>
        
        <motion.div 
          className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start"
          variants={itemVariants}
        >
          <Link to="/contact" className="btn-primary w-full sm:w-auto justify-center">
            무료 상담 신청
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.button
          onClick={scrollToFooter}
          className="flex flex-col items-center text-white opacity-80 hover:opacity-100 transition-opacity"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <span className="text-xs sm:text-sm mb-2">더 알아보기</span>
          <ArrowDownIcon className="h-4 w-4 sm:h-6 sm:w-6" />
        </motion.button>
      </motion.div>
    </section>
  );
} 