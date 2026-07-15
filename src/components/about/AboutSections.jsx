import React from 'react';
import { motion } from 'framer-motion';
import useAboutContent from '../../hooks/useAboutContent';
import { getResponsiveCloudinaryUrl } from '../../utils/cloudinary';

/*
 * ABOUT LUKA 4섹션 — 홈 하단(variant="home")과 /about(variant="page") 양쪽에서 렌더 (C안).
 * 모션은 Monolith Studio 레퍼런스 분석 결과를 차분하게 이식:
 *  - InkText  : 텍스트가 연회색으로 자리 잡은 뒤 순차적으로 검정으로 '점등' (레퍼런스 GIF의 핵심 패턴.
 *               이동 없는 opacity 전환이라 모바일에서도 버벅임 없음)
 *  - ImageReveal : 이미지 fade + 미세 scale(1.05→1) 정착
 *  - GrowLine : 얇은 가로선이 왼쪽에서 자라남 (PARTNER 구분선)
 * 공통: whileInView + once, 0.6~1.2s, 과한 이동 없음 — "차분하고 자연스럽게" 요구 반영.
 */

const EASE = [0.22, 0.61, 0.36, 1];

const InkText = ({ children, delay = 0, className = '', as = 'div' }) => {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0.15 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.9, delay, ease: 'easeOut' }}
    >
      {children}
    </Tag>
  );
};

const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-10% 0px' }}
    transition={{ duration: 0.8, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

const ImageReveal = ({ src, alt, delay = 0, className = '', imgClassName = '' }) => (
  <motion.div
    className={`overflow-hidden ${className}`}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: '-10% 0px' }}
    transition={{ duration: 1.1, delay, ease: EASE }}
  >
    <motion.img
      src={getResponsiveCloudinaryUrl(src)}
      alt={alt}
      loading="lazy"
      className={`w-full h-full object-cover ${imgClassName}`}
      initial={{ scale: 1.05 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1.4, delay, ease: EASE }}
      onContextMenu={(e) => e.preventDefault()}
    />
  </motion.div>
);

const GrowLine = ({ delay = 0 }) => (
  <motion.div
    className="h-px bg-neutral-300 origin-left"
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true, margin: '-10% 0px' }}
    transition={{ duration: 0.9, delay, ease: EASE }}
  />
);

// 섹션 제목 공통 타이포 — "LUKA is" / "LUKA Way : 4P" (볼드+라이트 위계, 시안 준수)
const SectionTitle = ({ bold, light }) => (
  <h2 className="text-3xl md:text-4xl lg:text-[44px] leading-none text-neutral-900 font-sans">
    <span className="font-bold">{bold}</span>
    <span className="font-light"> {light}</span>
  </h2>
);

export default function AboutSections({ variant = 'page' }) {
  const content = useAboutContent();
  const { hero, lukaIs, fourP, partner } = content;

  // 4P 카드 상하 스태거 오프셋 (PC만, 시안 배치) — 모바일에서는 제거
  const cardOffsets = ['lg:mt-0', 'lg:mt-12', 'lg:mt-24', 'lg:mt-36'];

  return (
    <div className="bg-white font-sans" style={{ wordBreak: 'keep-all' }}>
      {/* ── S-A. ABOUT 메인 비주얼 ─────────────────────────────── */}
      <section>
        {variant === 'home' && (
          <div className="flex items-baseline justify-between px-6 lg:px-16 pt-16 lg:pt-20 pb-8 lg:pb-11 border-t border-neutral-200">
            <InkText as="h2" className="font-sans text-[28px] lg:text-[40px] font-normal text-neutral-900 tracking-tight leading-none">
              About LUKA
            </InkText>
            <span className="text-[10px] tracking-[3px] text-neutral-400 uppercase">Since 2022</span>
          </div>
        )}
        <div className="relative h-[44vh] md:h-[60vh] lg:h-[72vh]">
          <ImageReveal src={hero.image} alt="design LUKA 프로젝트 공간" className="absolute inset-0 h-full" />
          {/* 가독성 오버레이 */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.10), rgba(0,0,0,0.32))' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.p
              className="text-white text-sm md:text-lg lg:text-xl leading-relaxed"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            >
              {hero.line1}
            </motion.p>
            <motion.p
              className="text-white text-sm md:text-lg lg:text-xl leading-relaxed mt-1"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
            >
              {hero.line2}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── S-B. LUKA is ──────────────────────────────────────── */}
      <section className="px-6 lg:px-16 py-16 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4">
            <InkText>
              <SectionTitle bold="LUKA" light="is" />
            </InkText>
          </div>
          <div className="lg:col-span-8 lg:max-w-2xl">
            <InkText delay={0.15} className="text-sm md:text-base leading-[1.9] text-neutral-600">
              {lukaIs.body1}
            </InkText>
            <InkText delay={0.3} className="text-sm md:text-base leading-[1.9] text-neutral-600 mt-6">
              {lukaIs.body2}
            </InkText>
            <ImageReveal
              src={lukaIs.image}
              alt="design LUKA 상업공간 프로젝트"
              delay={0.2}
              className="mt-12 aspect-[16/10]"
            />
          </div>
        </div>
      </section>

      <div className="px-6 lg:px-16">
        <GrowLine />
      </div>

      {/* ── S-C. LUKA Way : 4P ───────────────────────────────── */}
      <section className="px-6 lg:px-16 py-16 lg:py-28">
        <InkText>
          <SectionTitle bold="LUKA" light="Way : 4P" />
        </InkText>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mt-12 lg:mt-16 lg:pb-36">
          {fourP.map((card, i) => (
            <FadeUp key={card.name} delay={i * 0.15} className={cardOffsets[i]}>
              <ImageReveal src={card.image} alt={`${card.name} — ${card.subtitle}`} delay={i * 0.15} className="aspect-[4/5]" />
              <div className="mt-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-sans text-base font-bold text-neutral-900">{card.name}</h3>
                  <span className="text-[10px] text-neutral-300">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <p className="text-[10px] tracking-[2.5px] text-neutral-400 uppercase mt-1">{card.subtitle}</p>
                <p className="text-[13px] leading-relaxed text-neutral-500 mt-2 whitespace-pre-line">{card.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <div className="px-6 lg:px-16">
        <GrowLine />
      </div>

      {/* ── S-D. PARTNER ─────────────────────────────────────── */}
      <section className="px-6 lg:px-16 py-16 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <InkText>
                <h2 className="font-sans text-3xl md:text-4xl lg:text-[44px] leading-none font-normal tracking-wide text-neutral-900">
                  PARTNER
                </h2>
                <p className="text-sm text-neutral-400 mt-3">Fair Partnership</p>
              </InkText>
            </div>
          </div>
          <div className="lg:col-span-8 lg:max-w-2xl">
            {partner.map((item, i) => (
              <div key={item.name} className={i === 0 ? '' : 'mt-12'}>
                <GrowLine delay={i * 0.12} />
                <InkText delay={i * 0.15} className="pt-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[10px] text-neutral-300">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="font-sans text-base font-bold text-neutral-900">
                      {item.name} <span className="font-normal text-neutral-400">|</span> {item.korName}
                    </h3>
                  </div>
                  <p className="text-sm font-bold text-neutral-700 mt-3">{item.subtitle}</p>
                  <p className="text-[13px] md:text-sm leading-[1.9] text-neutral-500 mt-3 whitespace-pre-line">
                    {item.body}
                  </p>
                </InkText>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
