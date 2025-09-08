import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import CareerFormPage from './pages/career-form/career-form_page';
import LoginPage from './pages/login/login_pages';
import SignupPage from './pages/signup/signup_page';
import ResultsPage from './pages/results';
import JobDetailPage from './pages/job-detail';
import AboutPage from './pages/about/about_page';
import CommunityPage from './pages/community/community_page';
import ContactPage from './pages/contact/contact_page';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/career-form" element={<CareerFormPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/job-detail/:id" element={<JobDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
