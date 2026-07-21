// About 페이지 콘텐츠 단일 진실 — CMS(RTDB siteContent/about) 값이 있으면 덮어쓰고,
// 없으면 아래 기본값이 렌더된다(DB 장애/미설정에도 사이트가 깨지지 않는 fallback 구조).
// 기본 이미지: 소개글 무드에 맞춰 선정한 고해상 스톡(Unsplash License — 상업 이용 무료,
// 출처 표기 불요. 원본 photo id는 각 주석에 기록)을 Cloudinary에 업로드해 사용 (2026-07-16 사장 지시).

export const DEFAULT_ABOUT_CONTENT = {
  hero: {
    // 우드 톤 프리미엄 주거 거실 와이드 2560px (Unsplash photo-1751806524609-ce4550a4aae6)
    image: 'https://res.cloudinary.com/dti1gtd3u/image/upload/v1784211590/whhiolrux6qayormyi23.jpg',
    line1: 'DESIGN LUKA라는 이름은',
    line2: '슬로베니아어로 ‘빛’을 의미하는 ‘LUKA’에서 비롯되었습니다.',
  },
  lukaIs: {
    body1:
      '우리가 디자인하는 공간에 담긴 철학을 반영한 이름으로, 단순한 리모델링을 넘어 라이프스타일과 브랜드에 맞춘 맞춤형 디자인을 통해 세련되고 감각적인 공간을 창조합니다.',
    body2:
      '저희는 강남구, 서초구, 송파구를 중심으로 서울 전역에서 다양한 인테리어 프로젝트를 진행하고 있습니다. 2022년 4월 1일에 설립된 저희는 아직 젊은 회사이지만, 짧은 역사 속에서도 긴 호흡과 장기적인 관점으로 기본에 충실하면서도 세련된 감각을 잃지 않기 위해 구성원 모두가 매 프로젝트에 최선을 다하고 있습니다.',
    // 햇살 커튼 거실 — '빛(LUKA)' 브랜드 서사 (Unsplash photo-1631510390389-c1e4fb20ff31)
    image: 'https://res.cloudinary.com/dti1gtd3u/image/upload/v1784211592/mkx9mlk7xna3kscnniby.jpg',
  },
  fourP: [
    {
      name: 'Personalize',
      subtitle: 'CUSTOMIZE',
      desc: '고객 맞춤형 설계\n생활 방식과 브랜드에 기반한 디자인',
      // 클라이언트 제공 personalise.png 1080x1350 (2026-07-22 3차 피드백)
      image: 'https://res.cloudinary.com/dti1gtd3u/image/upload/v1784646196/cgwln6vsyliuwhkl57vr.png',
    },
    {
      name: 'Polish',
      subtitle: 'DESIGN EXCELLENCE',
      desc: '고객의 공간을 빛내는\n완성도 높은 디자인 구현',
      // 클라이언트 제공 polish.png 1080x1350 (2026-07-22 3차 피드백)
      image: 'https://res.cloudinary.com/dti1gtd3u/image/upload/v1784646199/ufxw1h0mbtbqgp9hcnlk.png',
    },
    {
      name: 'Protect',
      subtitle: 'STABILITY',
      desc: '안전하고 체계적인 시공\n전문 건설업 면허 보유',
      // 실내 시공 현장에서 도면을 검토하는 모습 (Unsplash photo-1772442198624-4fc4d7281e89)
      image: 'https://res.cloudinary.com/dti1gtd3u/image/upload/v1784211598/w2wb0fxrnz9jatx2e3t8.jpg',
    },
    {
      // 제도 상세는 비공개 방침(2026-07-16 클라이언트) — 제도명 노출 없는 중립 문구 사용
      name: 'Partner',
      subtitle: 'FAIR PARTNERSHIP',
      desc: '고객·협력사와 함께하는\n상생 파트너십',
      // 클라이언트 제공 partner.png 1080x1350 (2026-07-22 3차 피드백)
      image: 'https://res.cloudinary.com/dti1gtd3u/image/upload/v1784646193/zorxoojo22pdcztjfyfb.png',
    },
  ],
  // PARTNER(Fair Partnership) 섹션은 민감정보 비공개 방침으로 삭제됨 (2026-07-16)
};

// RTDB 부분 저장(일부 필드만 수정)에도 안전하도록 기본값 위에 섹션·항목 단위로 병합
export function mergeAboutContent(remote) {
  if (!remote) return DEFAULT_ABOUT_CONTENT;
  const d = DEFAULT_ABOUT_CONTENT;
  return {
    hero: { ...d.hero, ...(remote.hero || {}) },
    lukaIs: { ...d.lukaIs, ...(remote.lukaIs || {}) },
    fourP: d.fourP.map((card, i) => ({ ...card, ...((remote.fourP && remote.fourP[i]) || {}) })),
  };
}
