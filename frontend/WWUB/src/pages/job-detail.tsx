import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SiteHeader from '../components/layout/site-header';
import { useJobRecommendationDetail } from '../hooks/useJobRecommendation';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: jobDetail, isLoading, error } = useJobRecommendationDetail(Number(id));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-purple-50">
        <SiteHeader />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">직업 정보를 불러오는 중...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !jobDetail?.data) {
    return (
      <div className="min-h-screen bg-purple-50">
        <SiteHeader />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <Card className="bg-white shadow-xl">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                직업 정보를 찾을 수 없습니다
              </h1>
              <Button onClick={() => navigate('/results')}>목록으로 돌아가기</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const job = jobDetail.data;

  return (
    <div className="min-h-screen bg-purple-50">
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <Card className="bg-white shadow-xl">
          <CardContent className="p-8">
            <div className="mb-6">
              <Button onClick={() => navigate('/results')} variant="outline" className="mb-4">
                ← 목록으로 돌아가기
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.jobName}</h1>
              <p className="text-gray-600">
                추천일: {new Date(job.recommendedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">직업 요약</h3>
                <p className="text-blue-800">{job.jobSummary}</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-2">추천 이유</h3>
                <p className="text-green-800">{job.reason}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">관련 전공</h3>
                  <p className="text-purple-800">{job.relatedMajors}</p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-900 mb-2">관련 자격증</h3>
                  <p className="text-orange-800">{job.relatedCertificates}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">급여 정보</h3>
                  <p className="text-yellow-800">{job.salary}</p>
                </div>

                <div className="bg-indigo-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-2">직업 전망</h3>
                  <p className="text-indigo-800">{job.prospect}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">필요 지식</h3>
                <p className="text-gray-800">{job.requiredKnowledge}</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">진로 경로</h3>
                <p className="text-gray-800">{job.careerPath}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-teal-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-teal-900 mb-2">근무 환경</h3>
                  <p className="text-teal-800">{job.environment}</p>
                </div>

                <div className="bg-pink-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-pink-900 mb-2">직업 가치관</h3>
                  <p className="text-pink-800">{job.jobValues}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="space-x-4">
                <Button onClick={() => navigate('/results')} variant="outline">
                  다른 추천 보기
                </Button>
                <Button onClick={() => navigate('/career-form')}>새로운 추천 받기</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
