import React from 'react';
import Navbar from '../components/Navbar';
import CaseStudies from '../components/CaseStudies';
import BeforeAfter from '../components/BeforeAfter';
import Footer from '../components/Footer';

export default function CommercialPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Commercial Hero Section */}
        <section className="section bg-neutral-lightest">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Commercial Projects</h1>
              <p className="text-lg text-primary-light mb-8">
                브랜드 아이덴티티를 반영한 상업 공간 디자인으로 
                비즈니스의 성공을 뒷받침하는 공간을 제작합니다.
              </p>
            </div>
          </div>
        </section>
        
        {/* Commercial specific content */}
        <section className="section bg-white">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Office Design</h3>
                <p className="text-primary-light">생산성을 높이는 현대적인 오피스 공간</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Retail Space</h3>
                <p className="text-primary-light">매출 증대를 위한 전략적 매장 디자인</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Restaurant</h3>
                <p className="text-primary-light">분위기와 기능성을 겸비한 레스토랑 인테리어</p>
              </div>
            </div>
          </div>
        </section>
        
        <CaseStudies />
        <BeforeAfter />
      </main>
      <Footer />
    </>
  );
} 