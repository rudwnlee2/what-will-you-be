import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import HomePage from './pages/Home.tsx'; // Import Home page
import AboutPage from './pages/About.tsx'; // Import About page
import DashboardPage from './pages/Dashboard.tsx'; // Import Dashboard page
import './index.css'; // Tailwind CSS 지시문이 포함된 전역 CSS 파일

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App 컴포넌트가 공통 레이아웃 역할을 함
    children: [
      {
        index: true, // 부모 라우트의 기본 자식 ( '/' 경로에 해당)
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      // 향후 다른 라우트들을 여기에 추가할 수 있습니다.
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
