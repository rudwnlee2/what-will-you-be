'use client';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobRecommendation } from '../../hooks/useJobRecommendation'; // 직업 추천 훅

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
export default function LoadingPage() {
  const navigate = useNavigate();
  // ❗ useJobRecommendation 훅을 사용하여 API 호출 상태를 관리합니다.
  const { createRecommendations, isCreating, createError } = useJobRecommendation();

  useEffect(() => {
    // 페이지가 로드될 때 직업 추천 생성을 바로 시작합니다.
    createRecommendations(undefined, {
      onSuccess: (data) => {
        // 성공 시, 결과 데이터를 state에 담아 results 페이지로 이동합니다.
        navigate('/results', { state: { recommendations: data } });
      },
      // onError는 훅 자체에서 처리하므로 여기서는 비워둡니다.
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 에러 발생 시 재시도하는 함수
  const handleRetry = () => {
    createRecommendations(undefined, {
      onSuccess: () => {
        navigate('/results');
      },
    });
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <Card className="bg-white shadow-xl">
          <CardContent className="p-8 sm:p-10 text-center space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {isCreating && '당신에게 맞는 직업을 찾고 있어요...'}
              {createError && '오류가 발생했습니다'}
            </h1>
            <p className="text-gray-600">
              {isCreating && 'AI가 입력하신 정보를 분석하고 있습니다. 잠시만 기다려주세요.'}
              {createError && '추천 결과를 불러오는 데 실패했습니다.'}
            </p>

            {isCreating && (
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
