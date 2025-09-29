'use client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; // useQuery 도입
import { getJobRecommendationsList } from '@/api/jobs'; //실제 API함수 호출
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/layout/pagination';
import { Eye, Loader2 } from 'lucide-react'; // 로딩아이콘

export default function HistoryPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  // React Query를 사용하여 API 데이터 호출
  const { data, isLoading } = useQuery({
    // 페이지가 바뀔 때마다 쿼리를 다시 실행하도록 queryKey에 currentPage를 포함
    queryKey: ['jobRecommendations', currentPage],
    // API는 페이지를 0부터 계산하므로, UI의 페이지 번호에서 1을 빼서 전달
    queryFn: () => getJobRecommendationsList(currentPage - 1, 10), // 페이지당 10개씩
    enabled: isAuthenticated, // 로그인 상태일 때만 쿼리 활성화
    placeholderData: (previousData) => previousData, // 새 데이터 로딩 중 이전 데이터 유지
  });
  const history = data?.content || [];
  const paginationInfo = data
    ? {
        currentPage: data.pageable.pageNumber + 1,
        totalPages: data.totalPages,
        totalItems: data.totalElements,
        itemsPerPage: data.pageable.pageSize,
      }
    : null;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // 올바른 상세 페이지 경로로 이동
  const viewDetail = (recommendationId: number) => {
    navigate(`/results/detail/${recommendationId}`);
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <Card className="bg-white shadow">
          <CardContent className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">진로 추천 기록</h1>
              {paginationInfo && (
                <div className="text-sm text-gray-600">총 {paginationInfo.totalItems}개</div>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                <p className="text-gray-600 mt-4">기록을 불러오는 중...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">아직 추천 기록이 없습니다.</p>
                <Button onClick={() => navigate('/career-form')} className="bg-blue-600">
                  진로 탐색하러 가기
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {history.map((item) => (
                    <div
                      key={item.recommendationId}
                      className="border rounded-lg p-4 sm:p-6 flex justify-between items-center hover:shadow-md transition-shadow"
                    >
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{item.jobName}</h3>
                        {/* ❗ 4. API 응답 타입에 맞춰 createdDate 사용 */}
                        <p className="text-sm text-gray-500 mt-1">
                          추천일: {new Date(item.createdDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        onClick={() => viewDetail(item.recommendationId)}
                        size="sm"
                        variant="outline"
                        className="text-blue-600"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        결과 보기
                      </Button>
                    </div>
                  ))}
                </div>

                {paginationInfo && paginationInfo.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={paginationInfo.currentPage}
                      totalPages={paginationInfo.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
