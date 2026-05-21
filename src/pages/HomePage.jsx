import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { SCROLL_RANGE, SPRING_SETTLE, SCROLL_ROOM } from '../constants/homeScroll';

// Hero background images (crossfade rotation)
import main09 from '../images/main/main09.JPG';
import main08 from '../images/main/main08.jpg';
import main07 from '../images/main/main07.jpg';
import mobile01 from '../images/main/mobile/1.jpg';

// Grid section images
import main01 from '../images/main/main01.jpg';
import main02 from '../images/main/main02.jpg';
import main03 from '../images/main/main03.jpg';
import main04 from '../images/main/main04.jpg';
import main05 from '../images/main/main05.jpg';
import main06 from '../images/main/main06.jpg';

// Hero brand-text start font size (px). Reduced on mobile so "design LUKA"
// fits within narrow viewports (it overflowed ~22px at 375px width).
// Desktop value is unchanged from the original design.
const HERO_FONT_DESKTOP = 46;
const HERO_FONT_MOBILE = 32;
const SPRING_CFG = { stiffness: 52, damping: 19, mass: 1 };

const BG_DESKTOP = [main09, main08, main07];
const BG_MOBILE  = [mobile01, mobile01, mobile01]; // single mobile image (can expand later)

const HomePage = () => {
  const scrollRef = useRef(null);
  const { scrollY } = useScroll({ container: scrollRef });

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  // Track viewport height so the brand text stays vertically centered after
  // resize / orientation change (previously captured once at module load).
  const [viewportH, setViewportH] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 768
  );

  useEffect(() => {
    const upd = () => {
      setIsMobile(window.innerWidth <= 768);
      setViewportH(window.innerHeight);
    };
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);

  const heroFont = isMobile ? HERO_FONT_MOBILE : HERO_FONT_DESKTOP;

  // Notify Navbar when grid section enters view
  const handleScroll = useCallback(() => {
    const top = scrollRef.current?.scrollTop ?? 0;
    window.dispatchEvent(new CustomEvent('homePageScroll', { detail: { scrollTop: top } }));
  }, []);

  const BG = isMobile ? BG_MOBILE : BG_DESKTOP;

  // ─── Background image crossfade ────────────────────────────────────────
  // Three overlapping images fade in/out across the hero scroll range.
  // No spring here — precise scroll-driven timing.
  const bg0Opacity = useTransform(scrollY, [0, 80, 200],    [1, 1, 0]);
  const bg1Opacity = useTransform(scrollY, [80, 200, 330, 430], [0, 1, 1, 0]);
  const bg2Opacity = useTransform(scrollY, [300, 430],      [0, 1]);

  const bgOpacities = [bg0Opacity, bg1Opacity, bg2Opacity];

  // ─── Text animation (spring smoothed) ──────────────────────────────────
  const rawY           = useTransform(scrollY, [0, SCROLL_RANGE], [viewportH / 2 - heroFont * 0.6, 24]);
  const rawFontSize    = useTransform(scrollY, [0, SCROLL_RANGE], [heroFont, 12]);
  const rawSpacing     = useTransform(scrollY, [0, SCROLL_RANGE], [12, 3]);

  const textY          = useSpring(rawY,        SPRING_CFG);
  const smoothFont     = useSpring(rawFontSize, SPRING_CFG);
  const smoothSpacing  = useSpring(rawSpacing,  SPRING_CFG);

  const fontSize       = useTransform(smoothFont,    v => `${Math.max(11, Math.min(heroFont, v)).toFixed(1)}px`);
  const letterSpacing  = useTransform(smoothSpacing, v => `${v.toFixed(1)}px`);

  // Brand text fades out as it approaches navbar (timed with spring settling)
  const textOpacity = useTransform(
    scrollY,
    [SCROLL_RANGE - 40, SCROLL_RANGE + SPRING_SETTLE - 20],
    [1, 0]
  );

  // Scroll indicator fades quickly
  const indicatorOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  return (
    <>
      <Navbar />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'auto', zIndex: 0 }}
        onContextMenu={e => e.preventDefault()}
      >
        {/* ── Sticky hero: stays at top while scroll room passes ────────── */}
        <div style={{ position: 'sticky', top: 0, height: '100vh' }}>

          {/* Crossfading background images */}
          {BG.map((src, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: bgOpacities[i],
                willChange: 'opacity',
              }}
            />
          ))}

          {/* Gradient overlay — always on top of images */}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.04) 42%, rgba(0,0,0,0.42) 100%)',
              zIndex: 1,
            }}
          />
        </div>

        {/*
          Scroll room: SCROLL_ROOM px (480).
          At scrollTop = SCROLL_ROOM, the grid section top reaches the viewport bottom.
          By then the spring has settled and the text is at navbar position.
        */}
        <div style={{ height: `${SCROLL_ROOM}px` }} />

        {/* ── Grid section ──────────────────────────────────────────────── */}
        <div style={{ background: '#fff', position: 'relative', zIndex: 5, wordBreak: 'keep-all' }}>

          {/* Header bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: isMobile ? '48px 24px 32px' : '72px 64px 44px',
              borderBottom: '1px solid #e5e5e5',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
              <h2 style={{
                fontFamily: "'Pretendard Variable', Pretendard, system-ui, sans-serif",
                fontSize: isMobile ? '28px' : '40px',
                fontWeight: 400, color: '#111',
                letterSpacing: '-0.5px', margin: 0, lineHeight: 1,
              }}>Selected Works</h2>
              <span style={{ fontSize: '10px', color: '#aaa', letterSpacing: '2px', fontWeight: 300 }}>
                2020 — 2025
              </span>
            </div>
            <Link to="/portfolio" style={{
              fontSize: '10px', letterSpacing: '3px', color: '#555',
              textDecoration: 'none', textTransform: 'uppercase', flexShrink: 0,
            }}>View All</Link>
          </div>

          {/* ── Featured 2-column ── */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
            <div style={{ position: 'relative', overflow: 'hidden', minHeight: isMobile ? '300px' : '520px' }}>
              <motion.img
                src={main01} alt="주거공간"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onContextMenu={e => e.preventDefault()}
              />
              <div style={{
                position: 'absolute', bottom: '24px', left: '24px',
                background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)',
                padding: '10px 16px',
              }}>
                <span style={{ fontSize: '9px', letterSpacing: '3px', color: '#999', display: 'block', textTransform: 'uppercase', marginBottom: '3px' }}>Residential</span>
                <span style={{ fontSize: '13px', color: '#111', fontFamily: "'Pretendard Variable', Pretendard, system-ui, sans-serif" }}>강동 래미안 36PY</span>
              </div>
            </div>

            <div style={{
              padding: isMobile ? '40px 24px' : '72px 60px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              background: '#f8f7f5',
            }}>
              <span style={{ fontSize: '9px', letterSpacing: '4px', color: '#bbb', textTransform: 'uppercase', marginBottom: '22px', display: 'block' }}>01 / Featured</span>
              <h3 style={{
                fontFamily: "'Pretendard Variable', Pretendard, system-ui, sans-serif",
                fontSize: isMobile ? '24px' : '30px', fontWeight: 400,
                color: '#1a1a1a', lineHeight: 1.45, marginBottom: '22px',
              }}>공간을 통해<br />삶의 격을 높이다</h3>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#777', marginBottom: '36px', maxWidth: '340px' }}>
                자연의 질감과 고요한 빛을 담은 주거공간. 소재의 진정성과 비례의 아름다움이 일상의 품격을 만듭니다.
              </p>
              <Link to="/portfolio?category=residential" style={{
                fontSize: '10px', letterSpacing: '3px', color: '#111',
                textDecoration: 'none', textTransform: 'uppercase',
                display: 'inline-flex', alignItems: 'center', gap: '14px',
              }}>
                View Project
                <span style={{ display: 'block', width: '40px', height: '1px', background: '#111' }} />
              </Link>
            </div>
          </div>

          {/* ── 3-column grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', borderTop: '1px solid #e5e5e5' }}>
            {[
              { img: main02, cat: 'Residential', title: '한강변 아파트 42PY', num: '02' },
              { img: main03, cat: 'Residential', title: '성수동 복합주거 55PY', num: '03' },
              { img: main04, cat: 'Commercial',  title: '청담동 플래그십 스토어', num: '04' },
            ].map((item, i) => (
              <div key={i} style={{
                borderRight: !isMobile && i < 2 ? '1px solid #e5e5e5' : 'none',
                borderTop: isMobile && i > 0 ? '1px solid #e5e5e5' : 'none',
              }}>
                <div style={{ overflow: 'hidden', aspectRatio: isMobile ? '16/9' : '4/5' }}>
                  <motion.img
                    src={item.img} alt={item.title}
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onContextMenu={e => e.preventDefault()}
                  />
                </div>
                <div style={{ padding: '18px 24px 26px', borderTop: '1px solid #e5e5e5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <span style={{ fontSize: '9px', letterSpacing: '3px', color: '#bbb', textTransform: 'uppercase' }}>{item.cat}</span>
                    <span style={{ fontSize: '10px', color: '#ddd' }}>{item.num}</span>
                  </div>
                  <p style={{ fontSize: '16px', fontFamily: "'Pretendard Variable', Pretendard, system-ui, sans-serif", color: '#1a1a1a', margin: 0, fontWeight: 400 }}>{item.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Commercial dark panel ── */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', borderTop: '1px solid #e5e5e5' }}>
            <div style={{
              background: '#141414',
              padding: isMobile ? '48px 24px' : '72px 60px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              order: isMobile ? 2 : 0,
            }}>
              <span style={{ fontSize: '9px', letterSpacing: '4px', color: '#555', textTransform: 'uppercase', marginBottom: '22px', display: 'block' }}>05 / Commercial</span>
              <h3 style={{
                fontFamily: "'Pretendard Variable', Pretendard, system-ui, sans-serif",
                fontSize: isMobile ? '24px' : '30px', fontWeight: 400,
                color: '#f0efed', lineHeight: 1.45, marginBottom: '22px',
              }}>브랜드의 철학을<br />공간에 담다</h3>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#666', marginBottom: '36px', maxWidth: '340px' }}>
                상업공간은 브랜드와 고객이 처음 만나는 접점입니다. design LUKA는 브랜드의 본질을 공간 언어로 번역합니다.
              </p>
              <Link to="/portfolio?category=commercial" style={{
                fontSize: '10px', letterSpacing: '3px', color: '#f0efed',
                textDecoration: 'none', textTransform: 'uppercase',
                display: 'inline-flex', alignItems: 'center', gap: '14px',
              }}>
                View Project
                <span style={{ display: 'block', width: '40px', height: '1px', background: '#f0efed' }} />
              </Link>
            </div>
            <div style={{ overflow: 'hidden', minHeight: isMobile ? '300px' : '500px', order: isMobile ? 1 : 0 }}>
              <motion.img
                src={main05} alt="상업공간"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onContextMenu={e => e.preventDefault()}
              />
            </div>
          </div>

          {/* ── Asymmetric 2/1 ── */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', borderTop: '1px solid #e5e5e5' }}>
            <div style={{ overflow: 'hidden', minHeight: isMobile ? '280px' : '440px' }}>
              <motion.img
                src={main06} alt="인테리어"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onContextMenu={e => e.preventDefault()}
              />
            </div>
            <div style={{
              padding: isMobile ? '40px 24px' : '60px 48px',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              background: '#f0eeea',
              borderLeft: isMobile ? 'none' : '1px solid #e5e5e5',
              borderTop: isMobile ? '1px solid #e5e5e5' : 'none',
            }}>
              <span style={{ fontSize: '9px', letterSpacing: '4px', color: '#bbb', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>06 / Detail</span>
              <p style={{ fontFamily: "'Pretendard Variable', Pretendard, system-ui, sans-serif", fontSize: isMobile ? '20px' : '22px', fontWeight: 400, color: '#1a1a1a', lineHeight: 1.6, margin: 0 }}>
                "디테일이 완성도를<br />만들고, 완성도가<br />공간을 기억하게 합니다."
              </p>
            </div>
          </div>

          {/* ── CTA footer ── */}
          <div style={{ padding: isMobile ? '60px 24px' : '88px 64px', textAlign: 'center', borderTop: '1px solid #e5e5e5' }}>
            <p style={{ fontSize: '11px', letterSpacing: '4px', color: '#bbb', textTransform: 'uppercase', marginBottom: '28px' }}>design LUKA</p>
            <h3 style={{
              fontFamily: "'Pretendard Variable', Pretendard, system-ui, sans-serif",
              fontSize: isMobile ? '26px' : '34px', fontWeight: 400,
              color: '#1a1a1a', marginBottom: '32px', lineHeight: 1.4,
            }}>당신의 공간을<br />함께 설계합니다</h3>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/portfolio" style={{
                display: 'inline-block', padding: '15px 40px', background: '#1a1a1a',
                fontSize: '10px', letterSpacing: '3px', color: '#fff',
                textDecoration: 'none', textTransform: 'uppercase',
              }}>Portfolio</Link>
              <Link to="/contact" style={{
                display: 'inline-block', padding: '15px 40px',
                border: '1px solid #1a1a1a',
                fontSize: '10px', letterSpacing: '3px', color: '#1a1a1a',
                textDecoration: 'none', textTransform: 'uppercase',
              }}>Contact</Link>
            </div>
          </div>
        </div>
        {/* ── End Grid section ──────────────────────────────────────────── */}

        {/* Brand text (fixed, inside container for wheel-event bubbling) */}
        <motion.div style={{
          position: 'fixed', top: 0, left: '50%',
          translateX: '-50%', y: textY, opacity: textOpacity,
          fontSize, letterSpacing,
          color: 'white', fontFamily: "'Pretendard Variable', Pretendard, system-ui, sans-serif",
          fontWeight: 400, zIndex: 35, whiteSpace: 'nowrap',
          userSelect: 'none', pointerEvents: 'none',
        }}>
          design LUKA
        </motion.div>

        {/* Scroll indicator */}
        <motion.div style={{
          position: 'fixed', bottom: '2.5rem', left: '50%',
          translateX: '-50%', opacity: indicatorOpacity,
          zIndex: 20, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '6px',
          color: 'rgba(255,255,255,0.65)', pointerEvents: 'none',
        }}>
          <span style={{ fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', fontFamily: "'Pretendard Variable', Pretendard, system-ui, sans-serif", fontWeight: 300 }}>scroll</span>
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default HomePage;
