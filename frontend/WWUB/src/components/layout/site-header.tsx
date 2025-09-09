import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';

export default function SiteHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const goCareer = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/career-form');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <img
              src="/images/WWUB 로고.png"
              alt="WWUB Logo"
              className="h-14 w-auto"
            />
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
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-900 font-semibold">
                  {user.name}씨 어서오세요
                </span>
                <Button onClick={logout} variant="ghost" className="font-medium text-gray-700">
                  로그아웃
                </Button>
              </div>
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
