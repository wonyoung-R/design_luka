import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import lukaSlogan from '../images/aboutluka/LUKA slogan.png';
import lukaCustomize from '../images/aboutluka/luka_cusotmize.png';
import lukaDesign from '../images/aboutluka/luka_design.png';
import lukaStability from '../images/aboutluka/luka_stability.png';

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center min-h-[70vh]">
              
              {/* About LUKA 제목 */}
              <div className="text-center md:text-left p-8 md:p-16 lg:p-20 min-h-[30vh] md:min-h-[50vh] md:min-h-0 flex flex-col justify-center">
                <motion.div
                  className="flex justify-center md:justify-start"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <img 
                    src={lukaSlogan} 
                    alt="LUKA Slogan" 
                    className="max-w-full h-auto min-h-[30vh] md:min-h-[50vh] object-contain scale-65"
                  />
                </motion.div>
              </div>

              {/* 소개글 */}
              <div className="p-8 md:p-16 lg:p-20 min-h-[30vh] md:min-h-[50vh] md:min-h-0 flex flex-col justify-center">
                <motion.div
                  className="text-sm md:text-base leading-relaxed space-y-4 md:space-y-6 scroll-text-effect transition-colors duration-300 font-['Noto_Sans_KR']"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >

                  <p>
                    <b>DESIGN LUKA</b>의 이름은 슬로베니아어로<br />
                    <b>'빛'</b>을 의미하는 <b>'LUKA'</b>에서 비롯되었습니다. <br />
                    우리가 디자인하는 공간에 담긴 철학을 반영한 이름으로<br />
                    단순한 리모델링을 넘어서 라이프스타일과 브랜드에 맞춘<br />
                    <b>맞춤형 디자인</b>을 통해 세련되고 감각적인 공간을 창조합니다.<br />
                    저희는 강남구, 서초구, 송파구를 중심으로 <b>서울 전역</b>에서<br />
                    <b>다양한 인테리어 프로젝트</b>를 진행하고 있습니다.
                  </p>
                  <p>
                    2022년 4월 1일에 설립된 저희는 아직 젊은 회사이지만<br />
                    짧은 역사 속에서도 <b>긴 호흡</b>과 <b>장기적인 관점</b>으로<br />
                    <b>기본에 충실</b>하면서도 <b>세련된 감각</b>을 잃지 않기 위해<br />
                    구성원 모두가 매 프로젝트에 최선을 다하고 있습니다.<br />
                  </p>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* CUSTOMIZE 섹션 */}
        <section className="py-0 w-full bg-gray-50">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center min-h-[60vh]">
              
              {/* 텍스트 */}
              <div className="order-1 p-8 md:p-16 lg:p-20 min-h-[30vh] md:min-h-[50vh] lg:min-h-0 flex flex-col justify-center">
                <motion.div
                  className="scroll-text-effect transition-colors duration-300 font-['Noto_Sans_KR']"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8 font-['Noto_Sans_KR']">CUSTOMIZE</h2>
                  <p className="text-sm md:text-base lg:text-lg leading-relaxed text-gray-600 font-normal font-['Noto_Sans_KR']">
                    단순한 리모델링을 넘어, 주거와 상업공간 모두 고객의 라이프스타일과 
                    <br /> 비즈니스 니즈에 맞춘 맞춤형 디자인으로 세련되고 감각적인 공간을 창조합니다.  
                  </p>
                </motion.div>
              </div>

              {/* 이미지 */}
              <div className="order-2 h-[50vh] lg:h-[70vh]">
                <motion.div
                  className="h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <img 
                    src={lukaCustomize} 
                    alt="커스터마이즈 인테리어" 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* DESIGN 섹션 */}
        <section className="py-0 w-full">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center min-h-[60vh]">
              
              {/* 이미지 */}
              <div className="order-2 lg:order-1 h-[50vh] lg:h-[70vh]">
                <motion.div
                  className="h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <img 
                    src={lukaDesign} 
                    alt="디자인 인테리어" 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              {/* 텍스트 */}
              <div className="order-1 lg:order-2 p-8 md:p-16 lg:p-20 min-h-[30vh] md:min-h-[50vh] lg:min-h-0 flex flex-col justify-center">
                <motion.div
                  className="scroll-text-effect transition-colors duration-300 font-['Noto_Sans_KR']"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8 font-['Noto_Sans_KR']">DESIGN</h2>
                  <p className="text-sm md:text-base lg:text-lg leading-relaxed text-gray-600 font-normal font-['Noto_Sans_KR']">
                    DESIGN LUKA의 주거 및 상업공간 전문 디자이너들이 <br />
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center min-h-[60vh]">
              
              {/* 텍스트 */}
              <div className="order-1 p-8 md:p-16 lg:p-20 min-h-[30vh] md:min-h-[50vh] lg:min-h-0 flex flex-col justify-center">
                <motion.div
                  className="scroll-text-effect transition-colors duration-300 font-['Noto_Sans_KR']"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8 font-['Noto_Sans_KR']">STABILITY</h2>
                  <p className="text-sm md:text-base lg:text-lg leading-relaxed text-gray-600 font-normal font-['Noto_Sans_KR']">
                    시공 이후에도 지속적인 관리와 유지보수 서비스를 통해 <br />
                    주거·상업 공간 모두에서 고객이 오랜 시간 만족할 수 있도록 최선을 다하고 있습니다.
                  </p>
                </motion.div>
              </div>

              {/* 이미지 */}
              <div className="order-2 h-[50vh] lg:h-[70vh]">
                <motion.div
                  className="h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <img 
                    src={lukaStability} 
                    alt="안정성 인테리어" 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center flex justify-center items-center">
          <img 
            src={lukaSlogan} 
            alt="LUKA Slogan" 
            className="w-[25%] h-auto object-contain filter invert brightness-0"
          />
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;