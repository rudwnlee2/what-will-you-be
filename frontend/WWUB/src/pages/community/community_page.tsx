import SiteHeader from '@/components/site-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Heart } from 'lucide-react';

export default function CommunityPage() {
  const features = [
    {
      icon: <MessageCircle className="w-8 h-8 text-blue-500" />,
      title: '진로 상담',
      description: '다른 사용자들과 진로 고민을 나누어보세요.',
      status: '추후 업데이트 예정'
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: '동종업계 모임',
      description: '같은 분야에 관심 있는 사람들과 연결되세요.',
      status: '추후 업데이트 예정'
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: '성공 사례',
      description: '진로 변경에 성공한 사례들을 공유해보세요.',
      status: '추후 업데이트 예정'
    }
  ];

  return (
    <div className="min-h-screen bg-purple-50">
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">커뮤니티</h1>
          <p className="text-lg text-gray-600">
            다른 사용자들과 진로 고민을 나누고 정보를 공유해보세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  {feature.status}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="p-8">
            <CardContent>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">커뮤니티 기능 준비 중</h2>
              <p className="text-gray-600 mb-6">
                더 나은 서비스를 위해 커뮤니티 기능을 개발 중입니다.<br/>
                빠른 시일 내에 만나볼 수 있도록 하겠습니다.
              </p>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                알림 신청하기
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
