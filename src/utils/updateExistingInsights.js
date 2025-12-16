// 기존 인사이트 데이터에 thumbnail과 url 필드 추가하는 유틸리티
import { database } from '../firebase/config';
import { ref, get, update } from 'firebase/database';

// 안전한 날짜 처리 함수
const formatDate = (dateValue) => {
  if (!dateValue) {
    return formatCurrentDateTime();
  }

  try {
    let date;
    
    // 다양한 날짜 형식 처리
    if (typeof dateValue === 'string') {
      const trimmedValue = dateValue.trim();
      
      // 한글 날짜 형식 처리: "2025년 12월 16일 / 15시 27분 04초" (다양한 공백/슬래시 변형 지원)
      const koreanDateWithTimeMatch = trimmedValue.match(/(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일\s*[\/\s]*\s*(\d{1,2})\s*시\s*(\d{1,2})\s*분\s*(\d{1,2})\s*초/);
      if (koreanDateWithTimeMatch) {
        const year = koreanDateWithTimeMatch[1];
        const month = String(koreanDateWithTimeMatch[2]).padStart(2, '0');
        const day = String(koreanDateWithTimeMatch[3]).padStart(2, '0');
        const hour = String(koreanDateWithTimeMatch[4]).padStart(2, '0');
        const minute = String(koreanDateWithTimeMatch[5]).padStart(2, '0');
        const second = String(koreanDateWithTimeMatch[6]).padStart(2, '0');
        return `${year}${month}${day} ${hour}${minute}${second}`;
      }
      
      // 한글 날짜 형식 처리 (시간 없음): "2025년 12월 16일"
      const koreanDateMatch = trimmedValue.match(/(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
      if (koreanDateMatch) {
        const year = koreanDateMatch[1];
        const month = String(koreanDateMatch[2]).padStart(2, '0');
        const day = String(koreanDateMatch[3]).padStart(2, '0');
        return `${year}${month}${day} 000000`;
      }
      
      // YYYYMMDD HHMMSS 형식 처리
      if (/^\d{8}\s+\d{6}$/.test(trimmedValue)) {
        return trimmedValue; // 이미 올바른 형식
      }
      
      // YYYYMMDD 형식 처리
      if (/^\d{8}$/.test(trimmedValue)) {
        return `${trimmedValue} 000000`;
      }
      
      // ISO 문자열 형식 처리
      if (trimmedValue.includes('T') || /^\d{4}-\d{2}-\d{2}/.test(trimmedValue)) {
        date = new Date(trimmedValue);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');
          return `${year}${month}${day} ${hours}${minutes}${seconds}`;
        }
      }
      
      // 숫자 패턴 추출 시도 (YYYY-MM-DD, YYYY/MM/DD 등)
      const numberMatch = trimmedValue.match(/(\d{4})[-\/\.]?(\d{1,2})[-\/\.]?(\d{1,2})/);
      if (numberMatch) {
        const year = numberMatch[1];
        const month = String(numberMatch[2]).padStart(2, '0');
        const day = String(numberMatch[3]).padStart(2, '0');
        date = new Date(`${year}-${month}-${day}`);
        if (!isNaN(date.getTime())) {
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');
          return `${year}${month}${day} ${hours}${minutes}${seconds}`;
        }
      }
      
      // 숫자만 있는 경우 처음 8자리 추출 시도
      const digitsOnly = trimmedValue.replace(/\D/g, '');
      if (digitsOnly.length >= 8) {
        const year = digitsOnly.substring(0, 4);
        const month = digitsOnly.substring(4, 6);
        const day = digitsOnly.substring(6, 8);
        date = new Date(`${year}-${month}-${day}`);
        if (!isNaN(date.getTime())) {
          return `${year}${month}${day} 000000`;
        }
      }
      
      // 기타 문자열 형식
      date = new Date(trimmedValue);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day} ${hours}${minutes}${seconds}`;
      }
    } else if (dateValue instanceof Date) {
      if (!isNaN(dateValue.getTime())) {
        const year = dateValue.getFullYear();
        const month = String(dateValue.getMonth() + 1).padStart(2, '0');
        const day = String(dateValue.getDate()).padStart(2, '0');
        const hours = String(dateValue.getHours()).padStart(2, '0');
        const minutes = String(dateValue.getMinutes()).padStart(2, '0');
        const seconds = String(dateValue.getSeconds()).padStart(2, '0');
        return `${year}${month}${day} ${hours}${minutes}${seconds}`;
      }
    }

    // 모든 경우에 실패하면 현재 시간 반환
    return formatCurrentDateTime();
  } catch (error) {
    console.error('Date formatting error:', error, 'Date value:', dateValue);
    return formatCurrentDateTime();
  }
};

// 현재 날짜시간을 YYYYMMDD HHMMSS 형식으로 반환
const formatCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day} ${hours}${minutes}${seconds}`;
};

export const updateExistingInsights = async () => {
  try {
    console.log('기존 인사이트 데이터 업데이트 시작...');
    
    const insightsRef = ref(database, 'insights');
    const snapshot = await get(insightsRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const updates = {};
      let updateCount = 0;
      
      Object.entries(data).forEach(([id, insight]) => {
        let needsUpdate = false;
        const updatedInsight = { ...insight };
        
        // thumbnail이나 url 필드가 없는 경우 기본값 추가
        if (!insight.hasOwnProperty('thumbnail') || !insight.hasOwnProperty('url')) {
          updatedInsight.thumbnail = insight.thumbnail || '';
          updatedInsight.url = insight.url || '';
          needsUpdate = true;
        }
        
        // 날짜 형식 수정 (항상 확인하고 변환)
        if (insight.date) {
          const formattedDate = formatDate(insight.date);
          if (formattedDate !== insight.date) {
            updatedInsight.date = formattedDate;
            needsUpdate = true;
            console.log(`인사이트 ${id} 날짜 수정: "${insight.date}" → "${formattedDate}"`);
            updateCount++;
          }
        } else {
          // 날짜가 없는 경우 현재 시간으로 설정
          updatedInsight.date = formatCurrentDateTime();
          needsUpdate = true;
          console.log(`인사이트 ${id} 날짜 추가: "${updatedInsight.date}"`);
          updateCount++;
        }
        
        if (needsUpdate) {
          updates[`insights/${id}`] = updatedInsight;
        }
      });
      
      if (Object.keys(updates).length > 0) {
        await update(ref(database), updates);
        console.log(`✅ 총 ${Object.keys(updates).length}개의 인사이트가 업데이트되었습니다. (날짜 변환: ${updateCount}개)`);
        return {
          success: true,
          total: Object.keys(updates).length,
          dateUpdated: updateCount
        };
      } else {
        console.log('업데이트할 인사이트가 없습니다.');
        return {
          success: true,
          total: 0,
          dateUpdated: 0
        };
      }
    } else {
      console.log('인사이트 데이터가 없습니다.');
      return {
        success: true,
        total: 0,
        dateUpdated: 0
      };
    }
  } catch (error) {
    console.error('인사이트 업데이트 중 오류 발생:', error);
    throw error;
  }
};

// 관리자 페이지에서 호출할 수 있는 함수
export const runDataMigration = () => {
  updateExistingInsights()
    .then((result) => {
      if (result && result.dateUpdated > 0) {
        alert(`기존 데이터 업데이트가 완료되었습니다!\n\n총 ${result.total}개의 인사이트 업데이트\n날짜 변환: ${result.dateUpdated}개`);
      } else {
        alert('기존 데이터 업데이트가 완료되었습니다.\n\n변환할 날짜 형식이 없거나 이미 올바른 형식입니다.');
      }
    })
    .catch((error) => {
      console.error('데이터 마이그레이션 실패:', error);
      alert(`데이터 업데이트 중 오류가 발생했습니다.\n\n${error.message || '알 수 없는 오류'}`);
    });
}; 