import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { database } from '../../firebase/config';
import { ref, push, set, onValue, remove } from 'firebase/database';
import { useAuth } from '../../contexts/AuthContext';

// 구글 드라이브 설정
const GOOGLE_API_KEY = 'AIzaSyAsRupVJhEGpw3iLSZ_DnlP4gloP5MNg2w';
const GOOGLE_CLIENT_ID = '332773576868-bj0k9v0vpubgd0gt538set394m5kdnfm.apps.googleusercontent.com';
const RESIDENTIAL_FOLDER_ID = '1eKsiX8rrO-M8pQt2oTUa4qJRdcryMG8N';
const COMMERCIAL_FOLDER_ID = '1eqKEUUQ2q2Abr17bqca511dqyZQQpA9y';

const PortfolioManagement = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGoogleApiReady, setIsGoogleApiReady] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [apiStatus, setApiStatus] = useState('초기화 중...');
  const [accessToken, setAccessToken] = useState(null);
  const [currentDomain, setCurrentDomain] = useState('');
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    type: 'residential',
    title: '',
    address: '',
    area: '',
    businessType: 'cafe',
    style: '',
    images: []
  });

  // Firebase에서 포트폴리오 데이터 로드
  useEffect(() => {
    const loadProjectsFromFirebase = () => {
      const projectsRef = ref(database, 'portfolio');
      onValue(projectsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const projectsArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setProjects(projectsArray);
        } else {
          setProjects([]);
        }
      });
    };

    loadProjectsFromFirebase();
  }, []);

  useEffect(() => {
    // 현재 도메인 정보 저장
    setCurrentDomain(window.location.origin);
    
    const initializeGoogleApi = async () => {
      try {
        setApiStatus('Google API 스크립트 로딩 중...');
        
        // Google Identity Services 스크립트 로드
        if (!window.google) {
          const gisScript = document.createElement('script');
          gisScript.src = 'https://accounts.google.com/gsi/client';
          gisScript.onload = () => {
            setApiStatus('Google Identity Services 로딩 완료');
            initGoogleIdentity();
          };
          gisScript.onerror = () => {
            setApiStatus('Google Identity Services 로딩 실패');
          };
          document.head.appendChild(gisScript);
        }
        
        // Google API 라이브러리 로드
        if (!window.gapi) {
          const gapiScript = document.createElement('script');
          gapiScript.src = 'https://apis.google.com/js/api.js';
          gapiScript.onload = () => {
            setApiStatus('Google API 라이브러리 로딩 중...');
            window.gapi.load('client', initGoogleApiClient);
          };
          gapiScript.onerror = () => {
            setApiStatus('Google API 스크립트 로딩 실패');
          };
          document.head.appendChild(gapiScript);
        } else {
          window.gapi.load('client', initGoogleApiClient);
        }
      } catch (error) {
        setApiStatus('초기화 오류: ' + error.message);
        console.error('초기화 오류:', error);
      }
    };

    const initGoogleIdentity = () => {
      try {
        setApiStatus('Google Identity 설정 중...');
        
        // 현재 도메인 확인
        const currentOrigin = window.location.origin;
        console.log('현재 도메인:', currentOrigin);
        
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: false
        });
        setApiStatus('Google Identity 설정 완료');
      } catch (error) {
        setApiStatus('Google Identity 설정 실패: ' + error.message);
        console.error('Google Identity 설정 실패:', error);
      }
    };

  const testApiConnection = async () => {
    try {
      setApiStatus('API 연결 테스트 중...');
      
      // 간단한 API 테스트 (공개 API 사용)
      const response = await fetch(`https://www.googleapis.com/drive/v3/about?fields=user&key=${GOOGLE_API_KEY}`);
      
      if (response.ok) {
        setApiStatus('API 연결 성공 - 로그인 필요');
        setIsGoogleApiReady(true);
      } else {
        throw new Error(`API 테스트 실패: ${response.status}`);
      }
    } catch (error) {
      setApiStatus('API 연결 실패: ' + error.message);
      console.error('API 연결 테스트 실패:', error);
      
      // API 키 없이도 시도 (OAuth만 사용)
      setApiStatus('OAuth 전용 모드로 전환');
      setIsGoogleApiReady(true);
    }
  };

  const initGoogleApiClient = async () => {
    try {
      setApiStatus('Google API 클라이언트 초기화 중...');
      
      // 가장 간단한 초기화
      if (window.gapi && window.gapi.client) {
        await window.gapi.client.init({});
        setApiStatus('기본 클라이언트 초기화 완료');
      }
      
      // API 연결 테스트
      await testApiConnection();
      
    } catch (error) {
      setApiStatus('클라이언트 초기화 실패, 직접 API 모드로 전환');
      console.error('클라이언트 초기화 실패:', error);
      
      // 그래도 계속 진행 (직접 fetch 사용)
      setIsGoogleApiReady(true);
      setApiStatus('직접 API 모드 - 로그인 필요');
    }
  };

    setTimeout(initializeGoogleApi, 100);
  }, []);

  const handleCredentialResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    // JWT 토큰을 디코드하여 사용자 정보 확인 가능
    setApiStatus('로그인 성공 - 액세스 토큰 요청 중...');
    requestAccessToken();
  };

  const requestAccessToken = () => {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.file',
        redirect_uri: window.location.origin,
        callback: (tokenResponse) => {
          console.log('토큰 응답:', tokenResponse);
          if (tokenResponse.access_token) {
            setAccessToken(tokenResponse.access_token);
            setIsSignedIn(true);
            setApiStatus('로그인 완료');
          } else if (tokenResponse.error) {
            setApiStatus('액세스 토큰 획득 실패: ' + tokenResponse.error);
            console.error('토큰 오류:', tokenResponse);
          } else {
            setApiStatus('액세스 토큰 획득 실패');
          }
        },
      });
      
      console.log('토큰 요청 시작, 현재 도메인:', window.location.origin);
      tokenClient.requestAccessToken();
    } catch (error) {
      setApiStatus('토큰 클라이언트 초기화 실패: ' + error.message);
      console.error('토큰 클라이언트 오류:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (!window.google) {
        alert('Google Identity Services가 아직 로드되지 않았습니다.');
        return;
      }
      
      requestAccessToken();
    } catch (error) {
      console.error('구글 로그인 실패:', error);
      alert('구글 로그인에 실패했습니다: ' + error.message);
    }
  };

  const handleGoogleSignOut = () => {
    setAccessToken(null);
    setIsSignedIn(false);
    setApiStatus('로그아웃됨');
  };

  const retryApiInit = () => {
    setIsGoogleApiReady(false);
    setIsSignedIn(false);
    setAccessToken(null);
    setApiStatus('재초기화 중...');
    
    // 기존 스크립트 제거
    const existingGapiScript = document.querySelector('script[src="https://apis.google.com/js/api.js"]');
    const existingGisScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    
    if (existingGapiScript) existingGapiScript.remove();
    if (existingGisScript) existingGisScript.remove();
    
    // 페이지 새로고침을 통한 재초기화
    window.location.reload();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 50) {
      alert('최대 50장까지 업로드 가능합니다.');
      return;
    }
    
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setSelectedFiles(imageFiles);
  };

  const createFolder = async (folderName, parentFolderId) => {
    if (!accessToken) {
      throw new Error('액세스 토큰이 없습니다.');
    }

    try {
      const response = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [parentFolderId]
        })
      });

      if (!response.ok) {
        throw new Error(`폴더 생성 실패: ${response.statusText}`);
      }

      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error('폴더 생성 실패:', error);
      throw error;
    }
  };

  const uploadFile = async (file, folderId) => {
    if (!accessToken) {
      throw new Error('액세스 토큰이 없습니다.');
    }

    const metadata = {
      name: file.name,
      parents: [folderId]
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
    form.append('file', file);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${accessToken}`
      }),
      body: form
    });

    if (!response.ok) {
      throw new Error(`업로드 실패: ${response.statusText}`);
    }

    return response.json();
  };

  const generateFolderName = () => {
    const today = new Date();
    const dateStr = today.getFullYear().toString() + 
                   (today.getMonth() + 1).toString().padStart(2, '0') + 
                   today.getDate().toString().padStart(2, '0');
    
    const sizeInfo = formData.type === 'residential' ? formData.area : formData.businessType;
    return `[${dateStr}] ${formData.title}_${sizeInfo}`;
  };

  const handleSubmit = async () => {
    if (!isSignedIn || !accessToken) {
      alert('구글 드라이브 로그인이 필요합니다.');
      return;
    }

    if (selectedFiles.length === 0) {
      alert('이미지를 선택해주세요.');
      return;
    }

    if (!currentUser) {
      alert('Firebase 로그인이 필요합니다.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Google Drive에 이미지 업로드
      const parentFolderId = formData.type === 'residential' ? RESIDENTIAL_FOLDER_ID : COMMERCIAL_FOLDER_ID;
      const folderName = generateFolderName();
      const newFolderId = await createFolder(folderName, parentFolderId);

      const uploadedImages = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const uploadedFile = await uploadFile(file, newFolderId);
        uploadedImages.push({
          id: uploadedFile.id,
          name: uploadedFile.name,
          url: `https://drive.google.com/uc?id=${uploadedFile.id}`,
          driveUrl: `https://drive.google.com/file/d/${uploadedFile.id}/view`
        });
        
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      // 2. Firebase에 프로젝트 메타데이터 저장
      const newProject = {
        type: formData.type,
        title: formData.title,
        address: formData.address,
        area: formData.type === 'residential' ? formData.area : null,
        businessType: formData.type === 'commercial' ? formData.businessType : null,
        style: formData.style,
        folderId: newFolderId,
        folderName: folderName,
        images: uploadedImages,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.uid,
        updatedAt: new Date().toISOString()
      };

      // Firebase에 저장
      const projectsRef = ref(database, 'portfolio');
      const newProjectRef = push(projectsRef);
      await set(newProjectRef, newProject);

      setIsModalOpen(false);
      setFormData({
        type: 'residential',
        title: '',
        address: '',
        area: '',
        businessType: 'cafe',
        style: '',
        images: []
      });
      setSelectedFiles([]);
      setUploadProgress(0);
      
      alert('프로젝트가 성공적으로 업로드되었습니다!');
      
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('업로드 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
      try {
        // Firebase에서 삭제
        const projectRef = ref(database, `portfolio/${projectId}`);
        await remove(projectRef);
        
        alert('프로젝트가 삭제되었습니다.');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const businessTypes = [
    { value: 'cafe', label: '카페' },
    { value: 'restaurant', label: '레스토랑' },
    { value: 'office', label: '사무실' },
    { value: 'retail', label: '상가' },
    { value: 'beauty', label: '뷰티샵' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">포트폴리오 관리</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              상태: <span className="font-medium">{apiStatus}</span>
            </div>
            {isGoogleApiReady && !isSignedIn && (
              <button
                onClick={handleGoogleSignIn}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                구글 드라이브 로그인
              </button>
            )}
            {isGoogleApiReady && isSignedIn && (
              <button
                onClick={handleGoogleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                로그아웃
              </button>
            )}
            {!isGoogleApiReady && (
              <button
                onClick={retryApiInit}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
              >
                API 재시도
              </button>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!isSignedIn}
              className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              새 프로젝트 추가
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* 도메인 정보 표시 */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
            <p className="text-gray-800 font-medium">🌐 현재 도메인 정보</p>
            <p className="text-gray-600 text-sm">현재 URL: <code className="bg-gray-200 px-1 rounded">{currentDomain}</code></p>
            <p className="text-gray-600 text-sm mt-1">
              Google Cloud Console → OAuth 2.0 클라이언트 ID → 승인된 JavaScript 출처에 위 URL을 추가하세요
            </p>
          </div>

          {!isGoogleApiReady && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-yellow-800 font-medium">Google API 상태</p>
                  <p className="text-yellow-700">{apiStatus}</p>
                  {apiStatus.includes('실패') && (
                    <div className="mt-2 text-sm text-yellow-600">
                      <p><strong>redirect_uri_mismatch 해결 방법:</strong></p>
                      <ul className="list-disc list-inside mt-1">
                        <li>Google Cloud Console → API 및 서비스 → 사용자 인증 정보</li>
                        <li>OAuth 2.0 클라이언트 ID 클릭</li>
                        <li>승인된 JavaScript 출처에 <code className="bg-yellow-100 px-1">{currentDomain}</code> 추가</li>
                        <li>승인된 리디렉션 URI에 <code className="bg-yellow-100 px-1">{currentDomain}</code> 추가</li>
                        <li>저장 후 5-10분 대기</li>
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={retryApiInit}
                    className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                  >
                    재시도
                  </button>
                  <button
                    onClick={() => {
                      setIsGoogleApiReady(true);
                      setApiStatus('강제 활성화 - 로그인 시도');
                    }}
                    className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
                  >
                    강제 진행
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {isGoogleApiReady && !isSignedIn && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-800 font-medium">구글 드라이브 로그인이 필요합니다.</p>
                  <p className="text-blue-600 text-sm">로그인 후 프로젝트를 업로드할 수 있습니다.</p>
                  {currentDomain && (
                    <p className="text-blue-600 text-xs mt-1">
                      ⚠️ redirect_uri_mismatch 오류 발생시 Google Cloud Console에서 {currentDomain}을 승인된 출처에 추가하세요
                    </p>
                  )}
                </div>
                <button
                  onClick={handleGoogleSignIn}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  로그인
                </button>
              </div>
            </div>
          )}

          {isGoogleApiReady && isSignedIn && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <p className="text-green-800">✅ 구글 드라이브 연결됨 - 프로젝트를 추가할 수 있습니다!</p>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {projects.map((project) => (
                <li key={project.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-500">
                        {project.type === 'residential' ? '주거' : '상업'} | 
                        {project.address} |
                        {project.type === 'residential' 
                          ? ` ${project.area}` 
                          : ` ${businessTypes.find(t => t.value === project.businessType)?.label}`
                        }
                      </p>
                      {project.images && (
                        <p className="text-xs text-gray-400">이미지 {project.images.length}장</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {project.folderId && (
                        <a
                          href={`https://drive.google.com/drive/folders/${project.folderId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          구글 드라이브에서 보기
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">새 프로젝트 추가</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">형태</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                  >
                    <option value="residential">주거</option>
                    <option value="commercial">상업</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">제목</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="예: 반포 원베일리"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">주소</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="예: 서초구 반포동"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {formData.type === 'residential' ? '평형' : '업종'}
                  </label>
                  {formData.type === 'residential' ? (
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="예: 34py"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                      required
                    />
                  ) : (
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                      required
                    >
                      {businessTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">스타일 설명 (선택사항)</label>
                <textarea
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="프로젝트의 스타일이나 특징을 설명해주세요"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">이미지 업로드 (최대 50장)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-800"
                />
                {selectedFiles.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedFiles.length}장의 이미지가 선택되었습니다.
                  </p>
                )}
              </div>

              {isUploading && (
                <div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-slate-700 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    업로드 중... {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isUploading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isUploading || !isSignedIn || !accessToken || selectedFiles.length === 0}
                  className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? '업로드 중...' : '저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioManagement;