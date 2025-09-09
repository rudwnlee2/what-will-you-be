'use client';

import SiteHeader from '@/components/layout/site-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/layout/pagination';
import { useEffect, useState } from 'react';
import { CheckCircle, Trash2, Users, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface Mission {
  id: string;
  type: 'individual' | 'friend';
  careerName: string;
  title: string;
  content: string;
  status: 'progress' | 'completed';
  createdAt: string;
  completedAt?: string | null;
  friendName?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function MissionsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedMissionType, setSelectedMissionType] = useState<'individual' | 'friend'>(
    'individual',
  );
  const [selectedStatusTab, setSelectedStatusTab] = useState<'progress' | 'completed'>('progress');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMissions = async (page: number, type: string, status: string) => {
    setLoading(true);
    // Mock data for now
    setTimeout(() => {
      setMissions([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false
      });
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setCurrentPage(1); // Reset to first page when filters change
    fetchMissions(1, selectedMissionType, selectedStatusTab);
  }, [navigate, selectedMissionType, selectedStatusTab, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMissions(currentPage, selectedMissionType, selectedStatusTab);
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const completeMission = async (missionId: string) => {
    // TODO: Implement API call to complete mission
    console.log('Complete mission:', missionId);
    // Refresh data after completion
    fetchMissions(currentPage, selectedMissionType, selectedStatusTab);
  };

  const handleDeleteMission = async (missionId: string) => {
    // TODO: Implement API call to delete mission
    console.log('Delete mission:', missionId);
    setShowDeleteConfirm(null);
    // Refresh data after deletion
    fetchMissions(currentPage, selectedMissionType, selectedStatusTab);
  };

  const missionToDelete = missions.find((m) => m.id === showDeleteConfirm);

  return (
    <div className="min-h-screen bg-purple-50">
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <Card className="bg-white shadow">
          <CardContent className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">미션 목록</h1>
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

            {/* Mission Type Tabs */}
            <div className="flex gap-2 mb-4">
              <Button
                onClick={() => setSelectedMissionType('individual')}
                variant={selectedMissionType === 'individual' ? 'default' : 'outline'}
                className={
                  selectedMissionType === 'individual' ? 'bg-blue-600 hover:bg-blue-700' : ''
                }
              >
                <User className="w-4 h-4 mr-2" />
                개인 미션
              </Button>
              <Button
                onClick={() => setSelectedMissionType('friend')}
                variant={selectedMissionType === 'friend' ? 'default' : 'outline'}
                className={
                  selectedMissionType === 'friend' ? 'bg-purple-600 hover:bg-purple-700' : ''
                }
              >
                <Users className="w-4 h-4 mr-2" />
                친구와 함께 미션
              </Button>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 mb-6">
              <Button
                onClick={() => setSelectedStatusTab('progress')}
                variant={selectedStatusTab === 'progress' ? 'default' : 'outline'}
                className={
                  selectedStatusTab === 'progress' ? 'bg-orange-600 hover:bg-orange-700' : ''
                }
              >
                진행중
              </Button>
              <Button
                onClick={() => setSelectedStatusTab('completed')}
                variant={selectedStatusTab === 'completed' ? 'default' : 'outline'}
                className={
                  selectedStatusTab === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''
                }
              >
                완료
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">로딩 중...</p>
              </div>
            ) : missions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  {selectedMissionType === 'individual'
                    ? selectedStatusTab === 'progress'
                      ? '진행중인 개인 미션이 없습니다.'
                      : '완료된 개인 미션이 없습니다.'
                    : selectedStatusTab === 'progress'
                      ? '진행중인 친구 미션이 없습니다.'
                      : '완료된 친구 미션이 없습니다.'}
                </p>
                {selectedStatusTab === 'progress' && (
                  <div className="space-y-2">
                    {selectedMissionType === 'individual' ? (
                      <Link href="/results">
                        <Button className="bg-blue-600 text-white hover:bg-blue-700">
                          추천 결과에서 미션 받기
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/friends">
                        <Button className="bg-purple-600 text-white hover:bg-purple-700">
                          친구와 함께 미션 만들기
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {missions.map((mission) => (
                    <Card key={mission.id} className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-sm text-gray-600">{mission.careerName}</div>
                              {mission.type === 'friend' && (
                                <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                                  <Users className="w-3 h-3" />
                                  {mission.friendName}
                                </div>
                              )}
                            </div>
                            <h4 className="font-semibold text-lg">{mission.title}</h4>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              mission.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {mission.status === 'completed' ? '완료' : '진행 중'}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4">{mission.content}</p>
                        <div className="text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-4">
                            <span>생성일: {new Date(mission.createdAt).toLocaleDateString()}</span>
                            {mission.completedAt && (
                              <span>
                                완료일: {new Date(mission.completedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {mission.status === 'progress' && (
                            <Button
                              onClick={() => completeMission(mission.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              완료
                            </Button>
                          )}
                          <Button
                            onClick={() => setShowDeleteConfirm(mission.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            삭제
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
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

        {showDeleteConfirm && missionToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-white p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold mb-4">미션 삭제</h3>
              <p className="text-gray-600 mb-6">정말로 삭제하시겠습니까?</p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
                  아니오
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteMission(missionToDelete.id)}
                >
                  예
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
