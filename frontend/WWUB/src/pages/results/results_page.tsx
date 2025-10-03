import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ❗ useLocation 추가
import { useQueryClient } from '@tanstack/react-query'; // ❗ queryClient 훅 import
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import type { JobRecommendationDetail } from '../../types/job.types'; // ❗ API 타입을 직접 사용
import type { UserProfile } from '../../types/user.types';
import { Trash2 } from 'lucide-react'; // ❗ 삭제 아이콘 import
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'; // ❗ 확인 팝업 컴포넌트 import
import { useJobRecommendation } from '../../hooks/useJobRecommendation'; // ❗ 삭제 함수를 사용하기 위해 훅 import

export default function ResultsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // ❗ queryClient 인스턴스 가져오기
  const { user } = useAuth();
  const { delete: deleteRecommendation, isDeleting } = useJobRecommendation(); // ❗  훅에서 delete 함수와 로딩 상태 가져오기

  const [recommendations, setRecommendations] = useState<JobRecommendationDetail[]>([]);
  const [selected, setSelected] = useState<number | null>(0);
  const [flip, setFlip] = useState<Record<number, boolean>>({});
  const [itemToDelete, setItemToDelete] = useState<number | null>(null); // ❗ 5. 삭제할 아이템 ID를 저장할 상태

  // ❗ 데이터가 없으면 career-form으로 보내는 로직
  useEffect(() => {
    // ❗location.state 대신 React Query 캐시에서 직접 데이터를 가져옵니다.
    const cachedData: JobRecommendationDetail[] | undefined = queryClient.getQueryData([
      'recommendationResult',
    ]);
    if (cachedData && cachedData.length > 0) {
      setRecommendations(cachedData);
    } else {
      // 데이터가 없으면 즉시 form 페이지로 이동
      alert('추천 결과가 없습니다. 다시 시도해주세요.');
      navigate('/career-form');
    }
  }, [queryClient, navigate]);

  const handleCardClick = (idx: number) => {
    setSelected(idx);
    setFlip((f) => ({ ...f, [idx]: !f[idx] }));
  };
  // ❗ 삭제 확인 및 실행 함수
  const handleConfirmDelete = () => {
    if (itemToDelete === null) return;

    deleteRecommendation(itemToDelete, {
      onSuccess: () => {
        // 성공 시, 현재 화면의 목록(state)과 캐시에서 해당 아이템을 제거하여 즉시 반영
        const updatedRecs = recommendations.filter((r) => r.recommendationId !== itemToDelete);
        setRecommendations(updatedRecs);
        queryClient.setQueryData(['recommendationResult'], updatedRecs);
        setItemToDelete(null); // 삭제 상태 초기화
      },
      onError: (error: Error) => {
        alert(`삭제 중 오류가 발생했습니다: ${error.message}`);
        setItemToDelete(null);
      },
    });
  };
  const selectedCareer = useMemo(
    // 👇 recommendations가 존재하는지(&&) 먼저 확인하는 조건을 추가합니다.
    () => (selected != null && recommendations.length > 0 ? recommendations[selected] : null),
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
                <FlipCard
                  career={c}
                  flipped={!!flip[idx]}
                  user={user}
                  onCardClick={() => handleCardClick(idx)}
                  onDeleteClick={() => setItemToDelete(c.recommendationId)}
                />
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
        {/* ❗ 8. 삭제 확인 팝업(AlertDialog) */}
        <AlertDialog open={itemToDelete !== null} onOpenChange={() => setItemToDelete(null)}>
          <AlertDialogContent className="bg-white shadow-lg rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                이 추천 기록은 영구적으로 삭제되며, 복구할 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting}>
                {isDeleting ? '삭제 중...' : '삭제'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}

function FlipCard({
  career,
  flipped,
  user,
  onCardClick,
  onDeleteClick,
}: {
  career: JobRecommendationDetail;
  flipped: boolean;
  user?: UserProfile;
  onCardClick: () => void;
  onDeleteClick: () => void;
}) {
  return (
    <div className="group [perspective:1000px] cursor-pointer" onClick={onCardClick}>
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
          {/* ❗ 10. 삭제 버튼 추가 */}
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // 카드 전체가 클릭되는 것을 방지
              onDeleteClick();
            }}
            className="w-full bg-red-600 text-white hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />이 추천 삭제하기
          </Button>
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
