import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    spaceType: '',
    budget: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 실제 구현시에는 여기서 폼 데이터를 서버로 전송
    console.log('Form submitted:', formData);
    alert('문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.');
  };

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Contact Hero Section */}
        <section className="py-12 md:py-16 bg-neutral-lightest">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
              <p className="text-lg text-primary-light mb-8">
                인테리어 프로젝트에 대한 상담이 필요하시다면 언제든지 연락해주세요. 
                전문가가 친절하게 안내해드리겠습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="section bg-white">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-8">연락처 정보</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <BuildingOfficeIcon className="w-6 h-6 text-accent mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">회사명</h3>
                      <p className="text-primary-light">루카앤컴퍼니 주식회사</p>
                      <p className="text-sm text-primary-light">대표자: 김규민</p>
                      <p className="text-sm text-primary-light">사업자 등록번호: 669-87-02507</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPinIcon className="w-6 h-6 text-accent mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">주소</h3>
                      <p className="text-primary-light">
                        서울특별시 서초구 사평대로57길 131, 2층<br />
                        (반포동, 웰빙센타 휴리재)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <PhoneIcon className="w-6 h-6 text-accent mr-4" />
                    <div>
                      <h3 className="font-semibold mb-1">전화번호</h3>
                      <p className="text-primary-light">02-6405-0075</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-6 h-6 text-accent mr-4" />
                    <div>
                      <h3 className="font-semibold mb-1">이메일</h3>
                      <p className="text-primary-light">design_luka@naver.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <ClockIcon className="w-6 h-6 text-accent mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">운영시간</h3>
                      <p className="text-primary-light">평일: 09:00 - 18:00</p>
                      <p className="text-primary-light">주말 및 공휴일 휴무</p>
                    </div>
                  </div>
                </div>

                {/* Quick Contact Actions */}
                <div className="mt-8 space-y-3">
                  <motion.a
                    href="tel:02-6405-0075"
                    className="flex items-center justify-center w-full py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <PhoneIcon className="w-5 h-5 mr-2" />
                    전화하기
                  </motion.a>
                  
                  <motion.a
                    href="mailto:design_luka@naver.com"
                    className="flex items-center justify-center w-full py-3 border border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <EnvelopeIcon className="w-5 h-5 mr-2" />
                    이메일 보내기
                  </motion.a>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-8">온라인 상담 신청</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-primary-dark mb-2">
                        성함 *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="이름을 입력해주세요"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-primary-dark mb-2">
                        연락처 *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="010-0000-0000"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary-dark mb-2">
                      이메일 *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="example@email.com"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="spaceType" className="block text-sm font-medium text-primary-dark mb-2">
                        공간 유형
                      </label>
                      <select
                        id="spaceType"
                        name="spaceType"
                        value={formData.spaceType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      >
                        <option value="">선택해주세요</option>
                        <option value="small-apt">소형 아파트 (20-30평)</option>
                        <option value="medium-apt">중형 아파트 (30-40평)</option>
                        <option value="large-apt">대형 아파트 (40평+)</option>
                        <option value="commercial">상업 공간</option>
                        <option value="other">기타</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-primary-dark mb-2">
                        예상 예산
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      >
                        <option value="">선택해주세요</option>
                        <option value="under-3000">3,000만원 미만</option>
                        <option value="3000-5000">3,000만원 - 5,000만원</option>
                        <option value="5000-10000">5,000만원 - 1억원</option>
                        <option value="over-10000">1억원 이상</option>
                        <option value="consultation">상담 후 결정</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-primary-dark mb-2">
                      상담 내용
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                      placeholder="프로젝트에 대한 상세한 내용이나 원하시는 디자인 스타일 등을 자유롭게 작성해주세요."
                    ></textarea>
                  </div>
                  
                  <motion.button
                    type="submit"
                    className="w-full py-4 bg-accent text-white font-medium rounded-lg hover:bg-accent-dark transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    상담 신청하기
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 