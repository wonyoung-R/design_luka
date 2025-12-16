// 날짜 형식 마이그레이션 스크립트
// 브라우저 콘솔에서 실행하거나 관리자 대시보드에서 사용

// 사용법:
// 1. 관리자 대시보드(/admin) 접속
// 2. 브라우저 개발자 도구 콘솔 열기 (F12)
// 3. 아래 코드를 복사하여 실행

import { updateExistingInsights } from './src/utils/updateExistingInsights';

updateExistingInsights()
  .then((result) => {
    if (result && result.dateUpdated > 0) {
      console.log(`✅ 마이그레이션 완료!`);
      console.log(`총 ${result.total}개의 인사이트 업데이트`);
      console.log(`날짜 변환: ${result.dateUpdated}개`);
      alert(`마이그레이션 완료!\n\n총 ${result.total}개 업데이트\n날짜 변환: ${result.dateUpdated}개`);
    } else {
      console.log('✅ 모든 데이터가 이미 올바른 형식입니다.');
      alert('모든 데이터가 이미 올바른 형식입니다.');
    }
  })
  .catch((error) => {
    console.error('❌ 마이그레이션 실패:', error);
    alert(`마이그레이션 실패: ${error.message}`);
  });

