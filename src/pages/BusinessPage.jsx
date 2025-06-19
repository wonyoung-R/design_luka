import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  BuildingOfficeIcon,
  ChartBarIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    title: '맞춤형 디자인',
    description: '고객의 라이프스타일과 니즈에 맞는 맞춤형 디자인을 제공합니다.',
    icon: HomeIcon
  },
  {
    title: '전문가 컨설팅',
    description: '풍부한 경험을 바탕으로 한 전문적인 컨설팅 서비스를 제공합니다.',
    icon: ChartBarIcon
  },
  {
    title: '프리미엄 시공',
    description: '최고급 자재와 장인정신으로 완성하는 프리미엄 시공 서비스를 제공합니다.',
    icon: BuildingOfficeIcon
  },
  {
    title: '트렌드 분석',
    description: '최신 인테리어 트렌드를 분석하여 트렌디한 공간을 제안합니다.',
    icon: LightBulbIcon
  }
];

const BusinessPage = () => {
  const bgRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(-${scrollY * 0.33}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const businessCategories = [
    {
      id: 'residential',
      title: 'RESIDENTIAL',
      description: '주거 공간의 특성을 살린 맞춤형 인테리어 디자인',
      items: [
        {
          title: 'Total Living',
          description: '완벽한 주거 공간 솔루션',
          href: '/business/residential/total-living',
          image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Re:Lite Living',
          description: '효율적인 부분 공사 솔루션',
          href: '/business/residential/relite-living',
          image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        }
      ]
    },
    {
      id: 'commercial',
      title: 'COMMERCIAL',
      description: '비즈니스 성공을 위한 공간 디자인 솔루션',
      items: [
        {
          title: 'Total Biz',
          description: '브랜드 아이덴티티를 반영한 상업 공간 디자인',
          href: '/business/commercial/total-biz',
          image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Biz Consulting',
          description: '비즈니스 성공을 위한 공간 컨설팅',
          href: '/business/commercial/biz-consulting',
          image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        }
      ]
    }
  ];

  return (
    <div className="relative overflow-x-hidden">
      {/* 패럴랙스 배경 */}
      <div
        ref={bgRef}
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          height: '150%',
          background: 'linear-gradient(to bottom, #111 0%, #111 10%, #fff 30%, #fff 100%)',
          transition: 'transform 0.1s linear',
        }}
      />
      <Navbar />
      <main className="pt-16 font-['Noto_Sans_KR'] relative z-10 min-h-screen">
        {/* Hero Section */}
        <section className="min-h-[320px] flex items-center justify-center text-white">
          <div className="w-full px-4">
            <div className="text-center max-w-4xl mx-auto">
              <motion.h1
                className="text-4xl md:text-5xl font-['Noto_Sans_KR'] font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Business
              </motion.h1>
              <motion.p
                className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto font-['Noto_Sans_KR']"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                주거공간과 상업공간, 두 가지 영역에서 최적의 솔루션을 제공합니다
              </motion.p>
            </div>
          </div>
        </section>

        {/* Business Categories */}
        <section className="bg-transparent">
          <div className="w-full px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.span
                className="inline-block px-3 py-1 text-sm font-medium bg-accent-light/10 text-accent rounded-full mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                사업 영역
              </motion.span>
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                공간 유형별 맞춤 솔루션
              </motion.h2>
              <motion.p
                className="text-primary-light text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                주거공간과 상업공간, 각각의 특성에 맞는 최적의 디자인을 제안합니다
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Residential */}
              <motion.div
                className="group relative overflow-hidden rounded-xl bg-neutral-lightest"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <Link to="/business/residential/total-living" className="block p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                      <HomeIcon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold">주거공간</h3>
                  </div>
                  <p className="text-primary-light mb-6">
                    아파트, 주택 등 주거공간의 특성을 고려한 맞춤형 인테리어 솔루션을 제공합니다.
                  </p>
                  <div className="flex items-center text-accent">
                    <span className="mr-2">자세히 보기</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>

              {/* Commercial */}
              <motion.div
                className="group relative overflow-hidden rounded-xl bg-neutral-lightest"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5 }}
              >
                <Link to="/business/commercial/total-biz" className="block p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                      <BuildingOfficeIcon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold">상업공간</h3>
                  </div>
                  <p className="text-primary-light mb-6">
                    카페, 레스토랑, 오피스 등 상업공간의 특성을 고려한 맞춤형 인테리어 솔루션을 제공합니다.
                  </p>
                  <div className="flex items-center text-accent">
                    <span className="mr-2">자세히 보기</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-transparent">
          <div className="w-full px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.span
                className="inline-block px-3 py-1 text-sm font-medium bg-accent-light/10 text-accent rounded-full mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                서비스 특징
              </motion.span>
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                차별화된 서비스
              </motion.h2>
              <motion.p
                className="text-primary-light text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                DESIGN LUKA만의 특별한 서비스로 최상의 결과물을 제공합니다
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 3) }}
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-primary-light">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BusinessPage;