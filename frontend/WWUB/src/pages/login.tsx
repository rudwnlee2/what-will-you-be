'use client';

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';

// 1. 로그인 요청 함수가 이제 username과 password를 받습니다.
const loginUser = async (credentials: { username: string; password: string }) => {
  return api.post('/api/members/login', credentials);
};

export default function LoginPage() {
  const navigate = useNavigate();
  // 2. email state를 username state로 변경합니다.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      const token = response.headers['authorization'];
      if (token) {
        localStorage.setItem('jwtToken', token);
        api.defaults.headers.common['Authorization'] = token;
        alert('로그인에 성공했습니다!');
        navigate('/');
      } else {
        setError('로그인에 실패했습니다. 서버 응답에 토큰이 없습니다.');
      }
    },
    onError: (err) => {
      console.error('로그인 실패:', err);
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // 3. mutate 함수에 username과 password를 전달합니다.
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">로그인</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            {/* 4. Label과 Input을 ID용으로 변경합니다. */}
            <Label htmlFor="username">아이디</Label>
            <Input
              id="username"
              type="text"
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="remember-me" className="ml-2 text-gray-700">
                로그인 상태 유지
              </Label>
            </div>
            <Link to="#" className="font-medium text-blue-600 hover:underline">
              비밀번호를 잊으셨나요?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            {loginMutation.isPending ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-500">또는 소셜 계정으로 로그인</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full py-4 flex items-center justify-center space-x-3 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors bg-white font-medium text-base"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Google로 시작하기</span>
          </Button>
          <Button
            className="w-full py-4 flex items-center justify-center space-x-3 rounded-lg font-medium text-base text-black transition-colors"
            style={{ backgroundColor: '#FEE500' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FDD835')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FEE500')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C7.03 3 3 6.58 3 11c0 2.84 1.87 5.34 4.68 6.84l-.9 3.34c-.08.3.22.56.49.42L11.16 19c.28.02.56.03.84.03 4.97 0 9-3.58 9-8s-4.03-8-9-8z" />
            </svg>
            <span>Kakao로 시작하기</span>
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          아직 계정이 없으신가요?{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:underline">
            회원가입하기
          </Link>
        </div>

        {/* ... */}
      </div>
    </div>
  );
}
