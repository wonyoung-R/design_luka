import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const BASE = 'https://designluka.co.kr';

// 라우트별 메타. 홈('/')은 index.html의 기본 메타를 그대로 사용(여기서 null).
const META = {
  '/': {
    title: 'Design LUKA | 서울 프리미엄 인테리어 디자인 전문업체 | 강남·서초·송파',
    desc: "'빛'을 의미하는 Design LUKA는 라이프스타일에 맞춘 맞춤형 인테리어 디자인으로 세련된 공간을 창조합니다. 서울 전역 서비스, 강남·서초·송파 전문, 논현점·반포점 운영.",
  },
  '/about': {
    title: '회사소개 | Design LUKA',
    desc: "'빛'을 의미하는 Design LUKA의 철학과 팀을 소개합니다. 강남·서초·송파 맞춤형 인테리어 디자인 전문.",
  },
  '/portfolio': {
    title: '포트폴리오 | Design LUKA',
    desc: '강남·서초·송파 주거·상업공간 인테리어 시공 사례. 라이프스타일에 맞춘 맞춤형 디자인 포트폴리오.',
  },
  '/insight': {
    title: '인사이트 & 콘텐츠 | Design LUKA',
    desc: '인테리어 디자인 인사이트와 공간 이야기. Design LUKA의 콘텐츠 아카이브.',
  },
  '/contact': {
    title: '상담문의 | Design LUKA',
    desc: '인테리어 상담 문의. 서울 서초구 사평대로57길 131 · 02-6405-0075 · design_luka@naver.com',
  },
  '/business': {
    title: '비즈니스 서비스 | Design LUKA',
    desc: '토탈 리빙·리라이트 리빙·토탈 비즈·비즈 컨설팅. Design LUKA의 인테리어 비즈니스 서비스.',
  },
};

export default function RouteSEO() {
  const { pathname } = useLocation();
  const m = META[pathname];
  if (!m) return null; // 홈 및 매핑 없는 경로는 index.html 기본 메타 사용
  const url = `${BASE}${pathname}`;
  return (
    <Helmet>
      <title>{m.title}</title>
      <meta name="description" content={m.desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={m.title} />
      <meta property="og:description" content={m.desc} />
      <meta property="og:url" content={url} />
    </Helmet>
  );
}
