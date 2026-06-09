// src/utils/cloudinary.js
// Cloudinary 표시 변환 단일 진실 — 업로드는 designluka_lossless preset이 무손실 보장,
// 표시 시점에 q_100·f_auto를 강제. 변환 정의가 페이지에 흩어져 4회 반복 재발한 구조를
// 차단하기 위해 하나의 모듈로 통합. 호출부 시그니처는 기존과 동일(점진 마이그레이션 안전).

const BASE_PARAMS = 'f_auto,q_100,fl_progressive,w_2048,c_limit';
const CLOUD_NAME = 'dti1gtd3u';

// Cloudinary 전체 URL에 변환 파라미터 삽입 (반응형 너비 옵션)
export const getResponsiveCloudinaryUrl = (url, width = null) => {
  if (!url) return null;
  if (!url.includes('cloudinary.com')) return url;
  const baseUrl = url.split('/upload/')[0] + '/upload/';
  const imagePath = url.split('/upload/')[1];
  let params = BASE_PARAMS;
  if (width) params += `,w_${width}`;
  return `${baseUrl}${params}/${imagePath}`;
};

// public_id만 있을 때 직접 조립 (fl_progressive 의도적 제외 유지 — 기존 동작 보존)
export const getCloudinaryUrlFromId = (publicId) => {
  if (!publicId) return null;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_100,w_2048,c_limit/${publicId}`;
};

// srcset 생성
const RESPONSIVE_WIDTHS = [640, 1280, 1920, 2560];
export const generateResponsiveSrcSet = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return RESPONSIVE_WIDTHS
    .map(w => `${getResponsiveCloudinaryUrl(url, w)} ${w}w`)
    .join(', ');
};

export const convertToOptimizedUrl = (url) => {
  if (!url) return null;
  if (!url.includes('cloudinary.com')) return url;
  return getResponsiveCloudinaryUrl(url);
};

// PortfolioDetailPage 기존 호출명 호환 (alias) — 호출부 0줄 변경
export const getHighQualityCloudinaryUrl = getResponsiveCloudinaryUrl;
