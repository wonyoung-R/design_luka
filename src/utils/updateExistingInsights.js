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
      // 한글 날짜 형식 처리: "2025년 12월 16일 / 15시 27분 04초"
      const koreanDateMatch = dateValue.match(/(\d{4})년\s+(\d{1,2})월\s+(\d{1,2})일\s*\/\s*(\d{1,2})시\s+(\d{1,2})분\s+(\d{1,2})초/);
      if (koreanDateMatch) {
        const year = koreanDateMatch[1];
        const month = String(koreanDateMatch[2]).padStart(2, '0');
        const day = String(koreanDateMatch[3]).padStart(2, '0');
        const hour = String(koreanDateMatch[4]).padStart(2, '0');
        const minute = String(koreanDateMatch[5]).padStart(2, '0');
        const second = String(koreanDateMatch[6]).padStart(2, '0');
        return `${year}${month}${day} ${hour}${minute}${second}`;
      }
      // YYYYMMDD HHMMSS 형식 처리
      if (/^\d{8}\s\d{6}$/.test(dateValue)) {
        return dateValue; // 이미 올바른 형식
      }
      // YYYYMMDD 형식 처리
      else if (/^\d{8}$/.test(dateValue)) {
        const year = dateValue.substring(0, 4);
        const month = dateValue.substring(4, 6);
        const day = dateValue.substring(6, 8);
        return `${year}${month}${day} 000000`;
      }
      // ISO 문자열 형식 처리
      else if (dateValue.includes('T') || dateValue.includes('-')) {
        date = new Date(dateValue);
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
      // 기타 문자열 형식
      else {
        date = new Date(dateValue);
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
      
      Object.entries(data).forEach(([id, insight]) => {
        let needsUpdate = false;
        const updatedInsight = { ...insight };
        
        // thumbnail이나 url 필드가 없는 경우 기본값 추가
        if (!insight.hasOwnProperty('thumbnail') || !insight.hasOwnProperty('url')) {
          updatedInsight.thumbnail = insight.thumbnail || '';
          updatedInsight.url = insight.url || '';
          needsUpdate = true;
        }
        
        // 날짜 형식 수정
        const formattedDate = formatDate(insight.date);
        if (formattedDate !== insight.date) {
          updatedInsight.date = formattedDate;
          needsUpdate = true;
          console.log(`인사이트 ${id} 날짜 수정: ${insight.date} → ${formattedDate}`);
        }
        
        if (needsUpdate) {
          updates[`insights/${id}`] = updatedInsight;
          console.log(`인사이트 ${id} 업데이트: thumbnail=${updatedInsight.thumbnail}, url=${updatedInsight.url}, date=${updatedInsight.date}`);
        }
      });
      
      if (Object.keys(updates).length > 0) {
        await update(ref(database), updates);
        console.log(`${Object.keys(updates).length}개의 인사이트가 업데이트되었습니다.`);
      } else {
        console.log('업데이트할 인사이트가 없습니다.');
      }
    } else {
      console.log('인사이트 데이터가 없습니다.');
    }
  } catch (error) {
    console.error('인사이트 업데이트 중 오류 발생:', error);
  }
};

// 관리자 페이지에서 호출할 수 있는 함수
export const runDataMigration = () => {
  updateExistingInsights()
    .then(() => {
      alert('기존 데이터 업데이트가 완료되었습니다.');
    })
    .catch((error) => {
      console.error('데이터 마이그레이션 실패:', error);
      alert('데이터 업데이트 중 오류가 발생했습니다.');
    });
}; 