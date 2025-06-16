import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { 
  ComputerDesktopIcon,
  Square3Stack3DIcon,
  DocumentTextIcon,
  SwatchIcon,
  DocumentCheckIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  PhotoIcon,
  CogIcon
} from '@heroicons/react/24/outline';

export default function ProcessPage() {
  const processSteps = [
    {
      step: '01',
      title: '인테리어 상담신청',
      description: '온라인 상담 신청 및 현장 상담 미팅 예약',
      details: [
        '온라인 상담 신청서 작성',
        '전화 상담 후 사무실 미팅 예약',
        '초도 미팅 전 설문지 작성'
      ],
      icon: ComputerDesktopIcon
    },
    {
      step: '02',
      title: '담당 디자이너와 현장실측 & 초도 미팅',
      description: '고객의 라이프스타일, 취향과 함께 인테리어 및 시공 컨셉 상담',
      details: [
        '고객님의 라이프 스타일, 추구하는 인테리어 및 니즈에 대한 파악',
        '원하시는 날짜 시공 가능 유무 판단',
        '초도 미팅 시 현장 도면과 사진을 지참해주시면, 보다 자세한 안내를 도와드릴 수 있습니다.'
      ],
      icon: Square3Stack3DIcon
    },
    {
      step: '03',
      title: '방향성 미팅 (1차)',
      description: '초도 미팅 디자인 컨설팅 받담성',
      details: [
        '초도 미팅 디자인 컨셉이 반영된 <br />2D도면 및 톤 앤 매너 전달',
        '초도 미팅 디자인 제안 예상 가견적<br />및 공사 범위 전달'
      ],
      icon: DocumentTextIcon
    },
    {
      step: '04',
      title: '포인트 디자인 미팅',
      description: '초도 미팅 디자인 컨설팅 받담성',
      details: [
        '초도 미팅 디자인 컨셉이 반영된 <br />2D도면(A, B안) 및 3D 포인트컷 /<br /> 레퍼런스 이미지 전달',
        '1차 디자인 제안 베이스가 견적 전달'
      ],
      icon: SwatchIcon
    },
    {
      step: '05',
      title: '디자인 미팅 (2차)',
      description: '포인트 디자인 미팅의 방향성',
      details: [
        '포인트 디자인 미팅이 반영된 수정 도면 및 전체 3D 전달',
        '디자인 마감재 최종 선택'
      ],
      icon: DocumentCheckIcon
    },
    {
      step: '06',
      title: '계약',
      description: '확정된 디자인의 방향성 견적과 설계법 도서 및 3D 전달',
      details: [
        '확정된 디자인이 반영된 견적과 설계도서(평면도 및 3D)전달',
        '계약서 작성'
      ],
      icon: DocumentCheckIcon
    },
    {
      step: '07',
      title: '커뮤니케이션 채팅방 개설',
      description: '공사 시작부터 자재 전달, 시공 내용, 공정표 등 모든 공사에 대한 내용을 실시간 공유',
      details: [
        '공사 시작부터 자재 선정, 시공 내용, 공정표 등 모든 공사에 대한 내용을 채팅방에서 공유'
      ],
      icon: UserGroupIcon
    },
    {
      step: '08',
      title: '시공',
      description: '현장 시공의 진행 관리',
      details: [
        '현장 직원이 현장 감리',
        '꼼꼼한 공사 진행'
      ],
      icon: WrenchScrewdriverIcon
    },
    {
      step: '09',
      title: '포트폴리오 촬영',
      description: '촬영된 자료는 신SNS에 업로드됩니다.',
      details: [
        '촬영 자료는 지사 SNS에 활용'
      ],
      icon: PhotoIcon
    },
    {
      step: '10',
      title: 'A/S 1년 보증',
      description: '구매 이후에는 인턴 A/S 보증 비용이 발생할 수 있습니다.',
      details: [
        '하자 보증서 발행', 
        '공사 기간 내 하자가 발생되지 않도록 노력합니다.',
        '고객님의 부주의로 인한 A/S는 별도의 비용이 발생할 수 있습니다.'
      ],
      icon: CogIcon
    }
  ];

  return (
    <>
      <Navbar />
      <main className="pt-14">
        {/* Process Hero Section */}
        <section className="section bg-gray-50 min-h-[350px] flex items-center">
          <div className="container">
            <div className="text-center max-w-4xl mx-auto">
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Working Process
              </motion.h1>
              
              <motion.p
                className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Design LUKA 진행 과정
              </motion.p>
            </div>
          </div>
        </section>

        {/* Process Steps Grid */}
        <section className="section bg-white">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {processSteps.map((step, index) => (
                <div key={step.step} className="relative">
                  <motion.div
                    className="relative group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {/* Card Container with Fixed Height */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 h-80 flex flex-col">
                      {/* Process Number */}
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-gray-400 mb-2">
                          {index + 1}
                        </div>
                      </div>

                      {/* Icon */}
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-all duration-300">
                          <step.icon className="w-6 h-6 text-gray-700" />
                        </div>
                      </div>

                      {/* Content - Flex Grow to Fill Remaining Space */}
                      <div className="text-left flex-1 flex flex-col">
                        <h3 className="font-bold text-xs lg:text-sm mb-3 text-gray-800 leading-tight">
                          {step.title}
                        </h3>
                        
                        <div className="flex-1 flex flex-col justify-start items-start">
                          <ul className="space-y-1 text-left self-start">
                            {step.details.map((detail, detailIndex) => {
                              const isSpecialNote = detail.includes('초도 미팅 시 현장 도면과 사진을 지참해주시면') || 
                                                  detail.includes('고객님의 부주의로 인한 A/S는 별도의 비용이 발생할 수 있습니다');
                              
                              return (
                                <li 
                                  key={detailIndex} 
                                  className={`leading-relaxed text-left ${
                                    isSpecialNote 
                                      ? 'text-[10px] text-red-500' 
                                      : 'text-xs text-gray-500'
                                  }`}
                                  dangerouslySetInnerHTML={{ __html: `• ${detail}` }}
                                />
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Arrow between cards - only show on large screens and not for last card */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <div className="w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm">
                        <svg 
                          className="w-3 h-3 text-gray-400" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 