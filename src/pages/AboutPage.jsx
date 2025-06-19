import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

// Mock imports for demo (실제 프로젝트에서는 아래 imports 사용)
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';

const AboutPage = () => {
  useEffect(() => {
    const handleScroll = () => {
      // 모든 스크롤 텍스트 요소에 색상 변화 효과 적용
      const scrollTextElements = document.querySelectorAll('.scroll-text-effect');
      
      scrollTextElements.forEach((textElement) => {
        const textRect = textElement.getBoundingClientRect();
        const textTop = textRect.top;
        const textBottom = textRect.bottom;
        const windowHeight = window.innerHeight;
        
        // 텍스트가 화면에 보이는 범위 계산
        if (textTop < windowHeight && textBottom > 0) {
          // 화면 상단을 기준으로 색상 변화 계산
          const textCenter = (textTop + textBottom) / 2;
          
          // 0 (검은색)에서 1 (흰색)까지의 비율 계산
          let colorRatio = Math.max(0, 1 - (textCenter / (windowHeight * 0.8)));
          
          // 부드러운 전환을 위한 이지징 함수 적용
          const easedRatio = colorRatio * colorRatio * (3 - 2 * colorRatio);
          
          // RGB 값 계산 (검은색에서 흰색으로)
          const colorValue = Math.round(easedRatio * 255);
          const textColor = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
          
          textElement.style.color = textColor;
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 초기 실행
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white font-['Noto_Sans_KR']">
      {/* Navbar */}
      <Navbar />

      <main className="pt-16 min-h-screen">
        
        {/* About LUKA + 소개글 섹션 */}
        <section className="py-0 w-full">
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center min-h-screen">
              
              {/* About LUKA 제목 */}
              <div className="text-center md:text-left p-8 md:p-16 lg:p-20 min-h-[50vh] md:min-h-0 flex flex-col justify-center">
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 md:mb-8 scroll-text-effect transition-colors duration-300 font-['Noto_Sans_KR']"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  About LUKA
                </motion.h1>
                <motion.p
                  className="text-lg md:text-xl lg:text-2xl text-gray-600 font-light scroll-text-effect transition-colors duration-300 font-['Noto_Sans_KR']"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  공간을 통해 삶의 가치를<br />
                  높이는 디자인 스튜디오
                </motion.p>
              </div>

              {/* 소개글 */}
              <div className="p-8 md:p-16 lg:p-20 min-h-[50vh] md:min-h-0 flex flex-col justify-center">
                <motion.div
                  className="text-base md:text-lg leading-relaxed space-y-4 md:space-y-6 scroll-text-effect transition-colors duration-300 font-['Noto_Sans_KR']"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <p>
                    DESIGN LUKA의 이름은 슬로베니아어로 '빛'을 의미하는 'LUKA'에서 비롯되었습니다. 
                    이는 우리가 디자인하는 모든 공간에 담긴 철학을 반영한 이름으로 단순한 리모델링을 넘어서 
                    라이프스타일과 브랜드에 맞춘 맞춤형 디자인을 통해 세련되고 감각적인 공간을 창조합니다.
                  </p>
                  <p>
                    저희는 강남구, 서초구, 송파구를 중심으로 서울 전역에서 다양한 인테리어 프로젝트를 진행하고 있으며 
                    2022년 4월 1일에 설립되어 서울 서초구에 두 개의 오피스를 운영하고 있습니다. 
                    논현점은 서초구 사평대로 57길 131 웰빙센타 휴리재 2층에 위치하고 있으며 
                    반포점은 서초구 반포대로 287, 107호에 자리잡고 있습니다.
                  </p>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* CUSTOMIZE 섹션 */}
        <section className="py-0 w-full bg-gray-50">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center min-h-screen">
              
              {/* 텍스트 */}
              <div className="order-1 p-8 md:p-16 lg:p-20 min-h-[50vh] lg:min-h-0 flex flex-col justify-center">
                <motion.div
                  className="scroll-text-effect transition-colors duration-300 font-['Noto_Sans_KR']"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 font-['Noto_Sans_KR']">CUSTOMIZE</h2>
                  <p className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-600 font-['Noto_Sans_KR']">
                    단순한 리모델링을 넘어, 주거와 상업공간 모두 
                    고객의 라이프스타일과 비즈니스 니즈에 맞춘 
                    맞춤형 디자인으로 세련되고 감각적인 공간을 창조합니다.
                  </p>
                </motion.div>
              </div>

              {/* 이미지 */}
              <div className="order-2 h-[50vh] lg:h-screen">
                <motion.div
                  className="h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80" 
                    alt="커스터마이즈 인테리어" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* DESIGN 섹션 */}
        <section className="py-0 w-full">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center min-h-screen">
              
              {/* 이미지 */}
              <div className="order-2 lg:order-1 h-[50vh] lg:h-screen">
                <motion.div
                  className="h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=900&q=80" 
                    alt="디자인 인테리어" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>
              </div>

              {/* 텍스트 */}
              <div className="order-1 lg:order-2 p-8 md:p-16 lg:p-20 min-h-[50vh] lg:min-h-0 flex flex-col justify-center">
                <motion.div
                  className="scroll-text-effect transition-colors duration-300 font-['Noto_Sans_KR']"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 font-['Noto_Sans_KR']">DESIGN</h2>
                  <p className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-600 font-['Noto_Sans_KR']">
                    DESIGN LUKA의 주거 및 상업공간 전문 디자이너들이 
                    최신 트렌드를 반영한 감각적인 공간을 기획하고 제안합니다.
                  </p>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* STABILITY 섹션 */}
        <section className="py-0 w-full bg-gray-50">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center min-h-screen">
              
              {/* 텍스트 */}
              <div className="order-1 p-8 md:p-16 lg:p-20 min-h-[50vh] lg:min-h-0 flex flex-col justify-center">
                <motion.div
                  className="scroll-text-effect transition-colors duration-300 font-['Noto_Sans_KR']"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 font-['Noto_Sans_KR']">STABILITY</h2>
                  <p className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-600 font-['Noto_Sans_KR']">
                    시공 이후에도 지속적인 관리와 유지보수 서비스를 통해 
                    주거·상업 공간 모두에서 고객이 오랜 시간 만족할 수 있도록 
                    최선을 다하고 있습니다.
                  </p>
                </motion.div>
              </div>

              {/* 이미지 */}
              <div className="order-2 h-[50vh] lg:h-screen">
                <motion.div
                  className="h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80" 
                    alt="안정성 인테리어" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-xl font-bold mb-4 font-['Noto_Sans_KR']">DESIGN LUKA</div>
          <p className="text-gray-400 font-['Noto_Sans_KR']">
            공간에 생명을 불어넣는 디자인
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;