import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Components
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BusinessPage from './pages/BusinessPage';
import PortfolioPage from './pages/PortfolioPage';
import InsightPage from './pages/InsightPage';
import ContactPage from './pages/ContactPage';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';

// Business sub-pages
import TotalLivingPage from './pages/business/TotalLivingPage';
import ReliteLivingPage from './pages/business/ReliteLivingPage';
import TotalBizPage from './pages/business/TotalBizPage';
import BizConsultingPage from './pages/business/BizConsultingPage';

function App() {
  return (
    <Router basename="/design_luka">
      <AuthProvider>
        <div className="App">
          <ScrollToTop />
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<HomePage />} />
            
            {/* About Route */}
            <Route path="/about" element={<AboutPage />} />
            
            {/* Business Routes */}
            <Route path="/business" element={<BusinessPage />} />
            <Route path="/business/residential/total-living" element={<TotalLivingPage />} />
            <Route path="/business/residential/relite-living" element={<ReliteLivingPage />} />
            <Route path="/business/commercial/total-biz" element={<TotalBizPage />} />
            <Route path="/business/commercial/biz-consulting" element={<BizConsultingPage />} />
            
            {/* Portfolio Routes */}
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/residential/:id" element={<PortfolioDetailPage />} />
            <Route path="/portfolio/commercial/:id" element={<PortfolioDetailPage />} />
            
            {/* Insight Route */}
            <Route path="/insight" element={<InsightPage />} />
            
            {/* Contact Route */}
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; 