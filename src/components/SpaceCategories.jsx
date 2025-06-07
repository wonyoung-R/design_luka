import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const spaceCategories = [
  {
    id: 1,
    title: '소형 아파트 (20-30평)',
    description: '제한된 공간에서 최대 효율을 끌어내는 스마트한 디자인',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: ['공간 확장 효과', '수납공간 최적화', '동선 개선', '채광 극대화'],
    projects: '25평대 신반포 아파트'
  },
  {
    id: 2,
    title: '중형 아파트 (30-40평)',
    description: '가족 구성원을 위한 기능적이면서도 아늑한 공간 구성',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: ['가족 공간 분리', '아이 방 디자인', '홈카페 공간', '수납 시스템'],
    projects: '33평대 관악 드림타운'
  },
  {
    id: 3,
    title: '대형 아파트 (40평+)',
    description: '여유로운 공간에서 펼쳐지는 럭셔리하고 세련된 라이프스타일',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    features: ['럭셔리 디자인', '워킹 드레스룸', '홈바/엔터테인먼트 공간', '프리미엄 마감재'],
    projects: '40평대+ 고급 아파트'
  }
];

export default function SpaceCategories() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="space-categories" className="section bg-neutral-lightest">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="inline-block px-3 py-1 text-sm font-medium bg-accent-light/10 text-accent rounded-full mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            주거 공간 카테고리
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            평수별 맞춤 디자인
          </motion.h2>
          <motion.p
            className="text-primary-light text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            공간별 특성을 고려한 최적의 인테리어 솔루션을 제공합니다.
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {spaceCategories.map((category) => (
            <motion.div
              key={category.id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.5 }
                }
              }}
              whileHover={{ y: -5 }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold mb-1">{category.title}</h3>
                    <p className="text-xs text-neutral-lightest">{category.projects}</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <p className="text-primary-light text-sm mb-4">
                  {category.description}
                </p>
                
                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-primary-dark mb-2">주요 특징</h4>
                  {category.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-primary-light">
                      <svg className="w-4 h-4 text-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Hover button */}
              <div className="px-6 pb-6">
                <motion.button
                  className="w-full py-2 bg-accent/10 text-accent text-sm font-medium rounded-lg group-hover:bg-accent group-hover:text-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  포트폴리오 보기
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 