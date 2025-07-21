import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { database, auth } from '../../firebase/config';
import { ref, push, set, onValue, remove } from 'firebase/database';
import { useAuth } from '../../contexts/AuthContext';

// Cloudinary 설정
const CLOUDINARY_CLOUD_NAME = 'dti1gtd3u';
// API Secret은 클라이언트에서 제거 (보안상 위험)
const UPLOAD_PRESET = 'ml_default'; // 기본 preset 사용

// Cloudinary 기본 URL
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const PortfolioManagement = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCloudinaryReady, setIsCloudinaryReady] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [apiStatus, setApiStatus] = useState('Cloudinary 준비됨');
  const [formData, setFormData] = useState({
    type: 'residential',
    title: '',
    address: '',
    area: '',
    businessType: 'cafe',
    style: '',
    styleDescription: '',
    constructionDate: '',
    images: [],
    thumbnailIndex: 0
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [editFormData, setEditFormData] = useState({
    constructionDate: ''
  });
  const [editSelectedFiles, setEditSelectedFiles] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all', 'residential', 'commercial'

  // 파일 크기 제한 추가 (더 작게 설정)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
    
    const imageFiles = files.filter(file => {
      // 파일 크기 체크
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name}은(는) 파일 크기가 너무 큽니다. (최대 5MB)`);
        return false;
      }
      // 이미지 파일 체크
      return file.type.startsWith('image/');
    });
    
    setSelectedFiles(imageFiles);
  };

  // Cloudinary 기본 업로드 함수 (가장 간단한 방법)
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    
    // 추가 파라미터 없이 가장 기본적인 설정만 사용

    try {
      console.log('Uploading image:', file.name, 'Size:', file.size, 'Type:', file.type);
      console.log('Using upload preset:', UPLOAD_PRESET);
      console.log('Upload URL:', CLOUDINARY_UPLOAD_URL);
      
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData
      });

      console.log('Upload response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary error response:', errorText);
        console.error('Full response:', response);
        
        // 더 자세한 에러 정보 제공
        let errorMessage = `Cloudinary 업로드 실패: ${response.status}`;
        
        if (response.status === 400) {
          errorMessage += ' - Upload preset이 존재하지 않거나 설정이 잘못되었습니다.';
        } else if (response.status === 401) {
          errorMessage += ' - API 인증 실패. Upload preset 설정을 확인하세요.';
        } else if (response.status === 500) {
          errorMessage += ' - 서버 오류. 파일 크기나 형식을 확인하세요.';
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Upload success:', result);
      
      return {
        id: result.public_id,
        url: result.secure_url,
        name: file.name,
        width: result.width,
        height: result.height,
        format: result.format
      };
    } catch (error) {
      console.error('Cloudinary 업로드 오류:', error);
      throw error;
    }
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
    if (selectedFiles.length === 0) {
      alert('이미지를 선택해주세요.');
      return;
    }

    if (!currentUser) {
      alert('Firebase 로그인이 필요합니다. 관리자로 로그인해주세요.');
      console.error('User not authenticated:', currentUser);
      return;
    }

    // 인증 상태 재확인
    if (!auth.currentUser) {
      alert('인증 세션이 만료되었습니다. 다시 로그인해주세요.');
      console.error('Auth currentUser is null');
      return;
    }

    // 디버깅 정보 출력
    console.log('Current user:', auth.currentUser);
    console.log('User UID:', auth.currentUser.uid);
    console.log('User email:', auth.currentUser.email);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Cloudinary에 이미지 업로드
      const uploadedImages = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const uploadedFile = await uploadToCloudinary(file);
        uploadedImages.push({
          id: uploadedFile.id,
          url: uploadedFile.url,
          name: uploadedFile.name,
          width: uploadedFile.width,
          height: uploadedFile.height,
          format: uploadedFile.format
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
        styleDescription: formData.styleDescription,
        constructionDate: formData.constructionDate,
        folderName: generateFolderName(),
        images: uploadedImages,
        thumbnailIndex: formData.thumbnailIndex,
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
        styleDescription: '',
        constructionDate: '',
        images: [],
        thumbnailIndex: 0
      });
      setSelectedFiles([]);
      setUploadProgress(0);
      
      alert('프로젝트가 성공적으로 업로드되었습니다!');
      
    } catch (error) {
      console.error('업로드 실패:', error);
      
      // Firebase 권한 오류인지 확인
      if (error.message.includes('PERMISSION_DENIED') || error.message.includes('permission_denied')) {
        alert('Firebase 권한 오류가 발생했습니다. 관리자로 로그인되어 있는지 확인해주세요.');
        console.error('Firebase permission error:', error);
      } else {
        alert('업로드 중 오류가 발생했습니다: ' + error.message);
      }
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

  // 필터링된 프로젝트 목록
  const filteredProjects = projects.filter(project => {
    if (filterType === 'all') return true;
    return project.type === filterType;
  });

  // 공사일자 기준으로 정렬 (최신순)
  const sortedProjects = filteredProjects.sort((a, b) => {
    const dateA = a.constructionDate ? new Date(a.constructionDate) : new Date(0);
    const dateB = b.constructionDate ? new Date(b.constructionDate) : new Date(0);
    return dateB - dateA; // 최신순
  });

  const handleEdit = (project) => {
    setEditProject(project);
    setEditFormData({ ...project });
    setIsEditModalOpen(true);
    setEditSelectedFiles([]);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => {
      // 파일 크기 체크
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name}은(는) 파일 크기가 너무 큽니다. (최대 5MB)`);
        return false;
      }
      // 이미지 파일 체크
      return file.type.startsWith('image/');
    });
    setEditSelectedFiles(imageFiles);
  };

  const handleRemoveEditImage = (idx) => {
    setEditFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  const handleEditSave = async () => {
    let newImages = editFormData.images || [];
    if (editSelectedFiles.length > 0) {
      try {
        // 1. Cloudinary에 이미지 업로드
        const uploadedImages = [];
        for (let i = 0; i < editSelectedFiles.length; i++) {
          const file = editSelectedFiles[i];
          const uploadedFile = await uploadToCloudinary(file);
          uploadedImages.push({
            id: uploadedFile.id,
            url: uploadedFile.url,
            name: uploadedFile.name,
            width: uploadedFile.width,
            height: uploadedFile.height,
            format: uploadedFile.format
          });
        }
        // 기존 이미지 + 새 이미지 합치기
        newImages = [...newImages, ...uploadedImages];
      } catch (error) {
        console.error('업데이트 실패:', error);
        alert('업데이트 중 오류가 발생했습니다: ' + error.message);
        return;
      }
    }
    try {
      // 2. Firebase에 프로젝트 메타데이터 저장
      const updatedProject = {
        ...editFormData,
        images: newImages,
        updatedAt: new Date().toISOString()
      };
      // Firebase에 저장
      const projectRef = ref(database, `portfolio/${editProject.id}`);
      await set(projectRef, updatedProject);
      setIsEditModalOpen(false);
      setEditSelectedFiles([]);
      alert('프로젝트가 성공적으로 업데이트되었습니다!');
    } catch (error) {
      console.error('업데이트 실패:', error);
      alert('업데이트 중 오류가 발생했습니다: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-md flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>대시보드</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">포트폴리오 관리</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              상태: <span className="font-medium">{apiStatus}</span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!isCloudinaryReady}
              className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              새 프로젝트 추가
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Cloudinary 정보 표시 */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
            <p className="text-gray-800 font-medium">☁️ Cloudinary 설정 정보</p>
            <p className="text-gray-600 text-sm">Cloud Name: <code className="bg-gray-200 px-1 rounded">{CLOUDINARY_CLOUD_NAME}</code></p>
            <p className="text-gray-600 text-sm mt-1">Upload Preset: <code className="bg-gray-200 px-1 rounded">{UPLOAD_PRESET}</code></p>
            <p className="text-gray-600 text-sm mt-1">최대 파일 크기: <code className="bg-gray-200 px-1 rounded">5MB</code></p>
            <p className="text-gray-600 text-sm mt-1">상태: <span className="text-green-600 font-medium">{apiStatus}</span></p>
            <p className="text-gray-500 text-xs mt-2">
              ⚠️ 기본 ml_default preset 사용 중. 500 에러가 계속 발생하면 Cloudinary Dashboard에서 preset 설정을 확인하세요
            </p>
          </div>

          {/* 필터 */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">필터:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체</option>
                <option value="residential">주거</option>
                <option value="commercial">상업</option>
              </select>
              <span className="text-sm text-gray-600">
                총 {sortedProjects.length}개 프로젝트
              </span>
            </div>
          </div>

          {/* 테이블 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      프로젝트명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      유형
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      주소
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상세정보
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      공사일자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      이미지
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{project.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          project.type === 'residential' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {project.type === 'residential' ? '주거' : '상업'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.type === 'residential' 
                          ? project.area 
                          : businessTypes.find(t => t.value === project.businessType)?.label
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.constructionDate || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.images ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {project.images.length}장
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(project)}
                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                          >
                            편집
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">짧은 스타일 설명</label>
                  <input
                    type="text"
                    name="style"
                    value={formData.style}
                    onChange={handleInputChange}
                    placeholder="예: 모던, 미니멀, 클래식"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">긴 상세 설명</label>
                  <textarea
                    name="styleDescription"
                    value={formData.styleDescription}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="프로젝트의 상세한 스타일 설명을 입력해주세요"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">공사일자</label>
                <input
                  type="month"
                  name="constructionDate"
                  value={formData.constructionDate}
                  onChange={handleInputChange}
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
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedFiles.length}장의 이미지가 선택되었습니다.
                    </p>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className={`w-full h-20 object-cover rounded cursor-pointer border-2 ${
                              formData.thumbnailIndex === index ? 'border-blue-500' : 'border-gray-300'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, thumbnailIndex: index }))}
                          />
                          {formData.thumbnailIndex === index && (
                            <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              ✓
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
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
                  disabled={isUploading || !isCloudinaryReady || selectedFiles.length === 0}
                  className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? '업로드 중...' : '저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">프로젝트 편집</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">형태</label>
                  <select
                    name="type"
                    value={editFormData.type}
                    onChange={handleEditInputChange}
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
                    value={editFormData.title}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">주소</label>
                  <input
                    type="text"
                    name="address"
                    value={editFormData.address}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{editFormData.type === 'residential' ? '평형' : '업종'}</label>
                  {editFormData.type === 'residential' ? (
                    <input
                      type="text"
                      name="area"
                      value={editFormData.area}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                    />
                  ) : (
                    <select
                      name="businessType"
                      value={editFormData.businessType}
                      onChange={handleEditInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                    >
                      {businessTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">짧은 스타일 설명</label>
                  <input
                    type="text"
                    name="style"
                    value={editFormData.style}
                    onChange={handleEditInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">긴 상세 설명</label>
                  <textarea
                    name="styleDescription"
                    value={editFormData.styleDescription}
                    onChange={handleEditInputChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">공사일자</label>
                <input
                  type="month"
                  name="constructionDate"
                  value={editFormData.constructionDate}
                  onChange={handleEditInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">기존 이미지 (썸네일 선택)</label>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-2">
                  {editFormData.images && editFormData.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img 
                        src={img.url || img} 
                        alt="project" 
                        className={`w-full h-20 object-cover rounded cursor-pointer border-2 ${
                          (editFormData.thumbnailIndex || 0) === idx ? 'border-blue-500' : 'border-gray-300'
                        }`}
                        onClick={() => setEditFormData(prev => ({ ...prev, thumbnailIndex: idx }))}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveEditImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        title="이미지 삭제"
                      >
                        ×
                      </button>
                      {(editFormData.thumbnailIndex || 0) === idx && (
                        <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">이미지 추가</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleEditFileSelect}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-800"
                />
                {editSelectedFiles.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">{editSelectedFiles.length}장의 이미지가 추가 선택됨</p>
                )}
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleEditSave}
                  className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
                >
                  저장
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