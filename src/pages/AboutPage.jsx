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
      <main className="pt-16 font-['Noto_Sans_KR']">
        {/* Hero Section */}
        <section className="section bg-black text-white min-h-[175px] flex items-start py-12">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                About Luka
              </motion.h1>
              <motion.p
                className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                공간을 통해 삶의 가치를 높이는 디자인 스튜디오
              </motion.p>
            </div>
          </div>
        </section>

        {/* Company Info Section */}
        <section className="section bg-white">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <motion.div
                className="text-lg text-primary-light leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="mb-6">
                  DESIGN LUKA의 이름은 슬로베니아어로 '빛'을 의미하는 'LUKA'에서 비롯되었습니다.
                  이는 우리가 디자인하는 모든 공간에 담긴 철학을 반영한 이름으로 단순한 리모델링을 넘어서 
                  라이프스타일과 브랜드에 맞춘 맞춤형 디자인을 통해 세련되고 감각적인 공간을 창조합니다.
                </p>
                <p className="mb-8">
                  저희는 강남구, 서초구, 송파구를 중심으로 서울 전역에서 다양한 인테리어 프로젝트를 진행하고 있으며 
                  2022년 4월 1일에 설립되어 서울 서초구에 두 개의 오피스를 운영하고 있습니다. 
                  논현점은 서초구 사평대로 57길 131 웰빙센타 휴리재 2층에 위치하고 있으며 반포점은 서초구 반포대로 287, 107호에 자리잡고 있습니다.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="text-center p-8 bg-white rounded-xl shadow-md border border-gray-100"
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
                  단순한 리모델링을 넘어, 주거와 상업공간 모두 고객의 라이프스타일과 비즈니스 니즈에 맞춘 맞춤형 디자인으로 세련되고 감각적인 공간을 창조합니다.
                </p>
              </motion.div>

              <motion.div 
                className="text-center p-8 bg-white rounded-xl shadow-md border border-gray-100"
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
                  DESIGN LUKA의 주거 및 상업공간 전문 디자이너들이 최신 트렌드를 반영한 감각적인 공간을 기획하고 제안합니다.
                </p>
              </motion.div>

              <motion.div 
                className="text-center p-8 bg-white rounded-xl shadow-md border border-gray-100"
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
                  시공 이후에도 지속적인 관리와 유지보수 서비스를 통해 주거·상업 공간 모두에서 고객이 오랜 시간 만족할 수 있도록 최선을 다하고 있습니다.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
   
    </>
  );
} 