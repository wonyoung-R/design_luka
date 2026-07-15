import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 구 HashRouter 시절 공유된 링크(designluka.co.kr/#/insight/...)를 path형 URL로 변환
if (window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', window.location.hash.slice(1) + window.location.search);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 