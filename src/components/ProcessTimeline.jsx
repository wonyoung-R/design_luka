import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  ChatBubbleLeftRightIcon, 
  PencilSquareIcon, 
  DocumentTextIcon, 
  WrenchScrewdriverIcon, 
  CheckBadgeIcon 
} from '@heroicons/react/24/outline';

const processSteps = [
  {
    id: 1,
    title: '초기 상담',
    description: '고객의 요구사항, 공간 특성, 예산 등을 파악하여 프로젝트의 방향성을 설정합니다.',
    icon: ChatBubbleLeftRightIcon,
    duration: '1~2일',
  },
  {
    id: 2,
    title: '디자인 기획',
    description: '공간 분석과 고객의 요구사항을 바탕으로 최적의 디자인 방향을 제안합니다.',
    icon: PencilSquareIcon,
    duration: '3~5일',
  },
  {
    id: 3,
    title: '설계 및 견적',
    description: '디자인을 바탕으로 시공 계획과 상세 견적을 작성하여 제안합니다.',
    icon: DocumentTextIcon,
    duration: '2~3일',
  },
  {
    id: 4,
    title: '시공 및 관리',
    description: '숙련된 시공팀이 철저한 품질 관리와 일정 관리로 완벽한 시공을 진행합니다.',
    icon: WrenchScrewdriverIcon,
    duration: '10~30일',
  },
  {
    id: 5,
    title: '완공 및 AS',
    description: '고객 만족도 조사와 함께 완공 후에도 지속적인 AS 관리를 제공합니다.',
    icon: CheckBadgeIcon,
    duration: '지속적인 관리',
  },
];

export default function ProcessTimeline() {
  // 개별 요소가 아닌 전체 타임라인에 대해 하나의 ref 사용
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="process" className="section bg-neutral-lightest relative">
      {/* Decorative background element */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent/5 rounded-full"></div>
        <div className="absolute -left-40 -bottom-40 w-96 h-96 bg-accent/5 rounded-full"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="inline-block px-3 py-1 text-sm font-medium bg-accent-light/10 text-accent rounded-full mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            투명한 프로세스
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            명확한 단계로 진행되는 프로젝트
          </motion.h2>
          <motion.p
            className="text-primary-light text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            처음부터 끝까지 투명한 프로세스로 고객의 신뢰를 얻고 만족스러운 결과물을 제공합니다.
          </motion.p>
        </div>

        <div className="relative" ref={ref}>
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-neutral hidden md:block"></div>

          <div className="space-y-12 relative">
            {processSteps.map((step, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={step.id}
                  className={`flex flex-col md:flex-row md:items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Content */}
                  <div className={`md:w-5/12 ${isEven ? 'md:text-right' : ''}`}>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                      <h3 className="text-xl font-bold mb-2 flex items-center">
                        <span className="inline-block bg-accent text-white rounded-full w-7 h-7 text-sm flex items-center justify-center mr-2 md:order-1 md:ml-2 md:mr-0">
                          {step.id}
                        </span>
                        {step.title}
                      </h3>
                      <p className="text-primary-light mb-4">{step.description}</p>
                      <div className={`flex items-center text-sm font-medium text-accent ${isEven ? 'justify-end' : ''}`}>
                        <span className="mr-2">예상 소요기간:</span>
                        <span className="bg-accent/10 px-2 py-1 rounded">{step.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Center icon (visible only on desktop) */}
                  <div className="md:w-2/12 hidden md:flex justify-center">
                    <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg">
                      <step.icon className="w-6 h-6" />
                    </div>
                  </div>
                  
                  {/* Empty space for the alternating layout */}
                  <div className="md:w-5/12 hidden md:block"></div>
                  
                  {/* Mobile icon (visible only on mobile) */}
                  <div className="md:hidden flex items-center">
                    <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg mr-4">
                      <step.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">Step {step.id}</h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <motion.a
            href="#contact"
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            프로젝트 문의하기
          </motion.a>
        </div>
      </div>
    </section>
  );
} 