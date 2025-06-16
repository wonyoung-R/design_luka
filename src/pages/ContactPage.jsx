import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { submitQnAForm } from '../utils/googleSheetsApi';

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
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset'; // Restore scrolling
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
      await submitQnAForm({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        emailConsent: formData.emailConsent
      });

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
    <>
      <Navbar />
      <main className="pt-16 font-['Noto_Sans_KR']">
        {/* Contact Hero Section */}
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
                Contact Us
              </motion.h1>
              <motion.p
                className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                DESIGN LUKA와 함께 당신만의 특별한 공간을 만들어보세요.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="section bg-white min-h-[700px] py-24">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-12">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-8 py-4 text-lg font-medium transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-b-2 border-black text-black'
                        : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
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
                    <h2 className="text-3xl font-bold mb-4">상담 신청</h2>
                    <p className="text-gray-600 mb-12">
                      원하시는 상담 유형을 선택해주세요.
                    </p>

                    {/* Service Type Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 max-w-md px-8 py-24 bg-black text-white hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => openModal('https://tally.so/r/mRJ6yj')}
                      >
                        <div className="text-center">
                          <h3 className="text-xl font-bold mb-2">주거 공간</h3>
                          <p className="text-sm text-gray-300">Residential</p>
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 max-w-md px-8 py-24 bg-black text-white hover:bg-gray-800 transition-colors duration-200"
                        onClick={() => openModal('https://tally.so/r/waDP7q')}
                      >
                        <div className="text-center">
                          <h3 className="text-xl font-bold mb-2">상업 공간</h3>
                          <p className="text-sm text-gray-300">Commercial</p>
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="qna"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold mb-4 font-['Noto_Sans_KR']">고객 Q&A</h2>
                      <p className="text-gray-600 font-['Noto_Sans_KR']">문의사항이 있으시다면 아래 양식을 작성해 주세요.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            이름 *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            전화번호 *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          이메일 *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          문의사항 *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                          placeholder="문의하실 내용을 자세히 작성해 주세요."
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
                            className="h-4 w-4 text-black focus:ring-black border-gray-300"
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
                        className={`w-full px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-200 ${
                          isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? '제출 중...' : '문의하기'}
                      </motion.button>

                      {submitStatus === 'success' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-gray-50 text-gray-900 border border-gray-200"
                        >
                          문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.
                        </motion.div>
                      )}

                      {submitStatus === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-gray-50 text-gray-900 border border-gray-200"
                        >
                          {submitError}
                        </motion.div>
                      )}
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="relative w-full h-[90vh] max-w-6xl bg-white overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white shadow-md transition-colors duration-200"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
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

      {/* <Footer /> */}
    </>
  );
} 