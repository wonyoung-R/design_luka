import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  HomeIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  CheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const spaceOptions = [
  { id: 'kitchen', label: '주방' },
  { id: 'living', label: '거실' },
  { id: 'bedroom', label: '침실' },
  { id: 'bathroom', label: '욕실' },
  { id: 'office', label: '사무공간' },
  { id: 'commercial', label: '상업공간' },
  { id: 'other', label: '기타' },
];

const sizeOptions = [
  { id: 'xs', label: '3평 이하', value: 'XS' },
  { id: 'sm', label: '3~8평', value: 'S' },
  { id: 'md', label: '8~15평', value: 'M' },
  { id: 'lg', label: '15~30평', value: 'L' },
  { id: 'xl', label: '30평 초과', value: 'XL' },
];

const budgetOptions = [
  { id: 'budget1', label: '500만원 이하' },
  { id: 'budget2', label: '500~1,000만원' },
  { id: 'budget3', label: '1,000~2,000만원' },
  { id: 'budget4', label: '2,000만원 이상' },
];

export default function SurveyForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    spaceType: [],
    size: '',
    budget: '',
    message: '',
    preferredContact: 'email',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요';
      if (!formData.email.trim()) newErrors.email = '이메일을 입력해주세요';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '유효한 이메일 주소를 입력해주세요';
      if (!formData.phone.trim()) newErrors.phone = '연락처를 입력해주세요';
      else if (!/^\d{3}-?\d{3,4}-?\d{4}$/.test(formData.phone.replace(/-/g, ''))) 
        newErrors.phone = '유효한 전화번호를 입력해주세요';
    } else if (currentStep === 2) {
      if (formData.spaceType.length === 0) newErrors.spaceType = '공간 유형을 선택해주세요';
      if (!formData.size) newErrors.size = '공간 크기를 선택해주세요';
      if (!formData.budget) newErrors.budget = '예산 범위를 선택해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (checked) {
        setFormData({
          ...formData,
          [name]: [...formData[name], value],
        });
      } else {
        setFormData({
          ...formData,
          [name]: formData[name].filter(item => item !== value),
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo({
        top: document.getElementById('contact').offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        console.log('Form submitted:', formData);
      }, 1500);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  return (
    <section id="contact" className="section bg-primary-dark text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            className="inline-block px-3 py-1 text-sm font-medium bg-white/10 text-white rounded-full mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            무료 상담 신청
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            나에게 맞는 인테리어 솔루션
          </motion.h2>
          <motion.p
            className="text-neutral-light text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            몇 가지 질문에 답하고 맞춤형 인테리어 상담을 받아보세요.
          </motion.p>
        </div>

        {/* Progress bar */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex justify-between relative mb-2">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-neutral-dark transform -translate-y-1/2 z-0"></div>
            {[1, 2, 3].map((stepNumber) => (
              <motion.div
                key={stepNumber}
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                  stepNumber < step
                    ? 'bg-accent text-white'
                    : stepNumber === step
                    ? 'bg-white text-primary-dark'
                    : 'bg-neutral-dark text-white'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: stepNumber * 0.2, duration: 0.3 }}
              >
                {stepNumber < step ? <CheckIcon className="w-5 h-5" /> : stepNumber}
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-neutral-light">
            <span>기본 정보</span>
            <span>공간 정보</span>
            <span>추가 정보</span>
          </div>
        </div>

        <motion.div
          ref={ref}
          className="max-w-3xl mx-auto bg-white text-primary rounded-xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          {isSubmitted ? (
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckIcon className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">상담 신청이 완료되었습니다!</h3>
              <p className="text-primary-light mb-8">
                입력해주신 연락처로 영업일 기준 1-2일 내에 연락드리겠습니다.
                추가 문의사항이 있으시면 언제든지 연락주세요.
              </p>
              <a href="#" className="btn-primary">
                홈으로 돌아가기
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold mb-6">기본 정보 입력</h3>
                  
                  <div className="form-group">
                    <label className="block text-primary-dark text-sm font-medium mb-2">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-primary-light" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-3 border ${
                          errors.name ? 'border-red-500' : 'border-neutral'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-accent`}
                        placeholder="홍길동"
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-primary-dark text-sm font-medium mb-2">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-primary-light" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-3 border ${
                          errors.email ? 'border-red-500' : 'border-neutral'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-accent`}
                        placeholder="example@email.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-primary-dark text-sm font-medium mb-2">
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-primary-light" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-3 border ${
                          errors.phone ? 'border-red-500' : 'border-neutral'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-accent`}
                        placeholder="010-1234-5678"
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-primary-dark text-sm font-medium mb-2">
                      선호 연락 방법
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="email"
                          checked={formData.preferredContact === 'email'}
                          onChange={handleChange}
                          className="h-4 w-4 text-accent border-neutral focus:ring-accent"
                        />
                        <span className="ml-2 text-sm">이메일</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="phone"
                          checked={formData.preferredContact === 'phone'}
                          onChange={handleChange}
                          className="h-4 w-4 text-accent border-neutral focus:ring-accent"
                        />
                        <span className="ml-2 text-sm">전화</span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold mb-6">공간 정보</h3>
                  
                  <div className="form-group">
                    <label className="block text-primary-dark text-sm font-medium mb-2">
                      공간 유형 <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {spaceOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`
                            flex items-center p-3 border rounded-md cursor-pointer transition-colors
                            ${formData.spaceType.includes(option.id) 
                              ? 'bg-accent/10 border-accent' 
                              : 'border-neutral hover:bg-neutral-light'}
                          `}
                        >
                          <input
                            type="checkbox"
                            name="spaceType"
                            value={option.id}
                            checked={formData.spaceType.includes(option.id)}
                            onChange={handleChange}
                            className="h-4 w-4 text-accent border-neutral focus:ring-accent hidden"
                          />
                          <span className={`ml-2 text-sm ${formData.spaceType.includes(option.id) ? 'text-accent font-medium' : ''}`}>
                            {option.label}
                          </span>
                          {formData.spaceType.includes(option.id) && (
                            <CheckIcon className="h-4 w-4 text-accent ml-auto" />
                          )}
                        </label>
                      ))}
                    </div>
                    {errors.spaceType && <p className="mt-1 text-sm text-red-500">{errors.spaceType}</p>}
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-primary-dark text-sm font-medium mb-2">
                      공간 크기 <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {sizeOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`
                            flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer transition-colors
                            ${formData.size === option.id 
                              ? 'bg-accent/10 border-accent' 
                              : 'border-neutral hover:bg-neutral-light'}
                          `}
                        >
                          <input
                            type="radio"
                            name="size"
                            value={option.id}
                            checked={formData.size === option.id}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <span className="text-lg font-bold mb-1">{option.value}</span>
                          <span className="text-xs text-primary-light">{option.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.size && <p className="mt-1 text-sm text-red-500">{errors.size}</p>}
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-primary-dark text-sm font-medium mb-2">
                      예산 범위 <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {budgetOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`
                            flex items-center p-3 border rounded-md cursor-pointer transition-colors
                            ${formData.budget === option.id 
                              ? 'bg-accent/10 border-accent' 
                              : 'border-neutral hover:bg-neutral-light'}
                          `}
                        >
                          <input
                            type="radio"
                            name="budget"
                            value={option.id}
                            checked={formData.budget === option.id}
                            onChange={handleChange}
                            className="h-4 w-4 text-accent border-neutral focus:ring-accent"
                          />
                          <span className={`ml-2 text-sm ${formData.budget === option.id ? 'text-accent font-medium' : ''}`}>
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget}</p>}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold mb-6">추가 정보</h3>
                  
                  <div className="form-group">
                    <label className="block text-primary-dark text-sm font-medium mb-2">
                      추가 요청사항
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <PencilSquareIcon className="h-5 w-5 text-primary-light" />
                      </div>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-accent h-32"
                        placeholder="원하는 스타일, 참고할 만한 사항 등을 자유롭게 입력해주세요."
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-neutral-lightest rounded-md">
                    <h4 className="font-medium mb-2">입력하신 정보 확인</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                      <div className="flex">
                        <span className="text-primary-light w-24">이름:</span>
                        <span className="font-medium">{formData.name}</span>
                      </div>
                      <div className="flex">
                        <span className="text-primary-light w-24">연락처:</span>
                        <span className="font-medium">{formData.phone}</span>
                      </div>
                      <div className="flex">
                        <span className="text-primary-light w-24">이메일:</span>
                        <span className="font-medium">{formData.email}</span>
                      </div>
                      <div className="flex">
                        <span className="text-primary-light w-24">선호 연락:</span>
                        <span className="font-medium">{formData.preferredContact === 'email' ? '이메일' : '전화'}</span>
                      </div>
                      <div className="flex">
                        <span className="text-primary-light w-24">공간 유형:</span>
                        <span className="font-medium">
                          {formData.spaceType.map(type => 
                            spaceOptions.find(option => option.id === type)?.label
                          ).join(', ')}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="text-primary-light w-24">공간 크기:</span>
                        <span className="font-medium">
                          {sizeOptions.find(option => option.id === formData.size)?.label}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="text-primary-light w-24">예산 범위:</span>
                        <span className="font-medium">
                          {budgetOptions.find(option => option.id === formData.budget)?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="consent"
                        className="h-4 w-4 text-accent border-neutral focus:ring-accent"
                        required
                      />
                      <span className="ml-2 text-sm">
                        개인정보 수집 및 이용에 동의합니다 <span className="text-red-500">*</span>
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}

              <div className="mt-8 flex justify-between">
                {step > 1 ? (
                  <motion.button
                    type="button"
                    onClick={handlePrev}
                    className="btn-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    이전
                  </motion.button>
                ) : (
                  <div></div>
                )}
                
                {step < 3 ? (
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    다음
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    className="btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        제출 중...
                      </>
                    ) : (
                      '상담 신청하기'
                    )}
                  </motion.button>
                )}
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
} 