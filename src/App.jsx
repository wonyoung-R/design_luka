import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// HashRouter → BrowserRouter 전환 (2026-07): 검색엔진 색인 가능한 path형 URL.
// gh-pages 딥링크는 public/404.html(spa-github-pages) + scripts/postbuild.js(라우트별 html 사본)가 처리.
import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import RouteSEO from './components/RouteSEO';
import ProtectedRoute from './components/ProtectedRoute';

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
import MobileDebug from './pages/MobileDebug';

// Business sub-pages
import TotalLivingPage from './pages/business/TotalLivingPage';
import ReliteLivingPage from './pages/business/ReliteLivingPage';
import TotalBizPage from './pages/business/TotalBizPage';
import BizConsultingPage from './pages/business/BizConsultingPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PortfolioManagement from './pages/admin/PortfolioManagement';
import InsightManagement from './pages/admin/InsightManagement';
import SiteContentManagement from './pages/admin/SiteContentManagement';

function App() {
  return (
    <HelmetProvider>
    <Router>
      <AuthProvider>
        <div className="App">
          <ScrollToTop />
          <RouteSEO />
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
            
            {/* Debug Route */}
            <Route path="/debug" element={<MobileDebug />} />
            
            {/* Admin Routes — /admin/login is public, the rest require auth (P-14) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/portfolio" element={<ProtectedRoute><PortfolioManagement /></ProtectedRoute>} />
            <Route path="/admin/insight" element={<ProtectedRoute><InsightManagement /></ProtectedRoute>} />
            <Route path="/admin/content" element={<ProtectedRoute><SiteContentManagement /></ProtectedRoute>} />
            
            {/* Catch all route - 잘못된 경로는 홈으로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
    </HelmetProvider>
  );
}

export default App; 