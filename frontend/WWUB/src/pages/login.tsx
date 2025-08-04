'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

          <Button type="submit" disabled={loginMutation.isPending} className="w-full py-3">
            {loginMutation.isPending ? '로그인 중...' : '로그인'}
          </Button>
        </form>
        {/* ... */}
      </div>
    </div>
  );
}
