import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue, set, remove } from 'firebase/database';
import { database } from '../../firebase/config';
import { DEFAULT_ABOUT_CONTENT, mergeAboutContent } from '../../content/aboutContent';

// About 콘텐츠 관리 (CMS 1단계) — siteContent/about 노드 편집.
// 이미지는 포트폴리오 관리와 동일한 Cloudinary unsigned preset으로 업로드.
const CLOUDINARY_CLOUD_NAME = 'dti1gtd3u';
const UPLOAD_PRESET = 'designluka_lossless';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  const response = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: formData });
  if (!response.ok) {
    throw new Error(`Cloudinary 업로드 실패: ${response.status}`);
  }
  const result = await response.json();
  return result.secure_url;
};

const Field = ({ label, value, onChange, rows = 2 }) => (
  <label className="block mb-4">
    <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
    <textarea
      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-gray-500 focus:outline-none"
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
);

const ImageField = ({ label, url, onUploaded }) => {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기가 너무 큽니다. (최대 10MB)');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    try {
      setUploading(true);
      const newUrl = await uploadToCloudinary(file);
      onUploaded(newUrl);
    } catch (err) {
      console.error(err);
      alert(`이미지 업로드에 실패했습니다.\n${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <div className="flex items-center gap-4">
        <img src={url} alt={label} className="w-28 h-20 object-cover rounded border border-gray-200" />
        <label className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-200">
          {uploading ? '업로드 중...' : '이미지 교체'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
    </div>
  );
};

const SiteContentManagement = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(DEFAULT_ABOUT_CONTENT);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const contentRef = ref(database, 'siteContent/about');
    const unsubscribe = onValue(contentRef, (snapshot) => {
      setContent(mergeAboutContent(snapshot.val()));
      setLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  const patch = (updater) => setContent((prev) => updater(structuredClone(prev)));

  const handleSave = async () => {
    try {
      setSaving(true);
      await set(ref(database, 'siteContent/about'), content);
      alert('저장되었습니다. About 페이지와 홈 하단에 즉시 반영됩니다.');
    } catch (err) {
      console.error(err);
      alert(`저장에 실패했습니다.\n${err.message}\n\nFirebase 콘솔에서 siteContent 경로의 쓰기 규칙을 확인해주세요.`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('모든 About 콘텐츠를 기본값으로 되돌리시겠습니까?')) return;
    try {
      await remove(ref(database, 'siteContent/about'));
      alert('기본값으로 복원되었습니다.');
    } catch (err) {
      alert(`복원에 실패했습니다.\n${err.message}`);
    }
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">About 콘텐츠 관리</h1>
          <div className="flex gap-2">
            <button onClick={() => navigate('/admin')} className="px-3 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300">
              대시보드
            </button>
            <button onClick={handleReset} className="px-3 py-2 text-sm bg-white border border-red-300 text-red-600 rounded-md hover:bg-red-50">
              기본값 복원
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm bg-[#2C3E50] text-white rounded-md hover:bg-[#34495E] disabled:opacity-50"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 space-y-8">
        {/* 메인 비주얼 */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">1. 메인 비주얼</h2>
          <ImageField label="와이드 이미지" url={content.hero.image} onUploaded={(url) => patch((c) => { c.hero.image = url; return c; })} />
          <Field label="문구 1줄" rows={1} value={content.hero.line1} onChange={(v) => patch((c) => { c.hero.line1 = v; return c; })} />
          <Field label="문구 2줄" rows={1} value={content.hero.line2} onChange={(v) => patch((c) => { c.hero.line2 = v; return c; })} />
        </section>

        {/* LUKA is */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">2. LUKA is</h2>
          <Field label="본문 1문단" rows={3} value={content.lukaIs.body1} onChange={(v) => patch((c) => { c.lukaIs.body1 = v; return c; })} />
          <Field label="본문 2문단" rows={4} value={content.lukaIs.body2} onChange={(v) => patch((c) => { c.lukaIs.body2 = v; return c; })} />
          <ImageField label="이미지" url={content.lukaIs.image} onUploaded={(url) => patch((c) => { c.lukaIs.image = url; return c; })} />
        </section>

        {/* 4P */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">3. LUKA Way : 4P</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.fourP.map((card, i) => (
              <div key={i} className="border border-gray-200 rounded-md p-4">
                <p className="text-sm font-bold text-gray-900 mb-3">{String(i + 1).padStart(2, '0')}. {card.name}</p>
                <ImageField label="카드 이미지" url={card.image} onUploaded={(url) => patch((c) => { c.fourP[i].image = url; return c; })} />
                <Field label="영문 부제" rows={1} value={card.subtitle} onChange={(v) => patch((c) => { c.fourP[i].subtitle = v; return c; })} />
                <Field label="설명 (줄바꿈 가능)" rows={2} value={card.desc} onChange={(v) => patch((c) => { c.fourP[i].desc = v; return c; })} />
              </div>
            ))}
          </div>
        </section>

        {/* PARTNER(Fair Partnership) 섹션은 민감정보 비공개 방침으로 페이지에서 삭제됨 (2026-07-16) */}
      </main>
    </div>
  );
};

export default SiteContentManagement;
