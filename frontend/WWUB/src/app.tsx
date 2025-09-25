import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Homepage from './pages/Homepage';
import CareerFormPage from './pages/career-form/career-form_page';
import LoginPage from './pages/login/login_pages';
import SignupPage from './pages/signup/signup_page';
import ResultsPage from './pages/results/results_page';
import JobDetailPage from './pages/results/detail/detail_page';
import AboutPage from './pages/about/about_page';
import CommunityPage from './pages/community/community_page';
import ContactPage from './pages/contact/contact_page';
import MePage from './pages/me/me_pages';
import EditPage from './pages/me/edit/edit_pages';
import HistoryPage from './pages/history/history_page';
// import MissionsPage from './pages/missions/missions_page';
// import FriendsPage from './pages/friends/page';
import TermsPage from './pages/terms/terms_page';
import PrivacyPage from './pages/privacy/privacy_pages';
import WipModal from './components/layout/WipModal'; // WipModal 컴포넌트
import { useWipModal } from './hooks/useWipModal'; // 모달 훅
import SiteHeader from './components/layout/site-header'; // SiteHeader 컴포넌트
import Loading from './pages/loading/loading_pages';
import { useEffect } from 'react';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const { isWipModalOpen, openWipModal, closeWipModal } = useWipModal();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <SiteHeader onWipClick={openWipModal} />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/career-form" element={<CareerFormPage />} />
          <Route path="/login" element={<LoginPage onWipClick={openWipModal} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/results/detail/:id" element={<JobDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/me" element={<MePage />} />
          <Route path="/me/edit" element={<EditPage />} />
          <Route path="/history" element={<HistoryPage />} />
          {/* <Route path="/missions" element={<MissionsPage />} /> */}
          {/* <Route path="/friends" element={<FriendsPage />} /> */}
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/loading" element={<Loading />} />
        </Routes>
      </main>
      <WipModal isOpen={isWipModalOpen} onClose={closeWipModal} />
    </BrowserRouter>
  );
}

export default App;
