import React from 'react';
import { Link, Outlet } from 'react-router-dom'; // React Router DOM 사용 시 필요

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-8 text-gray-800">
      {/* 헤더 섹션 */}
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-blue-700 drop-shadow-lg">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            What Will You Be?
          </span>
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          A Journey of Discovery and Growth
        </p>
      </header>

      {/* 네비게이션 섹션 (React Router DOM 사용 예시) */}
      <nav className="mb-12 flex justify-center space-x-8">
        <Link
          to="/"
          className="text-lg font-medium text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-lg font-medium text-purple-600 hover:text-purple-800 transition duration-300 ease-in-out transform hover:scale-105"
        >
          About Us
        </Link>
        <Link
          to="/dashboard"
          className="text-lg font-medium text-green-600 hover:text-green-800 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Dashboard
        </Link>
      </nav>

      {/* 메인 콘텐츠 영역 (React Router DOM의 Outlet) */}
      <main className="container mx-auto p-8 bg-white rounded-xl shadow-2xl">
        <Outlet /> {/* 라우트된 컴포넌트가 여기에 렌더링됩니다 */}
      </main>

      {/* 푸터 섹션 */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} What Will You Be? All rights reserved.</p>
        <p className="mt-2">Built with React, TypeScript, and Tailwind CSS.</p>
      </footer>
    </div>
  );
}

export default App;