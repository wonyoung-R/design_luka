import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageGallery from '../components/ImageGallery';

export default function PortfolioDetailPage() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch project data from Google Sheets/AppSheet
    // This is a temporary mock data
    const mockProjects = {
      residential: {
        id: id,
        type: 'residential',
        info: '25',
        title: '신반포 APT 25py',
        contents: `모던 미니멀 스타일의 아파트 인테리어 프로젝트입니다.
주거 공간의 기능성과 심미성을 모두 고려한 설계로,
일상 속 편안함과 세련된 분위기를 동시에 구현했습니다.
주방과 거실을 오픈형으로 구성하여 공간감을 극대화했으며,
수납 공간을 충분히 확보하여 실용성을 높였습니다.`,
        main_img: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        sub_imgs: [
          'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600566752546-8b5d9628e9c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
        ]
      },
      commercial: {
        '101': {
          id: '101',
          type: 'commercial',
          info: '카페',
          title: '강남 카페',
          contents: `모던 인더스트리얼 스타일의 카페 인테리어 프로젝트입니다.
원재료의 자연스러운 질감을 살린 디자인으로,
따뜻하고 아늑한 분위기를 연출했습니다.
바 테이블과 소파석을 적절히 배치하여 다양한 고객층을 수용할 수 있도록 했으며,
조명을 통해 공간의 분위기를 조절할 수 있도록 설계했습니다.`,
          main_img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          sub_imgs: [
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
          ]
        },
        '102': {
          id: '102',
          type: 'commercial',
          info: '사무실',
          title: '서초 오피스 리모델링',
          contents: `모던 오피스 스타일의 사무공간 리모델링 프로젝트입니다.
업무 효율성과 쾌적한 근무환경을 모두 고려한 설계로,
창의적인 아이디어가 넘치는 공간을 구현했습니다.
오픈형 레이아웃과 프라이빗 미팅룸을 적절히 배치하여,
협업과 집중이 모두 가능한 환경을 조성했습니다.`,
          main_img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          sub_imgs: [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
          ]
        },
        '103': {
          id: '103',
          type: 'commercial',
          info: '뷰티샵',
          title: '압구정 뷰티샵',
          contents: `미니멀 럭셔리 스타일의 뷰티샵 인테리어 프로젝트입니다.
고급스러운 분위기와 실용적인 기능을 모두 갖춘 공간으로,
고객에게 특별한 경험을 제공합니다.
화장품 진열대와 시술 공간을 효율적으로 배치하여,
편안한 쇼핑과 시술이 가능한 환경을 조성했습니다.`,
          main_img: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          sub_imgs: [
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
          ]
        },
        '104': {
          id: '104',
          type: 'commercial',
          info: '레스토랑',
          title: '송파 레스토랑',
          contents: `모던 클래식 스타일의 레스토랑 인테리어 프로젝트입니다.
세련된 분위기와 편안한 식사 공간을 모두 갖춘 디자인으로,
특별한 경험을 제공합니다.
테이블 배치와 조명을 통해 각 테이블의 프라이버시를 보장하면서도,
전체적으로 통일감 있는 공간을 연출했습니다.`,
          main_img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          sub_imgs: [
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
          ]
        }
      }
    };

    // URL에서 type을 가져와서 해당하는 프로젝트 데이터 설정
    const projectType = type || (location.pathname.includes('/commercial') ? 'commercial' : 'residential');
    const projectData = projectType === 'commercial' ? mockProjects.commercial[id] : mockProjects.residential;
    
    if (!projectData) {
      setProject(null);
      setLoading(false);
      return;
    }

    setProject(projectData);
    setLoading(false);
  }, [id, type, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">프로젝트를 찾을 수 없습니다</h2>
          <button
            onClick={() => navigate('/portfolio')}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            포트폴리오로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column (3) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-3/10 sticky top-24 h-fit"
            >
              <div className="space-y-6">
                {/* Project Type & Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-gray-100 rounded-full">
                    {project.type === 'residential' ? '주거 공간' : '상업 공간'}
                  </span>
                  <span>•</span>
                  <span>
                    {project.type === 'residential' ? `${project.info}평` : project.info}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold">{project.title}</h1>

                {/* Contents */}
                <div className="prose prose-sm max-w-none">
                  {project.contents.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-600 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Main Image */}
                <div className="aspect-[4/3] overflow-hidden rounded-lg">
                  <img
                    src={project.main_img}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Column (7) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-7/10"
            >
              <ImageGallery images={project.sub_imgs} />
            </motion.div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
} 