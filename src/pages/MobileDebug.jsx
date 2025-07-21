import React, { useState, useEffect } from 'react';

const MobileDebug = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    // 기본 디버그 정보 수집
    const info = {
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      innerSize: `${window.innerWidth}x${window.innerHeight}`,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date().toISOString()
    };
    
    setDebugInfo(info);
    
    // 테스트 실행
    const tests = [];
    
    // 1. JavaScript 실행 테스트
    try {
      tests.push({ name: 'JavaScript 실행', status: '✅ 성공', details: 'JavaScript가 정상적으로 실행됩니다.' });
    } catch (error) {
      tests.push({ name: 'JavaScript 실행', status: '❌ 실패', details: error.message });
    }
    
    // 2. DOM 접근 테스트
    try {
      const root = document.getElementById('root');
      if (root) {
        tests.push({ name: 'DOM 접근', status: '✅ 성공', details: 'DOM 요소에 정상적으로 접근할 수 있습니다.' });
      } else {
        tests.push({ name: 'DOM 접근', status: '❌ 실패', details: 'root 요소를 찾을 수 없습니다.' });
      }
    } catch (error) {
      tests.push({ name: 'DOM 접근', status: '❌ 실패', details: error.message });
    }
    
    // 3. 터치 이벤트 테스트
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    tests.push({ 
      name: '터치 지원', 
      status: hasTouch ? '✅ 지원' : '❌ 미지원', 
      details: hasTouch ? '터치 이벤트가 지원됩니다.' : '터치 이벤트가 지원되지 않습니다.' 
    });
    
    // 4. CSS Grid/Flexbox 지원 테스트
    const hasGrid = CSS.supports('display', 'grid');
    const hasFlexbox = CSS.supports('display', 'flex');
    tests.push({ 
      name: 'CSS Grid/Flexbox', 
      status: hasGrid && hasFlexbox ? '✅ 지원' : '⚠️ 부분 지원', 
      details: `Grid: ${hasGrid ? '지원' : '미지원'}, Flexbox: ${hasFlexbox ? '지원' : '미지원'}` 
    });
    
    // 5. 네트워크 연결 테스트
    tests.push({ 
      name: '네트워크 연결', 
      status: navigator.onLine ? '✅ 온라인' : '❌ 오프라인', 
      details: navigator.onLine ? '인터넷에 연결되어 있습니다.' : '인터넷에 연결되어 있지 않습니다.' 
    });
    
    setTestResults(tests);
    
    // 에러 핸들러 추가
    const handleError = (event) => {
      console.error('JavaScript 에러:', event.error);
      setTestResults(prev => [...prev, {
        name: 'JavaScript 에러',
        status: '❌ 발생',
        details: event.error?.message || '알 수 없는 에러'
      }]);
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  const runTouchTest = () => {
    alert('터치 테스트: 버튼이 정상적으로 작동합니다!');
    setTestResults(prev => [...prev, {
      name: '터치 테스트',
      status: '✅ 성공',
      details: '터치 이벤트가 정상적으로 작동합니다.'
    }]);
  };

  const runScrollTest = () => {
    window.scrollTo(0, 100);
    setTimeout(() => {
      window.scrollTo(0, 0);
      setTestResults(prev => [...prev, {
        name: '스크롤 테스트',
        status: '✅ 성공',
        details: '스크롤이 정상적으로 작동합니다.'
      }]);
    }, 500);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen font-['Noto_Sans_KR']">
      <h1 className="text-2xl font-bold mb-6 text-center">📱 모바일 디버그 정보</h1>
      
      {/* 기본 정보 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-bold mb-3">기본 정보</h2>
        <div className="space-y-2 text-sm">
          <div><strong>User Agent:</strong> {debugInfo.userAgent}</div>
          <div><strong>화면 크기:</strong> {debugInfo.screenSize}</div>
          <div><strong>창 크기:</strong> {debugInfo.innerSize}</div>
          <div><strong>플랫폼:</strong> {debugInfo.platform}</div>
          <div><strong>언어:</strong> {debugInfo.language}</div>
          <div><strong>시간대:</strong> {debugInfo.timezone}</div>
          <div><strong>온라인 상태:</strong> {debugInfo.onLine ? '온라인' : '오프라인'}</div>
        </div>
      </div>
      
      {/* 테스트 결과 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-bold mb-3">테스트 결과</h2>
        <div className="space-y-2">
          {testResults.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="font-medium">{test.name}</span>
              <div className="text-right">
                <div className={test.status.includes('✅') ? 'text-green-600' : test.status.includes('❌') ? 'text-red-600' : 'text-yellow-600'}>
                  {test.status}
                </div>
                <div className="text-xs text-gray-600">{test.details}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 테스트 버튼 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-bold mb-3">수동 테스트</h2>
        <div className="space-y-3">
          <button 
            onClick={runTouchTest}
            className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            터치 테스트
          </button>
          <button 
            onClick={runScrollTest}
            className="w-full bg-green-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            스크롤 테스트
          </button>
        </div>
      </div>
      
      {/* 포트폴리오 링크 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-3">포트폴리오 테스트</h2>
        <a 
          href="/portfolio"
          className="block w-full bg-purple-500 text-white px-4 py-3 rounded-lg font-medium text-center hover:bg-purple-600 transition-colors"
        >
          포트폴리오 페이지로 이동
        </a>
      </div>
    </div>
  );
};

export default MobileDebug; 