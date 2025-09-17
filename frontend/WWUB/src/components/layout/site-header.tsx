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
import { getCurrentUser, isLoggedIn, removeToken } from '@/api/auth';

// 1. App.tsx로부터 받을 prop의 타입을 정의합니다.
interface SiteHeaderProps {
  onWipClick: () => void;
}

export default function SiteHeader({ onWipClick }: SiteHeaderProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  // 사용자 정보를 새로고침하는 함수
  const refreshUser = () => {
    const user = getCurrentUser();
    setUserName(user?.username || null);
  };

  useEffect(() => {
    refreshUser(); // 컴포넌트가 처음 마운트될 때 사용자 정보 확인

    // 다른 탭에서 로그인을 하거나 로그아웃했을 때, 상태를 동기화하기 위한 이벤트 리스너
    const onStorageChange = () => refreshUser();
    window.addEventListener('storage', onStorageChange);

    // 스크롤 위치에 따라 헤더를 숨기거나 보여주는 로직
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // 아래로 스크롤
      } else {
        setIsVisible(true); // 위로 스크롤
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리합니다. (메모리 누수 방지)
    return () => {
      window.removeEventListener('storage', onStorageChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // '진로 탐색하기' 버튼 클릭 시의 동작
  const goCareer = () => {
    if (!isLoggedIn()) {
      navigate('/login'); // 로그인 안 되어 있으면 로그인 페이지로
    } else {
      navigate('/career'); // 로그인 되어 있으면 진로 탐색 페이지로
    }
  };

  // 로그아웃 처리
  const logout = () => {
    removeToken(); // 토큰 삭제
    refreshUser(); // 사용자 상태 새로고침 (userName을 null로 만듦)
    navigate('/'); // 메인 페이지로 이동
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
            <img src="/WWUB 로고.png" alt="WWUB 로고" className="h-14 w-auto" />
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
            {userName ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-900 font-semibold hover:underline">
                    {userName}님, 환영합니다!
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
