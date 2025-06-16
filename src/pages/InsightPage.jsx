import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchPressArticles, formatDate } from '../utils/googleSheetsApi';

export default function InsightPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [pressArticles, setPressArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPressArticles = async () => {
      try {
        const articles = await fetchPressArticles();
        setPressArticles(articles);
      } catch (error) {
        console.error('Error loading press articles:', error);
        // You might want to show an error message to the user here
      } finally {
        setLoading(false);
      }
    };

    loadPressArticles();
  }, []);

  const tabs = [
    { id: 'all', label: '전체' },
    { id: 'trend', label: '트렌드' },
    { id: 'tips', label: '인테리어 팁' },
    { id: 'news', label: '뉴스' }
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/design_luka_official/',
      icon: (
        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" fill="currentColor"/>
        </svg>
      )
    },
    {
      name: 'Threads',
      url: 'https://www.threads.com/@design_luka_official',
      icon: (
        <svg className="w-6 h-6 mr-3" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 2C12.3 2 2 12.3 2 25s10.3 23 23 23 23-10.3 23-23S37.7 2 25 2zm0 44C13.4 46 4 36.6 4 25S13.4 4 25 4s21 9.4 21 21-9.4 21-21 21zm0-32c-6.1 0-11 4.9-11 11 0 4.4 2.7 8.2 6.6 9.8.5.2.7-.2.7-.5v-1.7c-2.7.6-3.3-1.3-3.3-1.3-.5-1.1-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1C19.7 15.8 22.3 15.8 25 15.8c2.7 0 5.3 0 7.2.2 1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.7.7.5C38.3 33.2 41 29.4 41 25c0-6.1-4.9-11-11-11z" fill="currentColor"/>
        </svg>
      )
    },
    {
      name: '오늘의집',
      url: 'https://ohou.se/experts/myhome/25337805',
      icon: (
        <svg className="w-6 h-6 mr-3" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="512" height="512" rx="0" fill="#36C8F4"/>
          <path d="M256 104.6L126.6 194.1c-6.1 4.2-9.8 11.1-9.8 18.4v175.9c0 12.4 10.1 22.5 22.5 22.5h233.4c12.4 0 22.5-10.1 22.5-22.5V212.5c0-7.3-3.7-14.2-9.8-18.4L256 104.6zM256 144.2l110.2 76.1v168.1H145.8V220.3L256 144.2zm0 64.8c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm0 32c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32z" fill="#fff"/>
        </svg>
      )
    }
  ];

  const insights = [
    {
      id: 1,
      category: 'trend',
      title: '2024 인테리어 트렌드',
      description: '새로운 해를 맞이하며 주목해야 할 인테리어 트렌드를 소개합니다.',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      date: '2024.01.15'
    },
    {
      id: 2,
      category: 'tips',
      title: '작은 공간을 넓어 보이게 하는 방법',
      description: '제한된 공간을 효과적으로 활용하는 인테리어 팁을 공유합니다.',
      image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      date: '2024.01.10'
    },
    {
      id: 3,
      category: 'news',
      title: 'DESIGN LUKA, 신규 오피스 오픈',
      description: '서초구 반포동에 새로운 오피스를 오픈했습니다.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      date: '2024.01.05'
    }
  ];

  const filteredInsights = activeTab === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === activeTab);

  return (
    <>
      <Navbar />
      <main className="pt-16 font-['Noto_Sans_KR']">
        {/* Hero Section */}
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
                Insight & Contents
              </motion.h1>
              <motion.p
                className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                공간 디자인에 대한 인사이트와 최신 소식을 공유합니다.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="section bg-white">
          <div className="container">
            {/* Tabs */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredInsights.map((insight, index) => (
                <motion.article
                  key={insight.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <Link to={`/insight/${insight.id}`} className="block">
                    <div className="relative h-48">
                      <img
                        src={insight.image}
                        alt={insight.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
                          {insight.category === 'trend' ? '트렌드' : 
                           insight.category === 'tips' ? '인테리어 팁' : '뉴스'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-gray-500 mb-2">{insight.date}</div>
                      <h3 className="text-xl font-bold mb-2">{insight.title}</h3>
                      <p className="text-primary-light">{insight.description}</p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </>
  );
} 