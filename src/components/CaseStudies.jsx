import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { TagIcon, ClockIcon, ScaleIcon, MapPinIcon } from '@heroicons/react/24/outline';

const caseStudies = [
  {
    id: 1,
    title: '신반포 APT 25py',
    description: '"함께하는 순간이 자라는 집" - 작은 주방+세탁실+작은 방+안방 등 오밀조밀 구분된 작은 공간들의 벽을 내력벽만 남긴 후 시원하게 털어버리고 가족에게 딱 맞게 재구성한 프로젝트입니다.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    tags: ['아파트', '주거공간', '리모델링', '25py'],
    location: '서초구 신반포로',
    supplyArea: '85.52㎡',
    exclusiveArea: '79.42㎡',
    duration: '45일',
    client: '개인',
    concept: '함께하는 순간이 자라는 집',
    category: 'residential'
  },
  {
    id: 2,
    title: '관악 드림타운 33py',
    description: '관악구에 위치한 33평형 아파트의 전체 리모델링 프로젝트로, 기존 공간의 한계를 극복하고 거주자의 라이프스타일에 맞춘 맞춤형 인테리어 디자인을 구현했습니다.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    tags: ['아파트', '주거공간', '리모델링', '33py'],
    location: '관악구 드림타운',
    supplyArea: '108.93㎡',
    exclusiveArea: '84.93㎡',
    duration: '60일',
    client: '개인',
    concept: '모던 클래식',
    category: 'residential'
  },
  {
    id: 3,
    title: '한남동 카페 인테리어',
    description: '한남동의 독특한 분위기를 살린 모던하면서도 따뜻한 감성의 카페 공간 디자인. 자연광을 최대한 활용하고 고객의 동선을 고려한 효율적인 레이아웃을 구현했습니다.',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    tags: ['카페', '상업공간', '한남동', '모던'],
    location: '용산구 한남동',
    supplyArea: '165㎡',
    exclusiveArea: '145㎡',
    duration: '75일',
    client: '카페 브랜드',
    concept: '모던 내추럴',
    category: 'commercial'
  },
];

export default function CaseStudies() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const filters = [
    { id: 'all', name: '전체' },
    { id: 'residential', name: 'Residential' },
    { id: 'commercial', name: 'Commercial' },
  ];

  const filteredCases = activeFilter === 'all' 
    ? caseStudies 
    : caseStudies.filter(item => item.category === activeFilter);

  const toggleCaseExpansion = (id) => {
    setExpandedCaseId(expandedCaseId === id ? null : id);
  };

  return (
    <section id="case-studies" className="section bg-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="inline-block px-3 py-1 text-sm font-medium bg-accent-light/10 text-accent rounded-full mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            포트폴리오
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            실제 프로젝트 사례
          </motion.h2>
          <motion.p
            className="text-primary-light text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            다양한 공간에서 선보인 Design luka의 대표 프로젝트를 소개합니다.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-accent text-white'
                  : 'bg-neutral-light text-primary-light hover:bg-neutral hover:text-primary-dark'
              }`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.name}
            </button>
          ))}
        </motion.div>

        {/* Cases */}
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
                staggerChildren: 0.1
              }
            }
          }}
        >
          {filteredCases.map((caseStudy) => (
            <motion.div
              key={caseStudy.id}
              className="bg-neutral-lightest rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.5 }
                }
              }}
              layout
              whileHover={{ y: -5 }}
            >
              {/* Image */}
              <div className="relative h-52">
                <LazyLoadImage
                  src={caseStudy.image}
                  alt={caseStudy.title}
                  effect="blur"
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
                    {caseStudy.category === 'residential' ? 'Residential' : 'Commercial'}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{caseStudy.title}</h3>
                {caseStudy.concept && (
                  <p className="text-accent text-sm font-medium mb-2">"{caseStudy.concept}"</p>
                )}
                <p className="text-primary-light text-sm mb-4">
                  {expandedCaseId === caseStudy.id 
                    ? caseStudy.description 
                    : `${caseStudy.description.substring(0, 80)}...`}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {caseStudy.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full flex items-center"
                    >
                      <TagIcon className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Expandable details */}
                <motion.div 
                  className="space-y-3"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: expandedCaseId === caseStudy.id ? 'auto' : 0,
                    opacity: expandedCaseId === caseStudy.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center text-sm text-primary-light">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    <span>위치: {caseStudy.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-primary-light">
                    <ScaleIcon className="w-4 h-4 mr-2" />
                    <span>공급면적: {caseStudy.supplyArea}</span>
                  </div>
                  {caseStudy.exclusiveArea && (
                    <div className="flex items-center text-sm text-primary-light">
                      <ScaleIcon className="w-4 h-4 mr-2" />
                      <span>전용면적: {caseStudy.exclusiveArea}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-primary-light">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span>시공기간: {caseStudy.duration}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-neutral">
                    <div className="text-sm text-primary-light">클라이언트: {caseStudy.client}</div>
                  </div>
                </motion.div>
                
                {/* Toggle button */}
                <motion.button
                  className="mt-4 text-accent text-sm font-medium flex items-center"
                  onClick={() => toggleCaseExpansion(caseStudy.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {expandedCaseId === caseStudy.id ? '간략히 보기' : '자세히 보기'}
                  <svg className={`ml-1 w-4 h-4 transition-transform ${expandedCaseId === caseStudy.id ? 'rotate-180' : ''}`} 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </motion.button>
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
            더 많은 프로젝트 보기
          </motion.a>
        </div>
      </div>
    </section>
  );
} 