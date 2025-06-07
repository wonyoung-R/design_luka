import React from 'react';
import Navbar from '../components/Navbar';
import CaseStudies from '../components/CaseStudies';
import BeforeAfter from '../components/BeforeAfter';
import SpaceCategories from '../components/SpaceCategories';
import Footer from '../components/Footer';

export default function ResidentialPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Residential Hero Section */}
        <section className="section bg-neutral-lightest">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Residential Projects</h1>
              <p className="text-lg text-primary-light mb-8">
                주거 공간의 특성을 살린 맞춤형 인테리어 디자인으로 
                편안하고 아름다운 생활 공간을 만들어드립니다.
              </p>
            </div>
          </div>
        </section>
        
        <SpaceCategories />
        <CaseStudies />
        <BeforeAfter />
      </main>
      <Footer />
    </>
  );
} 