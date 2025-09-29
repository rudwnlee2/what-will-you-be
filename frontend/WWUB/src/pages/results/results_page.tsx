'use client';

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ❗ useLocation 추가
import { useQueryClient } from '@tanstack/react-query'; // ❗ queryClient 훅 import
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import type { JobRecommendationDetail } from '../../types/job.types'; // ❗ API 타입을 직접 사용
import type { UserProfile } from '../../types/user.types';

export default function ResultsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // ❗ queryClient 인스턴스 가져오기
  const { user } = useAuth();

  // ❗ 1. location.state 대신 React Query 캐시에서 직접 데이터를 가져옵니다.
  const recommendations: JobRecommendationDetail[] | undefined = queryClient.getQueryData([
    'recommendationResult',
  ]);

  const [selected, setSelected] = useState<number | null>(0);
  const [flip, setFlip] = useState<Record<number, boolean>>({});

  // ❗ 데이터가 없으면 career-form으로 보내는 로직
  useEffect(() => {
    if (!recommendations || recommendations.length === 0) {
      alert('추천 결과가 없습니다. 다시 시도해주세요.');
      navigate('/career-form');
    }
  }, [recommendations, navigate]);

  const handleCardClick = (idx: number) => {
    setSelected(idx);
    setFlip((f) => ({ ...f, [idx]: !f[idx] }));
  };

  const selectedCareer = useMemo(
    // 👇 recommendations가 존재하는지(&&) 먼저 확인하는 조건을 추가합니다.
    () => (selected != null && recommendations ? recommendations[selected] : null),
    [selected, recommendations],
  );
  return (
    <div className="min-h-screen bg-purple-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="text-3xl font-bold text-gray-900">당신에게 추천하는 직업</h1>
        <p className="text-gray-600 mb-8">
          아래 카드 중 하나를 선택해 더 자세한 내용을 확인하세요.
        </p>

        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          {recommendations?.map((c, idx) => {
            const isSelected = selected === idx;
            return (
              <div
                key={c.recommendationId}
                className={`flex-1 transition-all duration-300 ${isSelected ? 'md:flex-[2] scale-[1.02]' : 'md:flex-[1] opacity-90'} ${selected != null && !isSelected ? 'md:opacity-60' : ''}`}
                onClick={() => handleCardClick(idx)}
              >
                <FlipCard career={c} flipped={!!flip[idx]} user={user} />
              </div>
            );
          })}
        </div>

        {selectedCareer && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => navigate(`/results/detail/${selectedCareer.recommendationId}`)}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              자세히 보기
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

function FlipCard({
  career,
  flipped,
  user,
}: {
  career: JobRecommendationDetail;
  flipped: boolean;
  user?: UserProfile;
}) {
  return (
    <div className="group [perspective:1000px] cursor-pointer">
      <div
        className={`relative h-[360px] w-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* Front: 이미지 + 직업명 */}
        <Card className="absolute inset-0 bg-white rounded-xl shadow-md p-4 flex flex-col justify-between [backface-visibility:hidden] hover:shadow-lg transition">
          <div className="relative h-48 w-full overflow-hidden rounded-lg">
            <img
              src={career.jobName || '/placeholder.svg'}
              alt={career.jobName}
              className="w-full h-full object-cover"
            />
            {user?.name && (
              <div className="absolute bottom-3 right-3 h-10 w-10 rounded-full ring-2 ring-white bg-blue-500 flex items-center justify-center text-white font-semibold shadow">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="text-xl font-bold">{career.jobName}</h3>
          </div>
        </Card>

        {/* Back: 직업명 + 추천 이유 */}
        <Card className="absolute inset-0 bg-white rounded-xl shadow-md p-5 overflow-auto [backface-visibility:hidden] [transform:rotateY(180deg)] hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">{career.jobName}</h3>
          <p className="text-gray-700 leading-relaxed">
            <b>추천 이유:</b> {career.reason}
          </p>
          {user?.name && (
            <div className="absolute bottom-3 right-3 h-10 w-10 rounded-full ring-2 ring-white bg-blue-500 flex items-center justify-center text-white font-semibold shadow">
              {user.name.charAt(0)}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
