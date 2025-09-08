'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SiteHeader from '@/components/layout/site-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function LoadingRecommendationPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(true);

  const run = async () => {
    setError(null);
    setIsRunning(true);
    const raw = sessionStorage.getItem('careerForm');
    if (!raw) {
      router.replace('/career-form');
      return;
    }
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: raw,
      });
      if (!res.ok) throw new Error('네트워크 문제로 추천 결과를 불러오지 못했습니다.');
      const data = await res.json();
      sessionStorage.setItem('recommendationResult', JSON.stringify(data));
      router.replace('/results');
    } catch (e: any) {
      setError(e.message ?? '네트워크 문제로 추천 결과를 불러오지 못했습니다.');
      setIsRunning(false);
    }
  };

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-purple-50">
      <SiteHeader />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <Card className="bg-white shadow-xl">
          <CardContent className="p-8 sm:p-10 text-center space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              당신에게 맞는 직업을 찾고 있어요...
            </h1>
            <p className="text-gray-600">
              AI가 입력하신 정보를 분석하고 있습니다. 잠시만 기다려주세요.
            </p>

            {isRunning && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              </div>
            )}

            {error && (
              <div className="space-y-4">
                <p className="text-red-600">{error}</p>
                <Button onClick={run} className="bg-blue-600 text-white hover:bg-blue-700">
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
