import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/config';
import { mergeAboutContent } from '../content/aboutContent';

// siteContent/about 실시간 구독 — 값이 없거나 로드 실패면 기본값 렌더
export default function useAboutContent() {
  const [content, setContent] = useState(mergeAboutContent(null));

  useEffect(() => {
    const contentRef = ref(database, 'siteContent/about');
    const unsubscribe = onValue(
      contentRef,
      (snapshot) => setContent(mergeAboutContent(snapshot.val())),
      (error) => {
        console.error('useAboutContent: siteContent/about 로드 오류', error);
        setContent(mergeAboutContent(null));
      }
    );
    return () => unsubscribe();
  }, []);

  return content;
}
