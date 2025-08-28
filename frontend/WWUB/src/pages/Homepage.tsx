import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Users, Target, ArrowRight } from 'lucide-react';
import SiteHeader from '@/components/site-header';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function CareerLandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const steps = [
    {
      icon: <Search className="w-8 h-8 text-blue-500" />,
      title: '성향 분석',
      description: '간단한 질문을 통해 당신의 성격, 관심사, 가치관을 분석합니다.',
    },
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: 'AI 매칭',
      description: '축적된 데이터와 AI 알고리즘으로 최적의 직업을 찾아드립니다.',
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: '맞춤 추천',
      description: '개인별 특성에 맞는 구체적인 진로와 준비 방법을 제시합니다.',
    },
  ];

  const startCareerFlow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/career-form');
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              나에게 딱 맞는 직업,
              <br />
              <span className="text-blue-600">여기서 찾아봐요</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AI가 분석하는 나만의 진로 추천 서비스
            </p>
            <Button
              size="lg"
              onClick={startCareerFlow}
              className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700"
            >
              무료로 시작하기
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Program Introduction */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              어떻게 작동하나요?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              3단계 간단한 과정으로 당신에게 맞는 직업을 찾아드립니다
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <Card
                key={idx}
                className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">지금 바로 시작해보세요</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            몇 분만 투자하면 평생의 진로를 찾을 수 있어요
          </p>
          <Button
            size="lg"
            onClick={startCareerFlow}
            className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100"
          >
            무료 진로 테스트 시작하기
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">너 커서 뭐할래?</div>
          <p className="text-gray-600 mb-4">AI 기반 진로 추천 서비스</p>
          <div className="text-gray-500">
            문의:{' '}
            <a href="mailto:support@careerfit.kr" className="text-blue-600 hover:underline">
              support@careerfit.kr
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
