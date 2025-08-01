import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // 1. 라우터가 있는 App.tsx를 불러온다.
import './index.css';

// 2. HTML의 'root'라는 ID를 가진 요소에 React 앱을 주입한다.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App /> {/* 3. App 컴포넌트가 앱의 시작점이라고 알려준다. */}
  </React.StrictMode>,
);
