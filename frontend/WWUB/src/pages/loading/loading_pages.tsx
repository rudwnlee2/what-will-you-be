import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobRecommendation } from '../../hooks/useJobRecommendation'; // 직업 추천 훅

import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
export default function LoadingPage() {
  const navigate = useNavigate();
  // ❗ useJobRecommendation 훅을 사용하여 API 호출 상태를 관리합니다.
  const { createRecommendations, createError } = useJobRecommendation();
  const effectRan = useRef(false); // effect 실행 여부를 추적할 ref 생성

  // ❗ API 호출 로직을 재사용할 수 있도록 별도 함수로 분리
  const runRecommendation = () => {
    createRecommendations(undefined, {
      onSuccess: () => {
        navigate('/results');
      },
      // 👇 1. onError 콜백을 추가합니다.
      onError: (error: Error) => {
        alert(`추천 생성 중 오류가 발생했습니다: ${error.message}`);
        navigate('/career-form');
      },
    });
  };

  useEffect(() => {
    if (effectRan.current === true) {
      return;
    }

    runRecommendation(); // 분리된 함수 호출

    return () => {
      effectRan.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

            {/* 에러 발생 시 navigate 되기 전 잠시 표시될 수 있는 UI */}
            {createError && (
              <div className="space-y-4">
                <p className="text-red-600">오류가 발생하여 이전 페이지로 돌아갑니다.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
