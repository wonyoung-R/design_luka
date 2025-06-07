import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CaseStudies from '../components/CaseStudies';
import BeforeAfter from '../components/BeforeAfter';
import Footer from '../components/Footer';

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Portfolio Hero Section */}
        <section className="section bg-neutral-lightest">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Portfolio</h1>
              <p className="text-lg text-primary-light mb-8">
                다양한 공간에서 선보인 Design luka의 대표 프로젝트를 소개합니다.
              </p>
              
              {/* Portfolio Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <Link 
                  to="/portfolio/residential"
                  className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="h-64 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <h3 className="text-2xl font-bold mb-2">Residential</h3>
                      <p className="text-primary-light">주거 공간 프로젝트</p>
                    </div>
                  </div>
                </Link>
                
                <Link 
                  to="/portfolio/commercial"
                  className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="h-64 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <h3 className="text-2xl font-bold mb-2">Commercial</h3>
                      <p className="text-primary-light">상업 공간 프로젝트</p>
                    </div>
                  </div>
                </Link>
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