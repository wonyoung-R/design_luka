import React from 'react';
import { motion } from 'framer-motion';
import useAboutContent from '../../hooks/useAboutContent';
import { getResponsiveCloudinaryUrl } from '../../utils/cloudinary';

/*
 * ABOUT LUKA 섹션 — 홈 하단(variant="home")과 /about(variant="page") 양쪽에서 렌더 (C안).
 * 모션:
 *  - InkText  : 텍스트 연회색 → 검정 순차 점등 (Monolith Studio 레퍼런스. opacity 전환만이라 모바일 부담 0)
 *  - ImageReveal : 이미지 fade + 미세 scale 정착 (히어로·LUKA is)
 *  - CurtainReveal : 4P 카드 — 마스크 안에서 이미지가 좌/우에서 와이프되며 등장
 *                    (Vimeo spacelong2 레퍼런스, clip-path+transform만 사용해 GPU 가속)
 *  - GrowLine : 얇은 가로선이 왼쪽에서 자라남
 * 2026-07-16 2차 피드백 반영: LUKA is 풀와이드 / 4P 톱 정렬+카드별 비율 상이 / PARTNER 섹션 삭제(민감정보).
 * 2026-07-22 3차 피드백 반영: LUKA is 이미지 본문 좌측정렬(풀와이드 철회) / 4P 클라 제공 사진 3장 + 한 화면 수렴.
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

// 4P 카드 — 좌/우에서 커튼처럼 와이프되며 등장.
// 애니메이션은 clip-path 단일 속성만 사용(내부 이미지 이동·스케일 제거) —
// 요소 1개·속성 1개라 합성 단계에서만 처리되어 모바일에서도 버벅임이 없다.
const CurtainReveal = ({ src, alt, delay = 0, fromRight = false, className = '' }) => (
  <motion.div
    className={`overflow-hidden ${className}`}
    initial={{ clipPath: fromRight ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }}
    whileInView={{ clipPath: 'inset(0 0 0 0)' }}
    viewport={{ once: true, margin: '-10% 0px' }}
    transition={{ duration: 1.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
  >
    <img
      src={getResponsiveCloudinaryUrl(src)}
      alt={alt}
      loading="lazy"
      className="w-full h-full object-cover"
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
  <h2 className="font-sans text-3xl md:text-4xl lg:text-[44px] leading-none text-neutral-900">
    <span className="font-bold">{bold}</span>
    <span className="font-light"> {light}</span>
  </h2>
);

// 4P 카드별 이미지 비율 — 톱 라인은 정렬, 세로 높이는 서로 다르게 (2차 피드백).
// 3차 피드백: PC에서 섹션이 한 화면을 넘어 최장 카드가 잘림 → 최장 비율을 2:3에서
// 4:5(클라이언트 제공 사진 1080x1350 원본 비율 = 무크롭)로 낮추고 전체 단차 압축.
const CARD_ASPECTS = ['aspect-[4/5]', 'aspect-[7/8]', 'aspect-[5/6]', 'aspect-square'];

export default function AboutSections({ variant = 'page' }) {
  const content = useAboutContent();
  const { hero, lukaIs, fourP } = content;

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

      {/* ── S-B. LUKA is — 4차 피드백: 본문·이미지를 한 래퍼로 묶어 폭 동일,
           시작선은 상단 designLuka 워드마크 왼쪽 선(중앙 고정 260px → 50%−130px)에 정렬 ── */}
      <section className="px-6 lg:px-16 py-16 lg:py-28">
        <div className="lg:relative">
          <InkText className="lg:absolute lg:left-0 lg:top-0">
            <SectionTitle bold="LUKA" light="is" />
          </InkText>
          <div className="mt-10 lg:mt-0 lg:ml-[calc(50%-130px)]">
            <InkText delay={0.15} className="text-sm md:text-base lg:text-[17px] leading-[1.9] text-neutral-600">
              {lukaIs.body1}
            </InkText>
            <InkText delay={0.3} className="text-sm md:text-base lg:text-[17px] leading-[1.9] text-neutral-600 mt-6">
              {lukaIs.body2}
            </InkText>
            <ImageReveal
              src={lukaIs.image}
              alt="design LUKA 상업공간 프로젝트"
              delay={0.15}
              className="aspect-[4/3] mt-10 lg:mt-8"
            />
          </div>
        </div>
      </section>

      <div className="px-6 lg:px-16">
        <GrowLine />
      </div>

      {/* ── S-C. LUKA Way : 4P — 톱 정렬 + 카드별 높이 상이 + 커튼 리빌.
           3차 피드백: PC 한 화면에 섹션 전체가 들어오도록 세로 패딩·간격 축소 ── */}
      <section className="px-6 lg:px-16 py-16 lg:py-20">
        <InkText>
          <SectionTitle bold="LUKA" light="Way : 4P" />
        </InkText>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mt-12 items-start">
          {fourP.map((card, i) => (
            <div key={card.name}>
              <CurtainReveal
                src={card.image}
                alt={`${card.name} — ${card.subtitle}`}
                delay={i * 0.2}
                fromRight={i % 2 === 1}
                className={CARD_ASPECTS[i % CARD_ASPECTS.length]}
              />
              <FadeUp delay={i * 0.2 + 0.45}>
                <div className="mt-5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-sans text-base font-bold text-neutral-900">{card.name}</h3>
                    <span className="text-[10px] text-neutral-300">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <p className="text-[10px] tracking-[2.5px] text-neutral-400 uppercase mt-1">{card.subtitle}</p>
                  <p className="text-[13px] leading-relaxed text-neutral-500 mt-2 whitespace-pre-line">{card.desc}</p>
                </div>
              </FadeUp>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
