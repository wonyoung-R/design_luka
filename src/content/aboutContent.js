// About 페이지 콘텐츠 단일 진실 — CMS(RTDB siteContent/about) 값이 있으면 덮어쓰고,
// 없으면 아래 기본값이 렌더된다(DB 장애/미설정에도 사이트가 깨지지 않는 fallback 구조).
// 기본 이미지는 전부 운영 포트폴리오(RTDB) 실프로젝트 사진 — 사진-현장명 일치 원칙.

export const DEFAULT_ABOUT_CONTENT = {
  hero: {
    // 래미안 강동팰리스 36py — 복도 (시안 메인 비주얼과 동일 컷)
    image: 'https://res.cloudinary.com/dti1gtd3u/image/upload/v1764658638/qkjbcbrgdern5mpsbgre.jpg',
    line1: 'DESIGN LUKA라는 이름은',
    line2: '슬로베니아어로 ‘빛’을 의미하는 ‘LUKA’에서 비롯되었습니다.',
  },
  lukaIs: {
    body1:
      '우리가 디자인하는 공간에 담긴 철학을 반영한 이름으로, 단순한 리모델링을 넘어 라이프스타일과 브랜드에 맞춘 맞춤형 디자인을 통해 세련되고 감각적인 공간을 창조합니다.',
    body2:
      '저희는 강남구, 서초구, 송파구를 중심으로 서울 전역에서 다양한 인테리어 프로젝트를 진행하고 있습니다. 2022년 4월 1일에 설립된 저희는 아직 젊은 회사이지만, 짧은 역사 속에서도 긴 호흡과 장기적인 관점으로 기본에 충실하면서도 세련된 감각을 잃지 않기 위해 구성원 모두가 매 프로젝트에 최선을 다하고 있습니다.',
    // ZION 바버샵 (시안 LUKA is 컷과 동일)
    image: 'https://res.cloudinary.com/dti1gtd3u/image/upload/v1760682538/ghuw85n4kwtcvbnhn5p6.jpg',
  },
  fourP: [
    {
      name: 'Personalize',
      subtitle: 'CUSTOMIZE',
      desc: '고객 맞춤형 설계\n생활 방식과 브랜드에 기반한 디자인',
      // 래미안 강동팰리스 36py — 맞춤 수납 시스템
      image: 'https://res.cloudinary.com/dti1gtd3u/image/upload/v1764658665/b3tuxtrmawehe4jqckud.jpg',
    },
    {
      name: 'Polish',
      subtitle: 'DESIGN EXCELLENCE',
      desc: '고객의 공간을 빛내는\n완성도 높은 디자인 구현',
      // 잠실 레이크팰리스 50py — 거실 간접조명
      image: 'https://res.cloudinary.com/dti1gtd3u/image/upload/v1767919434/m5ereg1ghtchpdeff6jb.jpg',
    },
    {
      name: 'Protect',
      subtitle: 'STABILITY',
      desc: '안전하고 체계적인 시공\n전문 건설업 면허 보유',
      // 잠실 레이크팰리스 50py — 욕실 설비 시공 디테일
      image: 'https://res.cloudinary.com/dti1gtd3u/image/upload/v1767919479/ejqajbhi1k4ufdaehgdz.jpg',
    },
    {
      // 제도 상세는 비공개 방침(2026-07-16 클라이언트) — 제도명 노출 없는 중립 문구 사용
      name: 'Partner',
      subtitle: 'FAIR PARTNERSHIP',
      desc: '고객·협력사와 함께하는\n상생 파트너십',
      // 92도씨 로스터리 카페 — 상업 파트너 프로젝트
      image: 'https://res.cloudinary.com/dti1gtd3u/image/upload/v1775700001/mhvp8svsmgbeuy9kqnaq.jpg',
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
