import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

const projects = [
  {
    id: 1,
    title: '모던 미니멀 주방',
    description: '좁은 공간을 효율적으로 활용한 모던 미니멀 스타일의 주방 리모델링',
    before: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    after: 'https://images.unsplash.com/photo-1556911220-bda9da8a1f2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: '럭셔리 리빙룸',
    description: '고급스러운 소재와 색상을 활용한 클래식 모던 스타일의 거실 디자인',
    before: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    after: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  },
];

export default function BeforeAfter() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="before-after" className="section bg-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="inline-block px-3 py-1 text-sm font-medium bg-accent-light/10 text-accent rounded-full mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            비포 & 애프터
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            놀라운 변화를 직접 확인하세요
          </motion.h2>
          <motion.p
            className="text-primary-light text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            슬라이더를 움직여 비포&애프터를 비교해보세요. 공간의 완벽한 변신을 경험하실 수 있습니다.
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, staggerChildren: 0.2 }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-neutral-lightest rounded-xl overflow-hidden shadow-lg"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <ReactCompareSlider
                  itemOne={
                    <ReactCompareSliderImage
                      src={project.before}
                      alt="Before"
                      style={{ objectFit: 'cover' }}
                    />
                  }
                  itemTwo={
                    <ReactCompareSliderImage
                      src={project.after}
                      alt="After"
                      style={{ objectFit: 'cover' }}
                    />
                  }
                  className="h-[350px]"
                  style={{ height: '350px' }}
                  handleComponent={{
                    render: (props) => {
                      return (
                        <div
                          {...props}
                          className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md"
                        >
                          <ArrowsRightLeftIcon className="w-6 h-6 text-accent" />
                        </div>
                      );
                    },
                  }}
                />
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className="px-2 py-1 text-xs font-semibold bg-primary-dark text-white rounded">Before</span>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <span className="px-2 py-1 text-xs font-semibold bg-accent text-white rounded">After</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-primary-light">{project.description}</p>
                <a
                  href={`#project-${project.id}`}
                  className="inline-flex items-center mt-4 text-accent font-medium hover:text-accent-dark transition-colors"
                >
                  프로젝트 자세히 보기
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-16 text-center">
          <motion.a
            href="#portfolio"
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            모든 프로젝트 보기
          </motion.a>
        </div>
      </div>
    </section>
  );
} 