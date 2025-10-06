import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobRecommendation } from '../../hooks/useJobRecommendation'; // 직업 추천 훅

import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
export default function LoadingPage() {
  const navigate = useNavigate();
  // ❗ useJobRecommendation 훅을 사용하여 API 호출 상태를 관리합니다.
  const { createRecommendations } = useJobRecommendation();

  // ❗ API 호출 로직을 재사용할 수 있도록 별도 함수로 분리
  // ❗ API 호출 로직을 useEffect 안으로 다시 합치거나 그대로 두어도 좋습니다.
  useEffect(() => {
    createRecommendations(undefined, {
      onSuccess: () => {
        // 성공 시 결과 페이지로 이동
        navigate('/results');
      },
      onError: (error: Error) => {
        // 실패 시 알림을 띄우고 이전 페이지로 이동
        alert(`추천 생성 중 오류가 발생했습니다: ${error.message}`);
        navigate('/career-form');
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 의존성 배열을 비워 최초 마운트 시 실행되도록 합니다.

  return (
    <div className="min-h-screen bg-purple-50">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <Card className="bg-white shadow-xl">
          <CardContent className="p-8 sm:p-10 text-center space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              당신에게 맞는 직업을 찾고 있어요...
            </h1>
            <p className="text-gray-600">
              AI가 입력하신 정보를 분석하고 있습니다. 잠시만 기다려주세요.
            </p>
            <div className="flex justify-center py-4">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
