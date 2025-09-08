import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SiteHeader from '../components/layout/site-header';
import { useJobRecommendation } from '../hooks/useJobRecommendation';
import { useAuth } from '../hooks/useAuth';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { recommendationsList, isListLoading, listError } = useJobRecommendation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (isListLoading) {
    return (
      <div className="min-h-screen bg-purple-50">
        <SiteHeader />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">추천 결과를 불러오는 중...</p>
          </div>
        </main>
      </div>
    );
  }

  if (listError || !recommendationsList || recommendationsList.length === 0) {
    return (
      <div className="min-h-screen bg-purple-50">
        <SiteHeader />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <Card className="bg-white shadow-xl">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                추천 결과를 찾을 수 없습니다
              </h1>
              <p className="text-gray-600 mb-6">먼저 진로 탐색 폼을 작성해주세요.</p>
              <Button
                onClick={() => navigate('/career-form')}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                진로 탐색하기
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50">
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <Card className="bg-white shadow-xl">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              나에게 추천하는 직업
            </h1>

            <div className="grid gap-6">
              {recommendationsList.map((job) => (
                <Card
                  key={job.recommendationId}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/job-detail/${job.recommendationId}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.jobName}</h3>
                      <p className="text-gray-600 text-sm">
                        추천일: {new Date(job.recommendedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      상세보기
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                더 정확한 추천을 위해 정보를 업데이트하거나 새로운 분석을 받아보세요.
              </p>
              <div className="space-x-4">
                <Button onClick={() => navigate('/career-form')} variant="outline">
                  새로운 추천 받기
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  홈으로 돌아가기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
