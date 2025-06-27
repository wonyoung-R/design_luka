import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { submitQnAForm } from '../utils/googleSheetsApi';
import residentialBtn from '../images/btn/regidential_btn.jpg';
import commercialBtn from '../images/btn/commercia_btn.jpg';




const tabs = [
  { id: 'consultation', label: '상담 신청' },
  { id: 'qna', label: '고객 Q&A' }
];

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState('consultation');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    emailConsent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const openModal = (url) => {
    setModalUrl(url);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitStatus(null);

    try {
      console.log('Submitting form data:', formData);
      
      // 실제 Google Sheets API 호출
      const result = await submitQnAForm({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        emailConsent: formData.emailConsent
      });
      
      console.log('Form submission result:', result);

      setSubmitStatus('success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
        emailConsent: false
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error.message || '문의사항 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-white font-['Noto_Sans_KR'] flex flex-col overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-16 flex-1 flex flex-col min-h-0">
        {/* Hero Section - Simplified */}
        <section className="py-2 md:py-4 bg-white from-gray-50 to-white">
          <div className="w-full px-4">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-4xl md:text-5xl font-black text-gray-600 mb-2 md:mb-4 tracking-tight font-['Noto_Sans_KR']"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Contact Us
              </motion.h1>
              
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="flex-1 py-8 md:py-12">
          <div className="w-full px-4">
            <div className="max-w-4xl mx-auto">
              
              {/* Tab Navigation */}
              <div className="flex justify-center mb-6 md:mb-8">
                <div className="flex gap-0 md:gap-4 py-0 w-full md:w-auto px-4 md:px-0">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 md:w-64 h-12 rounded-xl text-base md:text-lg font-['Noto_Sans_KR'] transition-all duration-300 focus:outline-none ${
                        activeTab === tab.id
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-bold">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'consultation' ? (
                  <motion.div
                    key="consultation"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <motion.h2 
                      className="hidden md:block text-2xl md:text-3xl font-bold mb-6 md:mb-8 font-['Noto_Sans_KR']"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      상담 신청
                    </motion.h2>
                    <motion.p 
                      className="text-sm md:text-base text-gray-600 mb-6 font-['Noto_Sans_KR']"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      원하시는 상담 유형을 선택해주세요
                    </motion.p>

                    {/* Service Type Buttons */}
                    <motion.div
                      className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 max-w-7xl mx-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="flex justify-center w-full md:w-auto">
                        <button
                          onClick={() => openModal('https://tally.so/r/mRJ6yj')}
                          className="group relative overflow-hidden bg-transparent min-h-[286px] w-full max-w-md border-2 border-gray-200 hover:border-gray-900 transition-all duration-500 rounded-2xl transform scale-150"
                          style={{ aspectRatio: '4/3' }}
                        >
                          {/* Background Image */}
                          <div className="absolute inset-0">
                            <img 
                              src={residentialBtn} 
                              alt="주거 공간" 
                              className="w-full h-full object-cover group-hover:grayscale group-hover:brightness-50 transition-all duration-500"
                            />
                          </div>
                          {/* Overlay Text */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <h3 className="text-3xl font-bold mb-3 text-transparent group-hover:text-white transition-colors duration-500 font-['Noto_Sans_KR'] transform scale-130">
                                주거 공간
                              </h3>
                              <p className="text-transparent group-hover:text-gray-300 transition-colors duration-500 font-['Noto_Sans_KR'] transform scale-130">
                                Residential
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                      <div className="flex justify-center w-full md:w-auto">
                        <button
                          onClick={() => openModal('https://tally.so/r/waDP7q')}
                          className="group relative overflow-hidden bg-transparent min-h-[286px] w-full max-w-md border-2 border-gray-200 hover:border-gray-900 transition-all duration-500 rounded-2xl transform scale-150"
                          style={{ aspectRatio: '4/3' }}
                        >
                          {/* Background Image */}
                          <div className="absolute inset-0">
                            <img 
                              src={commercialBtn} 
                              alt="상업 공간" 
                              className="w-full h-full object-cover group-hover:grayscale group-hover:brightness-50 transition-all duration-500"
                            />
                          </div>
                          {/* Overlay Text */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <h3 className="text-3xl font-bold mb-3 text-transparent group-hover:text-white transition-colors duration-500 font-['Noto_Sans_KR'] transform scale-130">
                                상업 공간
                              </h3>
                              <p className="text-transparent group-hover:text-gray-300 transition-colors duration-500 font-['Noto_Sans_KR'] transform scale-130">
                                Commercial
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="qna"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-center mb-6">
                      <motion.h2 
                        className="hidden md:block text-2xl md:text-3xl font-bold mb-4 font-['Noto_Sans_KR']"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        고객 Q&A
                      </motion.h2>
                      <motion.p 
                        className="text-sm md:text-base text-gray-600 font-['Noto_Sans_KR']"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        문의사항이 있으시다면 아래 양식을 작성해 주세요
                      </motion.p>
                    </div>

                    <motion.form 
                      onSubmit={handleSubmit} 
                      className="space-y-6 bg-gray-50 rounded-2xl p-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                            이름 *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors duration-200"
                            placeholder="이름을 입력해주세요"
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                            전화번호 *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors duration-200"
                            placeholder="전화번호를 입력해주세요"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          이메일 *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors duration-200"
                          placeholder="이메일을 입력해주세요"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                          문의사항 *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors duration-200"
                          placeholder="문의하실 내용을 자세히 작성해 주세요"
                        />
                      </div>

                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="emailConsent"
                            name="emailConsent"
                            type="checkbox"
                            checked={formData.emailConsent}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="emailConsent" className="text-gray-600">
                            이메일 수신에 동의합니다. (선택)
                          </label>
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full px-6 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-200 ${
                          isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? '제출 중...' : '문의하기'}
                      </motion.button>

                      {submitStatus === 'success' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-green-50 text-green-800 border border-green-200 rounded-xl"
                        >
                          문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.
                        </motion.div>
                      )}

                      {submitStatus === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl"
                        >
                          {submitError}
                        </motion.div>
                      )}
                    </motion.form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-[90vh] max-w-6xl bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Tally form iframe */}
              <iframe
                src={modalUrl}
                className="w-full h-full border-0"
                title="Contact Form"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}