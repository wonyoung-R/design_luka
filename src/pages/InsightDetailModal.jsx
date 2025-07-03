import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function InsightDetailModal({ insight, onClose, onPrev, onNext }) {
  const modalRef = useRef();

  // ESC 키, 바깥 클릭, 뒤로가기 핸들링
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // 바깥 클릭
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  if (!insight) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
      style={{ animation: 'fadeIn 0.2s' }}
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl flex flex-col items-center"
        style={{
          height: '80vh',
          width: 'calc(80vh * 7 / 5)',
          maxWidth: '95vw',
          maxHeight: '900px',
          overflow: 'hidden',
        }}
      >
        {/* Title */}
        <div className="w-full px-8 pt-8 pb-4 text-center border-b border-gray-100">
          <h2 className="text-lg md:text-2xl font-bold text-gray-900 font-['Noto_Sans_KR'] line-clamp-2">{insight.title}</h2>
        </div>
        {/* Content */}
        <div className="flex-1 w-full overflow-y-auto px-8 py-4 font-['Noto_Sans_KR']">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ node, ...props }) => (
                <div className="my-6">
                  <img
                    {...props}
                    alt={props.alt || '이미지'}
                    className="w-full h-auto rounded-lg shadow"
                    loading="lazy"
                    style={{ display: 'block' }}
                  />
                </div>
              ),
              a: ({ node, children, ...props }) => (
                <a
                  {...props}
                  className="text-blue-600 hover:text-blue-800 border-b border-blue-300 hover:border-blue-600 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children || '링크'}
                </a>
              ),
              h1: ({ node, ...props }) => (
                <h1 {...props} className="text-xl md:text-2xl font-bold text-gray-900 mb-4 mt-6 font-['Noto_Sans_KR']" />
              ),
              h2: ({ node, ...props }) => (
                <h2 {...props} className="text-lg md:text-xl font-bold text-gray-900 mb-3 mt-4 font-['Noto_Sans_KR']" />
              ),
              h3: ({ node, ...props }) => (
                <h3 {...props} className="text-base md:text-lg font-bold text-gray-900 mb-2 mt-3 font-['Noto_Sans_KR']" />
              ),
              p: ({ node, ...props }) => (
                <p {...props} className="text-gray-700 leading-relaxed mb-4 text-sm md:text-base font-['Noto_Sans_KR']" />
              ),
              ul: ({ node, ...props }) => (
                <ul {...props} className="list-disc pl-6 mb-4 space-y-2 text-sm md:text-base font-['Noto_Sans_KR']" />
              ),
              ol: ({ node, ...props }) => (
                <ol {...props} className="list-decimal pl-6 mb-4 space-y-2 text-sm md:text-base font-['Noto_Sans_KR']" />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote {...props} className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4 bg-gray-50 p-3 rounded-r-lg text-sm md:text-base font-['Noto_Sans_KR']" />
              ),
              code: ({ node, inline, ...props }) => {
                if (inline) {
                  return (
                    <code {...props} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800" />
                  );
                }
                return (
                  <pre>
                    <code {...props} className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono" />
                  </pre>
                );
              }
            }}
          >
            {insight.content}
          </ReactMarkdown>
        </div>
        {/* Prev/Next Navigation */}
        <div className="w-full flex justify-between items-center px-8 py-4 border-t border-gray-100">
          <button
            onClick={onPrev}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group text-lg font-bold"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전 글
          </button>
          <button
            onClick={onNext}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group text-lg font-bold"
          >
            다음 글
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        {/* Close Button (optional) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          aria-label="닫기"
        >
          ×
        </button>
      </div>
    </div>
  );
} 