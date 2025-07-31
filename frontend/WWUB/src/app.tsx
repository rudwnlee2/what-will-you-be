// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CareerLandingPage from './main'; // 1. CareerLandingPage 컴포넌트를 불러옵니다.
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 2. 메인 경로('/')에 CareerLandingPage를 연결합니다. */}
        <Route path="/maim" element={<CareerLandingPage />} />

        {/* 나중에 다른 페이지(로그인, 회원가입 등)를 만들면 여기에 추가합니다. */}
        {/* 예: <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
