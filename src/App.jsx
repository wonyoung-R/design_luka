import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // # 제거하려면 이 줄 사용
import { AuthProvider } from './contexts/AuthContext';

// Components
import ScrollToTop from './components/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BusinessPage from './pages/BusinessPage';
import PortfolioPage from './pages/PortfolioPage';
import InsightPage from './pages/InsightPage';
import ContactPage from './pages/ContactPage';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';
import InsightDetailPage from './pages/InsightDetailPage';

// Business sub-pages
import TotalLivingPage from './pages/business/TotalLivingPage';
import ReliteLivingPage from './pages/business/ReliteLivingPage';
import TotalBizPage from './pages/business/TotalBizPage';
import BizConsultingPage from './pages/business/BizConsultingPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PortfolioManagement from './pages/admin/PortfolioManagement';
import InsightManagement from './pages/admin/InsightManagement';

function App() {
  return (
    <Router>
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
            <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
            
            {/* Insight Route */}
            <Route path="/insight" element={<InsightPage />} />
            <Route path="/insight/:id" element={<InsightDetailPage />} />
            
            {/* Contact Route */}
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/portfolio" element={<PortfolioManagement />} />
            <Route path="/admin/insight" element={<InsightManagement />} />
            
            {/* Catch all route - 잘못된 경로는 홈으로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; 