'use client';

import SiteHeader from '@/components/site-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useState } from 'react';
import {
  getAllMissionsWithType,
  updateMissionStatus,
  updateFriendMissionStatus,
  deleteMission,
  deleteFriendMission,
  type AllMissionTypes,
} from '@/api/mission';
import { isLoggedIn } from '@/api/auth';
import { CheckCircle, Trash2, Users, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MissionsPage() {
  const router = useRouter();
  const [missions, setMissions] = useState<AllMissionTypes[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedMissionType, setSelectedMissionType] = useState<'individual' | 'friend'>(
    'individual',
  );
  const [selectedStatusTab, setSelectedStatusTab] = useState<'progress' | 'completed'>('progress');

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
      return;
    }
    setMissions(getAllMissionsWithType());
  }, [router]);

  const completeMission = (mission: AllMissionTypes) => {
    if (mission.type === 'individual') {
      updateMissionStatus(mission.id, 'completed');
    } else {
      updateFriendMissionStatus(mission.id, 'completed');
    }
    setMissions(getAllMissionsWithType());
  };

  const handleDeleteMission = (mission: AllMissionTypes) => {
    if (mission.type === 'individual') {
      deleteMission(mission.id);
    } else {
      deleteFriendMission(mission.id);
    }
    setMissions(getAllMissionsWithType());
    setShowDeleteConfirm(null);
  };

  const filteredMissions = useMemo(() => {
    return missions.filter(
      (mission) => mission.type === selectedMissionType && mission.status === selectedStatusTab,
    );
  }, [missions, selectedMissionType, selectedStatusTab]);

  const missionToDelete = missions.find((m) => m.id === showDeleteConfirm);

  return (
    <div className="min-h-screen bg-purple-50">
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <Card className="bg-white shadow">
          <CardContent className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold mb-6">미션 목록</h1>

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

            {filteredMissions.length === 0 ? (
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
              <div className="space-y-4">
                {filteredMissions.map((mission) => (
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
                            onClick={() => completeMission(mission)}
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
                <Button variant="destructive" onClick={() => handleDeleteMission(missionToDelete)}>
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
