'use client';

import SiteHeader from '@/components/site-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/pagination';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { isLoggedIn } from '@/lib/auth-client';
import { Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HistorySession {
  id: string;
  date: string;
  careers: Array<{
    id: string;
    name: string;
    image: string;
  }>;
  confirmedCareerId?: string | null;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchHistory = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/history?page=${page}&limit=10`);
      const result = await response.json();
      setHistory(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
      return;
    }
    fetchHistory(currentPage);
  }, [router, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const viewSavedResults = (sessionId: string) => {
    router.push(`/results/saved/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <Card className="bg-white shadow">
          <CardContent className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">진로 추천 기록</h1>
              {pagination && (
                <div className="text-sm text-gray-600">
                  총 {pagination.totalItems}개 중{' '}
                  {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-
                  {Math.min(
                    pagination.currentPage * pagination.itemsPerPage,
                    pagination.totalItems,
                  )}
                  개
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">로딩 중...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">아직 추천 기록이 없습니다.</p>
                <Button
                  onClick={() => router.push('/career-form')}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  진로 탐색하러 가기
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {history.map((h) => (
                    <div
                      key={h.id}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-gray-500">
                          {new Date(h.date).toLocaleString()}
                        </div>
                        <Button
                          onClick={() => viewSavedResults(h.id)}
                          size="sm"
                          variant="outline"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          결과 보기
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {h.careers.slice(0, 3).map((c) => (
                          <div
                            key={c.id}
                            onClick={() => viewSavedResults(h.id)}
                            className="relative bg-white rounded-lg border shadow-sm hover:shadow transition p-3 cursor-pointer hover:border-blue-300"
                          >
                            <div className="relative w-full h-24 rounded overflow-hidden">
                              <Image
                                src={
                                  c.image ||
                                  '/placeholder.svg?height=96&width=192&query=career%20thumb'
                                }
                                alt={c.name}
                                fill
                                className="object-cover"
                              />
                              {h.confirmedCareerId === c.id && (
                                <div className="absolute top-1 right-1 bg-yellow-400 rounded-full p-1">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="mt-2 font-medium text-sm">{c.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
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
