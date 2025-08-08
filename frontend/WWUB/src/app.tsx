import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CareerLandingPage from './Home page'; // 메인 랜딩 페이지
import CareerFormPage from './pages/career'; // 진로 탐색 폼 페이지
import LoginPage from './pages/login'; // 로그인 페이지
import SignupPage from './pages/signup'; // 회원가입 페이지
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 경로('/')에 CareerLandingPage를 연결합니다. */}
        <Route path="/" element={<CareerLandingPage />} />

        {/* 각 페이지 컴포넌트에 대한 경로를 설정합니다. */}
        <Route path="/career" element={<CareerFormPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
