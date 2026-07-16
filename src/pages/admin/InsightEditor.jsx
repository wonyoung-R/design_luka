// components/admin/InsightEditor.jsx - CORS 문제 해결 버전
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { database } from '../../firebase/config';
import { ref as dbRef, push, set } from 'firebase/database';

const InsightEditor = ({ onClose, onSave, editingInsight }) => {
  const textareaRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: editingInsight?.title || '',
    category: editingInsight?.category || 'trend',
    date: editingInsight?.date || formatCurrentDateTime(),
    url: editingInsight?.url || '',
    thumbnail: editingInsight?.thumbnail || '',
    thumbFocus: editingInsight?.thumbFocus || 'center',
    content: editingInsight?.content || ''
  });

  // editingInsight가 변경될 때 formData 업데이트
  useEffect(() => {
    if (editingInsight) {
      setFormData({
        title: editingInsight.title || '',
        category: editingInsight.category || 'trend',
        date: editingInsight.date || formatCurrentDateTime(),
        url: editingInsight.url || '',
        thumbnail: editingInsight.thumbnail || '',
        thumbFocus: editingInsight.thumbFocus || 'center',
        content: editingInsight.content || ''
      });
    }
  }, [editingInsight]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageMethod, setImageMethod] = useState('googledrive'); // 'googledrive' or 'imgur' or 'direct'

  // 현재 날짜시간을 "yyyy년 mm월 dd일 / hh시 mi분 ss초" 형식으로 반환
  function formatCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // YYYYMMDD HHMMSS 형식으로 반환 (기존 형식 유지)
    return `${year}${month}${day} ${hours}${minutes}${seconds}`;
  }

  // 날짜 형식을 YYYYMMDD HHMMSS로 정규화하는 함수
  function normalizeDate(dateValue) {
    if (!dateValue) {
      return formatCurrentDateTime();
    }

    try {
      const trimmedValue = String(dateValue).trim();
      
      // 이미 올바른 형식인 경우
      if (/^\d{8}\s+\d{6}$/.test(trimmedValue)) {
        return trimmedValue;
      }

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

      // YYYYMMDD 형식 처리 (시간은 000000으로 설정)
      if (/^\d{8}$/.test(trimmedValue)) {
        return `${trimmedValue} 000000`;
      }

      // 숫자 패턴 추출 시도 (YYYY-MM-DD, YYYY/MM/DD 등)
      const numberMatch = trimmedValue.match(/(\d{4})[-\/\.]?(\d{1,2})[-\/\.]?(\d{1,2})/);
      if (numberMatch) {
        const year = numberMatch[1];
        const month = String(numberMatch[2]).padStart(2, '0');
        const day = String(numberMatch[3]).padStart(2, '0');
        const date = new Date(`${year}-${month}-${day}`);
        if (!isNaN(date.getTime())) {
          return `${year}${month}${day} 000000`;
        }
      }

      // Date 객체나 ISO 문자열 형식 처리
      const date = new Date(trimmedValue);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day} ${hours}${minutes}${seconds}`;
      }

      // 파싱 실패 시 현재 시간 반환
      console.warn('날짜 파싱 실패, 현재 시간 사용:', dateValue);
      return formatCurrentDateTime();
    } catch (error) {
      console.error('Date normalization error:', error, 'Date value:', dateValue);
      return formatCurrentDateTime();
    }
  }

  // 구글 드라이브 URL 변환 (여러 형식 지원)
  const convertGoogleDriveUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    
    const patterns = [
      /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/,
      /https:\/\/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
      /https:\/\/drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/,
      /https:\/\/drive\.google\.com\/uc\?export=view&id=([a-zA-Z0-9_-]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        const fileId = match[1];
        
        // 여러 대안 URL 형식 제공
        return {
          standard: `https://drive.google.com/uc?export=view&id=${fileId}`,
          alternative1: `https://drive.google.com/uc?id=${fileId}`,
          alternative2: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
          alternative3: `https://lh3.googleusercontent.com/d/${fileId}`,
          fileId: fileId
        };
      }
    }

    return { standard: url, fileId: null };
  };

  // 이미지 URL 검증 (Promise 기반)
  const validateImageUrl = (url, timeout = 5000) => {
    return new Promise((resolve) => {
      const img = new Image();
      const timer = setTimeout(() => {
        resolve(false);
      }, timeout);
      
      img.onload = () => {
        clearTimeout(timer);
        resolve(true);
      };
      
      img.onerror = () => {
        clearTimeout(timer);
        resolve(false);
      };
      
      img.src = url;
    });
  };

  // 여러 URL로 테스트하여 작동하는 것 찾기
  const findWorkingUrl = async (urlOptions) => {
    if (typeof urlOptions === 'string') {
      return await validateImageUrl(urlOptions) ? urlOptions : null;
    }
    
    const urlsToTest = [
      urlOptions.standard,
      urlOptions.alternative1,
      urlOptions.alternative2,
      urlOptions.alternative3
    ].filter(Boolean);
    
    for (const url of urlsToTest) {
      console.log('테스트 중:', url);
      const isValid = await validateImageUrl(url);
      if (isValid) {
        console.log('성공:', url);
        return url;
      }
    }
    
    return null;
  };

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 이미지 삽입 모달 열기
  const handleImageInsert = () => {
    setImageUrl('');
    setIsImageModalOpen(true);
  };

  // 이미지 URL 삽입
  const insertImageUrl = async () => {
    if (!imageUrl.trim()) {
      alert('이미지 URL을 입력해주세요.');
      return;
    }

    let finalUrl = imageUrl.trim();
    
    if (imageMethod === 'googledrive') {
      console.log('구글 드라이브 URL 처리 시작...');
      
      const urlOptions = convertGoogleDriveUrl(imageUrl);
      console.log('URL 옵션들:', urlOptions);
      
      if (!urlOptions.fileId) {
        alert('올바른 구글 드라이브 URL이 아닙니다.');
        return;
      }
      
      // 작동하는 URL 찾기
      const workingUrl = await findWorkingUrl(urlOptions);
      
      if (!workingUrl) {
        // 모든 URL이 실패한 경우 사용자에게 선택권 제공
        const choice = window.confirm(
          '이미지 로드가 확인되지 않았습니다.\n' +
          '그래도 삽입하시겠습니까?\n\n' +
          '(OK: 그래도 삽입, Cancel: 취소)'
        );
        
        if (!choice) return;
        
        finalUrl = urlOptions.standard; // 기본 URL 사용
      } else {
        finalUrl = workingUrl;
      }
    }
    
    // 텍스트에 이미지 삽입
    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const textBefore = formData.content.substring(0, cursorPos);
    const textAfter = formData.content.substring(cursorPos);
    
    const imageMarkdown = `\n![이미지](${finalUrl})\n`;
    const newContent = textBefore + imageMarkdown + textAfter;
    
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = cursorPos + imageMarkdown.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 100);

    setIsImageModalOpen(false);
    setImageUrl('');
  };

  // 캐시 강제 새로고침 URL 생성
  const addCacheBuster = (url) => {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_cb=${Date.now()}`;
  };

  // 텍스트 포맷팅 함수들
  const insertFormat = (format) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || '굵은 텍스트'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || '기울임 텍스트'}*`;
        break;
      case 'heading':
        formattedText = `## ${selectedText || '제목'}`;
        break;
      case 'link':
        const url = prompt('링크 URL을 입력하세요:', 'https://');
        if (url) {
          formattedText = `[${selectedText || '링크 텍스트'}](${url})`;
        } else {
          return;
        }
        break;
      case 'list':
        formattedText = `\n- ${selectedText || '목록 항목'}\n`;
        break;
      default:
        return;
    }

    const newContent = 
      formData.content.substring(0, start) + 
      formattedText + 
      formData.content.substring(end);
    
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 100);
  };

  // 저장 핸들러
  const handleSave = async () => {
    try {
      if (!formData.title.trim()) {
        alert('제목을 입력해주세요.');
        return;
      }
      
      if (!formData.content.trim()) {
        alert('내용을 입력해주세요.');
        return;
      }

      setIsLoading(true);

      const normalizedDate = normalizeDate(formData.date);
      console.log('날짜 변환:', formData.date, '→', normalizedDate);
      
      const insightData = {
        title: formData.title.trim(),
        category: formData.category,
        date: normalizedDate, // 날짜 형식 정규화
        url: formData.url.trim(),
        thumbnail: formData.thumbnail.trim(),
        thumbFocus: formData.thumbFocus || 'center', // 목록 썸네일 노출 위치
        content: formData.content.trim(),
        updatedAt: new Date().toISOString()
      };

      // 편집 모드인지 새 작성 모드인지 확인
      if (editingInsight) {
        // 편집 모드: 기존 데이터 업데이트
        const insightRef = dbRef(database, `insights/${editingInsight.id}`);
        const updatedData = {
          ...editingInsight,
          ...insightData
        };
        console.log('저장할 데이터:', updatedData);
        await set(insightRef, updatedData);
        alert('인사이트가 성공적으로 수정되었습니다.');
      } else {
        // 새 작성 모드: 새 데이터 생성
        insightData.createdAt = new Date().toISOString();
        const insightsRef = dbRef(database, 'insights');
        const newInsightRef = push(insightsRef);
        await set(newInsightRef, insightData);
        alert('인사이트가 성공적으로 저장되었습니다.');
      }
      
      if (onSave) onSave();
      if (onClose) onClose();
      
    } catch (error) {
      console.error('저장 오류:', error);
      alert('저장 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* 헤더 */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingInsight ? '인사이트 수정' : '새 인사이트 작성'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex flex-col h-[calc(90vh-120px)]">
            {/* 폼 필드들 */}
            <div className="px-6 py-4 border-b border-gray-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="인사이트 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="trend">트렌드</option>
                    <option value="tip">인테리어 팁</option>
                    <option value="news">뉴스</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="YYYYMMDD HHMMSS 또는 2025년 12월 16일 / 15시 27분 04초"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    형식: YYYYMMDD HHMMSS (예: 20251216 152704) 또는 한글 형식
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL (선택사항)</label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">섬네일 이미지 URL (선택사항)</label>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  헤더에 표시될 이미지 URL을 입력하세요. 비워두면 기본 이미지가 사용됩니다.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">썸네일 노출 위치</label>
                <select
                  name="thumbFocus"
                  value={formData.thumbFocus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="center">가운데 (기본)</option>
                  <option value="top">위쪽</option>
                  <option value="bottom">아래쪽</option>
                  <option value="left">왼쪽</option>
                  <option value="right">오른쪽</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  목록 썸네일(4:3)에서 이미지가 잘릴 때 어느 부분을 보여줄지 선택합니다.
                </p>
              </div>
            </div>

            {/* 에디터 툴바 */}
            <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => insertFormat('bold')}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 font-bold"
                  title="굵게"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => insertFormat('italic')}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 italic"
                  title="기울임"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => insertFormat('heading')}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 font-bold"
                  title="제목"
                >
                  H
                </button>
                <button
                  type="button"
                  onClick={() => insertFormat('link')}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
                  title="링크"
                >
                  🔗
                </button>
                <button
                  type="button"
                  onClick={() => insertFormat('list')}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
                  title="목록"
                >
                  📝
                </button>
                <button
                  type="button"
                  onClick={handleImageInsert}
                  className="px-3 py-1 bg-blue-100 border border-blue-300 rounded text-sm hover:bg-blue-200"
                  title="이미지 삽입"
                >
                  📷 이미지 삽입
                </button>
              </div>
            </div>

            {/* 텍스트 에디터 */}
            <div className="flex-1 px-6 py-4">
              <textarea
                ref={textareaRef}
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="w-full h-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="인사이트 내용을 작성하세요..."
              />
            </div>

            {/* 하단 버튼들 */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      저장 중...
                    </>
                  ) : (
                    '저장'
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* 이미지 삽입 모달 */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-center">📷 이미지 삽입</h3>
              
              {/* 이미지 방법 선택 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">이미지 소스 선택</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="googledrive"
                      checked={imageMethod === 'googledrive'}
                      onChange={(e) => setImageMethod(e.target.value)}
                      className="mr-2"
                    />
                    구글 드라이브
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="imgur"
                      checked={imageMethod === 'imgur'}
                      onChange={(e) => setImageMethod(e.target.value)}
                      className="mr-2"
                    />
                    Imgur
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="direct"
                      checked={imageMethod === 'direct'}
                      onChange={(e) => setImageMethod(e.target.value)}
                      className="mr-2"
                    />
                    직접 URL
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이미지 URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={
                      imageMethod === 'googledrive' 
                        ? "https://drive.google.com/file/d/파일ID/view?usp=sharing"
                        : imageMethod === 'imgur'
                        ? "https://i.imgur.com/파일명.jpg"
                        : "https://example.com/image.jpg"
                    }
                  />
                </div>

                {/* 방법별 안내 */}
                {imageMethod === 'googledrive' && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">📖 구글 드라이브 사용법:</h4>
                    <ol className="text-sm text-blue-800 space-y-1">
                      <li>1. 구글 드라이브에 이미지 업로드</li>
                      <li>2. 파일 우클릭 → "공유" → "링크가 있는 모든 사용자"</li>
                      <li>3. "링크 복사" 후 위에 붙여넣기</li>
                    </ol>
                  </div>
                )}

                {imageMethod === 'imgur' && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">📖 Imgur 사용법 (추천!):</h4>
                    <ol className="text-sm text-green-800 space-y-1">
                      <li>1. <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="underline">imgur.com</a> 접속</li>
                      <li>2. "New post" 클릭 → 이미지 드래그 앤 드롭</li>
                      <li>3. 업로드 후 이미지 우클릭 → "이미지 주소 복사"</li>
                      <li>4. 복사된 URL 붙여넣기</li>
                    </ol>
                    <div className="mt-2 p-2 bg-green-100 rounded text-xs text-green-800">
                      ✅ Imgur는 권한 설정 없이 바로 사용 가능하며 더 안정적입니다!
                    </div>
                  </div>
                )}

                {imageMethod === 'direct' && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">📖 직접 URL 사용법:</h4>
                    <p className="text-sm text-gray-700">
                      이미 인터넷에 업로드된 이미지의 직접 URL을 입력하세요.<br/>
                      URL은 .jpg, .png, .gif 등으로 끝나야 합니다.
                    </p>
                  </div>
                )}

                {/* 이미지 미리보기 */}
                {imageUrl && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">이미지 미리보기:</p>
                    <img 
                      src={imageMethod === 'googledrive' ? convertGoogleDriveUrl(imageUrl).standard : imageUrl}
                      alt="미리보기" 
                      className="max-w-full h-auto max-h-48 rounded border"
                      onLoad={() => console.log('이미지 로드 성공')}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="text-red-500 text-sm p-2 bg-red-50 rounded mt-2" style={{display: 'none'}}>
                      ❌ 이미지를 불러올 수 없습니다.<br/>
                      {imageMethod === 'googledrive' && '구글 드라이브 권한을 확인하거나 '}
                      다른 이미지 서비스를 사용해보세요.
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={insertImageUrl}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={!imageUrl.trim()}
                >
                  삽입
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InsightEditor;