import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App'; // 1. 앱의 시작점이 되는 App.tsx를 import 합니다.
import './index.css';

// 2. TanStack Query의 두뇌 역할을 하는 QueryClient 인스턴스를 생성합니다.
const queryClient = new QueryClient();

// 3. HTML의 'root' 요소에 React 앱을 렌더링합니다.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 4. QueryClientProvider로 App 컴포넌트를 감싸서 앱 전체에서 Query를 사용할 수 있게 합니다. */}
    <QueryClientProvider client={queryClient}>
      {/* 5. App 컴포넌트를 렌더링합니다. 이 안에 라우터와 모든 페이지가 들어있습니다. */}
      <App />

      {/* 6. 개발자 도구를 추가합니다. */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
