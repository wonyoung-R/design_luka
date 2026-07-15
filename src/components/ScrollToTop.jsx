import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // index.css의 html,body { height:100% } 때문에 실제 스크롤러는 body 요소 —
    // window.scrollTo만으로는 초기화되지 않아 둘 다 리셋한다.
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
} 