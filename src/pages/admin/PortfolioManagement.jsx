import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { database } from '../../firebase/config';
import { ref, push, set, onValue, remove } from 'firebase/database';
import { useAuth } from '../../contexts/AuthContext';

const PortfolioManagement = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'residential', // 'residential' or 'commercial'
    size: '', // 평수 or 업종
    title: '',
    content: '',
    mainImage: null,
    subImages: []
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/admin/login');
      return;
    }

    const projectsRef = ref(database, 'portfolio');
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const projectsList = Object.entries(data).map(([id, project]) => ({
          id,
          ...project
        }));
        setProjects(projectsList);
      } else {
        setProjects([]);
      }
    });

    return () => unsubscribe();
  }, [currentUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectsRef = ref(database, 'portfolio');
      const newProjectRef = push(projectsRef);
      await set(newProjectRef, {
        ...formData,
        createdAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setFormData({
        type: 'residential',
        size: '',
        title: '',
        content: '',
        mainImage: null,
        subImages: []
      });
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
      try {
        const projectRef = ref(database, `portfolio/${projectId}`);
        await remove(projectRef);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">포트폴리오 관리</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#2C3E50] text-white rounded-md hover:bg-[#34495E] transition-colors"
          >
            새 프로젝트 추가
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Projects List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {projects.map((project) => (
                <motion.li
                  key={project.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-6 py-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-500">
                        {project.type === 'residential' ? '주거' : '상업'} | 
                        {project.type === 'residential' ? ` ${project.size}평` : ` ${project.size}`}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Add Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl"
            >
              <h2 className="text-xl font-bold mb-4">새 프로젝트 추가</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">프로젝트 유형</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2C3E50] focus:ring-[#2C3E50]"
                  >
                    <option value="residential">주거</option>
                    <option value="commercial">상업</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {formData.type === 'residential' ? '평수' : '업종'}
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder={formData.type === 'residential' ? '평수를 입력하세요' : '업종을 입력하세요'}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2C3E50] focus:ring-[#2C3E50]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">프로젝트명</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2C3E50] focus:ring-[#2C3E50]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">프로젝트 내용</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2C3E50] focus:ring-[#2C3E50]"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2C3E50] text-white rounded-md hover:bg-[#34495E]"
                  >
                    저장
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioManagement; 