import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { 
  SparklesIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* About Hero Section */}
        <section className="section bg-neutral-lightest">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                안녕하세요. 공간 디자인 전문 회사,<br />
                <span className="text-accent">디자인 루카</span>입니다.
              </motion.h1>
              
              <motion.div
                className="text-2xl md:text-3xl font-light text-accent mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                "Shine your place, Fine your life."
              </motion.div>
              
              <motion.div
                className="text-lg text-primary-light leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="mb-6">
                  디자인 루카의 이름은 슬로베니아어로 '빛'을 의미하는 'LUKA'에서 비롯되었습니다.
                </p>
                <p className="mb-6">
                  이는 우리가 디자인하는 모든 공간에 담긴 철학을 반영한 이름으로 단순한 리모델링을 넘어서 
                  라이프스타일과 브랜드에 맞춘 맞춤형 디자인을 통해 세련되고 감각적인 공간을 창조합니다.
                </p>
                <p>
                  저희는 강남구, 서초구, 송파구를 중심으로 서울 전역에서 다양한 인테리어 프로젝트를 진행하고 있으며 
                  2022년 4월 1일에 설립되어 서울 서초구에 두 개의 오피스를 운영하고 있습니다.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Company Info Section */}
        <section className="section bg-white">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Design luka office"
                    className="rounded-xl shadow-lg"
                  />
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">LUKA</div>
                      <div className="text-xs text-primary-light">Light</div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">
                  <span className="block text-primary-light text-lg font-normal mb-2">당신의 공간을 빛나게 함으로써,</span>
                  <span className="text-accent">당신의 삶에 품격을 더합니다.</span>
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <CalendarIcon className="w-6 h-6 text-accent mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">설립일</h3>
                      <p className="text-primary-light">2022년 4월 1일</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPinIcon className="w-6 h-6 text-accent mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">오피스 위치</h3>
                      <div className="space-y-2 text-primary-light">
                        <p><strong>논현점:</strong> 서초구 사평대로 57길 131 웰빙센타 휴리재 2층</p>
                        <p><strong>반포점:</strong> 서초구 반포대로 287, 107호</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="section bg-neutral-lightest">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                우리의 서비스
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="text-center p-8 bg-white rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SparklesIcon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-4">CUSTOMIZE</h3>
                <p className="text-primary-light leading-relaxed">
                  단순한 리모델링을 넘어, 주거와 상업 공간 모두 
                  고객의 라이프 스타일과 비즈니스 니즈에 맞춘
                  맞춤형 디자인으로 세련되고 감각적인 공간을 창조합니다.
                </p>
              </motion.div>

              <motion.div
                className="text-center p-8 bg-white rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PencilSquareIcon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-4">DESIGN</h3>
                <p className="text-primary-light leading-relaxed">
                  디자인 루카의 주거 및 상업공간 전문 디자이너들이
                  최신 트렌드를 반영한 감각적인 공간을 기획하고 제안합니다.
                </p>
              </motion.div>

              <motion.div
                className="text-center p-8 bg-white rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheckIcon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-4">STABILITY</h3>
                <p className="text-primary-light leading-relaxed">
                  안전한 시공은 물론 준공 이후에도 지속적인 관리와 
                  유지 보수 서비스를 통해 주거·상업 공간 모두에서 
                  고객이 오랜 시간 만족할 수 있도록 최선을 다하고 있습니다.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 