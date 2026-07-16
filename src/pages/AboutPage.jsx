import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';
import AboutSections from '../components/about/AboutSections';
import lukaSlogan from '../images/logo/luka-slogan.png';
import lukaSloganFooter from '../images/aboutluka/LUKA slogan.png';

// ABOUT LUKA — 섹션 본문은 AboutSections(홈 하단과 공유, C안).
// 상단 로고+슬로건은 메인 페이지를 참조해 스크롤이 시작되면 navbar 중앙으로
// 축소·핀 고정된다(2026-07-16 사장 지시). 스크롤러가 window가 아니라 body라서
// (index.css html,body height:100%) body 스크롤 이벤트에 직접 연동한다.
const NAV_H = 64;   // navbar 높이
const PIN_H = 34;   // 핀 고정 시 로고 높이

const AboutPage = () => {
  const navigate = useNavigate();
  const scrollMV = useMotionValue(0);

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const upd = () => setIsMobile(window.innerWidth <= 768);
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);

  useEffect(() => {
    const el = document.body;
    const onScroll = () => scrollMV.set(el.scrollTop);
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollMV]);

  // 헤더 자리에서 시작해 스크롤과 1:1로 따라 올라가다 navbar 중앙에 도킹
  const startH = isMobile ? 44 : 60;                    // 헤더 로고 높이
  const startY = isMobile ? 104 : 112;                  // 헤더 로고 top (뷰포트 기준)
  const spacerH = (startY - NAV_H) + startH + (isMobile ? 36 : 44); // 로고가 차지하던 in-flow 공간
  const pinY = (NAV_H - PIN_H) / 2;                     // 15px — navbar 세로 중앙
  const range = startY - pinY;

  const logoY = useTransform(scrollMV, (v) => Math.max(pinY, startY - v));
  const logoH = useTransform(scrollMV, [0, range], [startH, PIN_H], { clamp: true });
  const logoHpx = useTransform(logoH, (v) => `${v}px`);

  return (
    <div className="bg-white font-sans">
      <Navbar />
      <h1 className="sr-only">About Design LUKA — 회사 소개 및 디자인 철학</h1>

      {/* 로고 + 슬로건 — 스크롤 시 navbar 중앙으로 축소·핀 (메인 페이지 동작 참조) */}
      <motion.img
        src={lukaSlogan}
        alt="design LUKA — SHINE YOUR PLACE, FINE YOUR LIFE."
        draggable={false}
        onClick={() => navigate('/')}
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          translateX: '-50%',
          y: logoY,
          height: logoHpx,
          width: 'auto',
          zIndex: 50,
          cursor: 'pointer',
          userSelect: 'none',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, ease: [0.22, 0.61, 0.36, 1] }}
      />

      <main className="pt-16 min-h-screen">
        {/* 로고가 차지하던 자리 (fixed 로고의 in-flow 스페이서) */}
        <div style={{ height: `${spacerH}px` }} />

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
