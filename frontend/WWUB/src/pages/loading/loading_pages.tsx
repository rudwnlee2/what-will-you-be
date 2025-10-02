import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobRecommendation } from '../../hooks/useJobRecommendation'; // 직업 추천 훅

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
export default function LoadingPage() {
  const navigate = useNavigate();
  // ❗ useJobRecommendation 훅을 사용하여 API 호출 상태를 관리합니다.
  const { createRecommendations, isCreating, createError } = useJobRecommendation();
  const effectRan = useRef(false); // effect 실행 여부를 추적할 ref 생성

  // ❗ API 호출 로직을 재사용할 수 있도록 별도 함수로 분리
  const runRecommendation = () => {
    createRecommendations(undefined, {
      onSuccess: () => {
        navigate('/results');
      },
      // 👇 1. onError 콜백을 추가합니다.
      onError: (error: Error) => {
        // 콘솔에 에러를 기록하여 개발자가 쉽게 확인할 수 있게 합니다.
        console.error('직업 추천 생성 실패:', error);
        // UI는 createError 상태에 따라 자동으로 업데이트됩니다.
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

  // 에러 발생 시 재시도하는 함수
  const handleRetry = () => {
    runRecommendation(); // 동일한 함수 재사용
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <Card className="bg-white shadow-xl">
          <CardContent className="p-8 sm:p-10 text-center space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {/* 👇 로딩 중일 때만 로딩 메시지가 보이도록 isCreating && 제거 */}
              {createError ? '오류가 발생했습니다' : '당신에게 맞는 직업을 찾고 있어요...'}
            </h1>
            <p className="text-gray-600">
              {createError
                ? '추천 결과를 불러오는 데 실패했습니다.'
                : 'AI가 입력하신 정보를 분석하고 있습니다. 잠시만 기다려주세요.'}
            </p>

            {/* 👇 isCreating이 true이고, createError가 없을 때만 스피너를 보여줍니다. */}
            {isCreating && !createError && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              </div>
            )}

            {createError && (
              <div className="space-y-4">
                <p className="text-red-600">{createError.message}</p>
                <Button onClick={handleRetry} className="bg-blue-600 text-white hover:bg-blue-700">
                  다시 시도하기
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
