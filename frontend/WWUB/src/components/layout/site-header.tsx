'use client';

import { useState, useEffect } from 'react';
// 1. react-router-dom에서 Link와 useNavigate를 가져옵니다.
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// 2. 확장된 인증 유틸리티 함수들을 가져옵니다.
import { useAuth } from '@/hooks/useAuth';

// 1. App.tsx로부터 받을 prop의 타입을 정의합니다.
interface SiteHeaderProps {
  onWipClick: () => void;
}

export default function SiteHeader({ onWipClick }: SiteHeaderProps) {
  // ❗ 2. useAuth 훅으로 사용자 정보와 로그아웃 함수를 직접 가져옵니다.
  const { user, logout, isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY <= lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const goCareer = () => {
    // ❗ 4. useAuth의 isAuthenticated 상태를 사용
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/career-form');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* 3. Next.js의 Link를 react-router-dom의 Link로 교체 (href -> to) */}
          <Link to="/" className="flex items-center">
            {/* 4. Next.js의 Image를 일반 img 태그로 교체 (public 폴더 기준 경로) */}
            <img src="/images/WWUB 로고.png" alt="WWUB 로고" className="h-20 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={goCareer} className="text-gray-700 hover:text-gray-900 font-medium">
              진로 탐색하기
            </button>
            <Link to="/about" className="text-gray-700 hover:text-gray-900 font-medium">
              서비스 소개
            </Link>
            <Link to="/community" className="text-gray-700 hover:text-gray-900 font-medium">
              커뮤니티
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-gray-900 font-medium">
              문의하기
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {/* 5. 로그인 상태에 따라 다른 UI를 보여줍니다. */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-900 font-semibold hover:underline">
                    {user.name}님, 환영합니다!
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 bg-white shadow-lg border">
                  <DropdownMenuItem onClick={() => navigate('/me')}>내 정보</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/history')}>
                    추천 기록
                  </DropdownMenuItem>
                  {/* 2. '미션'과 '친구' 메뉴 아이템을 클릭하면 onWipClick 함수를 호출합니다. */}
                  <DropdownMenuItem onSelect={onWipClick}>미션</DropdownMenuItem>
                  <DropdownMenuItem onSelect={onWipClick}>친구</DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>로그아웃</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="font-medium text-gray-700 hover:bg-gray-50">
                    로그인
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="font-medium px-5 py-2.5 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    회원가입
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
