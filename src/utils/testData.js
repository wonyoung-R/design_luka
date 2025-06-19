import { database } from '../firebase/config';
import { ref, push, set, get } from 'firebase/database';

// 테스트 인사이트 데이터
const testInsights = [
  {
    title: '2025년 인테리어 트렌드: 자연주의 디자인의 귀환',
    content: `올해 인테리어 트렌드는 자연 소재와 친환경적 요소를 중심으로 형성되고 있습니다. 목재, 돌, 식물 등을 활용한 바이오필릭 디자인이 주목받고 있으며, 이는 단순히 미적인 측면을 넘어서 거주자의 웰빙과 정신 건강에도 긍정적인 영향을 미치고 있습니다.

특히 코로나19 이후 집에서 보내는 시간이 늘어나면서, 사람들은 자연과의 연결감을 느낄 수 있는 공간에 대한 갈망이 커졌습니다. 이러한 니즈에 부응하여 인테리어 업계에서는 자연 소재를 활용한 다양한 디자인 솔루션을 제시하고 있습니다.

원목 가구와 자연석 타일은 공간에 따뜻함과 고급스러움을 동시에 선사합니다. 또한 실내 정원이나 벽면 녹화를 통해 자연의 생명력을 실내로 끌어들이는 시도들이 증가하고 있습니다.`,
    category: 'trend',
    date: '2025-01-15',
    thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    url: 'https://example.com/article1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: '작은 공간을 넓게 보이는 10가지 비법',
    content: `작은 공간을 효과적으로 활용하는 것은 현대 도시 생활에서 매우 중요한 스킬입니다. 이 글에서는 작은 공간을 시각적으로 넓게 보이게 하는 10가지 실용적인 방법을 소개합니다.

1. 미러 활용하기: 전략적으로 배치된 거울은 공간을 두 배로 넓어 보이게 합니다.
2. 수직 공간 활용: 높은 선반과 수직 정원을 통해 공간을 효율적으로 사용하세요.
3. 투명 가구 사용: 유리나 아크릴 소재의 가구는 시각적 무게감을 줄여줍니다.
4. 다기능 가구 선택: 소파 베드나 확장 가능한 테이블 같은 다기능 가구를 활용하세요.
5. 색상 팔레트 통일: 일관된 색상 사용으로 공간의 연속성을 만들어냅니다.`,
    category: 'tip',
    date: '2025-01-10',
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    url: 'https://example.com/article2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: '미니멀리즘을 넘어선 맥시멀리즘의 부상',
    content: `최근 몇 년간 미니멀리즘이 주류였지만, 이제 맥시멀리즘이 새로운 트렌드로 떠오르고 있습니다. 맥시멀리즘은 단순히 많은 물건을 쌓아두는 것이 아니라, 개성과 스토리를 담은 공간을 만드는 것입니다.

맥시멀리즘의 핵심은 의미 있는 수집품과 개인적인 소장품을 통해 공간에 이야기를 담는 것입니다. 각 아이템은 단순한 장식이 아닌 개인의 여정과 경험을 반영하는 요소가 되어야 합니다.

색상과 패턴의 대담한 조합, 다양한 질감의 혼합, 그리고 개성 있는 아트워크의 배치가 맥시멀리즘 공간의 특징입니다. 하지만 이 모든 것이 조화롭게 어우러져야 하며, 단순한 혼란스러움이 아닌 의도된 아름다움을 만들어내야 합니다.`,
    category: 'trend',
    date: '2025-01-05',
    thumbnail: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    url: 'https://example.com/article3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// 테스트 데이터 추가 함수
export const addTestInsights = async () => {
  try {
    console.log('테스트 인사이트 데이터 추가 시작...');
    
    for (const insight of testInsights) {
      const insightsRef = ref(database, 'insights');
      const newInsightRef = push(insightsRef);
      await set(newInsightRef, insight);
      console.log('인사이트 추가됨:', insight.title);
    }
    
    console.log('모든 테스트 인사이트가 성공적으로 추가되었습니다.');
    return true;
  } catch (error) {
    console.error('테스트 데이터 추가 중 오류:', error);
    return false;
  }
};

// 현재 데이터 확인 함수
export const checkCurrentData = async () => {
  try {
    const insightsRef = ref(database, 'insights');
    const snapshot = await get(insightsRef);
    const data = snapshot.val();
    console.log('현재 파이어베이스 데이터:', data);
    return data;
  } catch (error) {
    console.error('데이터 확인 중 오류:', error);
    return null;
  }
}; 