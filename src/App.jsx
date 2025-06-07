import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import ResidentialPage from './pages/ResidentialPage';
import CommercialPage from './pages/CommercialPage';
import ContactPage from './pages/ContactPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page load - shorter time for development
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, process.env.NODE_ENV === 'development' ? 500 : 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-neutral rounded-full border-t-accent animate-spin"></div>
      </div>
    );
  }

  // 개발 환경에서는 basename 사용하지 않음
  const basename = process.env.NODE_ENV === 'production' ? '/design_luka' : undefined;

  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/residential" element={<ResidentialPage />} />
        <Route path="/portfolio/commercial" element={<CommercialPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}

export default App; 