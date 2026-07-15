import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import AboutSections from '../components/about/AboutSections';
import lukaSlogan from '../images/logo/luka-slogan.png';
import lukaSloganFooter from '../images/aboutluka/LUKA slogan.png';

// ABOUT LUKA — 2026-07 리뉴얼: 섹션 본문은 AboutSections(홈 하단과 공유, C안)로 단일화.
// 독립 페이지에서만 상단에 로고+슬로건을 배치한다(홈 연속 스크롤에선 navbar 슬로건과 중복이라 생략).
const AboutPage = () => {
  return (
    <div className="bg-white font-sans">
      <Navbar />
      <h1 className="sr-only">About Design LUKA — 회사 소개 및 디자인 철학</h1>

      <main className="pt-16 min-h-screen">
        {/* 로고 + 슬로건 (시안 상단) */}
        <div className="flex justify-center pt-14 pb-10 lg:pt-20 lg:pb-14 px-6">
          <motion.img
            src={lukaSlogan}
            alt="design LUKA — SHINE YOUR PLACE, FINE YOUR LIFE."
            draggable={false}
            className="h-12 md:h-16 w-auto select-none"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.22, 0.61, 0.36, 1] }}
          />
        </div>

        <AboutSections variant="page" />
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center flex justify-center items-center">
          <img
            src={lukaSloganFooter}
            alt="LUKA Slogan"
            className="w-[25%] h-auto object-contain filter invert brightness-0"
          />
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
