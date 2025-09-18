'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getProfile, getHistory, deleteHistorySession } from '@/api/profile';
import {
  addMission,
  hasActiveMissionForCareer,
  updateMissionStatus,
  deleteMission,
  type Mission,
} from '@/api/mission';
import { AlertCircle, Trash2, CheckCircle } from 'lucide-react';

type Career = {
  id: string;
  name: string;
  image: string;
  reason: string;
  role: string;
  howTo: string;
  majors: string[];
  certificates: string[];
  salary: string;
  outlook: string;
  knowledge: string[];
  environment: string;
  values: string[];
  satisfaction: string;
  labor: string;
  skills: string[];
};

export default function SavedResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>([]);
  const [current, setCurrent] = useState<Career | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [isGeneratingMission, setIsGeneratingMission] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteResultConfirm, setShowDeleteResultConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const sessionId = params.id as string;
  const guarded = useRef(false);

  useEffect(() => {
    const fetchSavedResults = async () => {
      try {
        // First try to get from history (localStorage)
        const history = getHistory();
        const session = history.find((h) => h.id === sessionId);

        if (session) {
          // Use saved session data
          setCareers(session.careers as Career[]);
          setCurrent((session.careers[0] as Career) || null);
        } else {
          // Try to fetch from backend
          const response = await fetch(`/api/results/${sessionId}`);
          const data = await response.json();

          if (data.success && data.result) {
            setCareers(data.result.careers || []);
            setCurrent(data.result.careers[0] || null);
          } else {
            if (!guarded.current) {
              guarded.current = true;
              router.replace('/me');
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch saved results:', error);
        if (!guarded.current) {
          guarded.current = true;
          router.replace('/me');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSavedResults();
  }, [sessionId, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await getProfile();
      setProfile(profileData);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (current) {
      const missions = JSON.parse(localStorage.getItem('userMissions') || '[]');
      const activeMission = missions.find(
        (m: Mission) => m.careerId === current.id && m.status === 'progress',
      );
      setCurrentMission(activeMission || null);
    }
  }, [current]);

  const otherCareers = useMemo(
    () => careers.filter((c) => c.id !== current?.id),
    [careers, current],
  );

  const generateMission = async () => {
    if (!current || hasActiveMissionForCareer(current.id)) return;

    setIsGeneratingMission(true);
    try {
      const response = await fetch('/api/missions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerName: current.name,
          careerDetails: current.role,
        }),
      });

      const data = await response.json();
      if (data.success) {
        const newMission = addMission({
          careerId: current.id,
          careerName: current.name,
          title: data.mission.title,
          content: data.mission.content,
        });
        setCurrentMission(newMission);
      }
    } catch (error) {
      console.error('Failed to generate mission:', error);
    } finally {
      setIsGeneratingMission(false);
    }
  };

  const completeMission = () => {
    if (!currentMission) return;
    updateMissionStatus(currentMission.id, 'completed');
    setCurrentMission({
      ...currentMission,
      status: 'completed',
      completedAt: new Date().toISOString(),
    });
  };

  const handleDeleteMission = () => {
    if (!currentMission) return;
    deleteMission(currentMission.id);
    setCurrentMission(null);
    setShowDeleteConfirm(false);
  };

  const handleDeleteResult = () => {
    const success = deleteHistorySession(sessionId);
    if (success) {
      setShowDeleteResultConfirm(false);
      router.push('/history');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-50">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="text-center">
            <p className="text-gray-600">저장된 결과를 불러오는 중...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="min-h-screen bg-purple-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={() => router.push('/history')} variant="outline" size="sm">
              ← 추천 기록으로 돌아가기
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">저장된 추천 결과</h1>
              <p className="text-gray-600">이전에 받았던 직업 추천 결과를 다시 확인하세요.</p>
            </div>
          </div>
          <Button onClick={() => setShowDeleteResultConfirm(true)} variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-1" />
            추천 결과 삭제
          </Button>
        </div>

        <div className="grid md:grid-cols-[260px_1fr] gap-6">
          {/* Left: other careers */}
          <aside className="space-y-3">
            {otherCareers.map((c) => (
              <button
                key={c.id}
                onClick={() => setCurrent(c)}
                className="w-full bg-white rounded-lg shadow hover:shadow-md transition p-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-12 rounded overflow-hidden">
                    <Image
                      src={c.image || '/placeholder.svg?height=96&width=192&query=career%20thumb'}
                      alt={c.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{c.name}</div>
                </div>
              </button>
            ))}
          </aside>

          {/* Right: main detail */}
          <section>
            <Card className="bg-white rounded-xl shadow p-6 sm:p-8 relative">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={
                      current.image || '/placeholder.svg?height=256&width=512&query=career%20image'
                    }
                    alt={current.name}
                    fill
                    className="object-cover"
                  />
                  {profile?.avatarDataUrl && (
                    <div className="absolute bottom-0 right-0 p-2">
                      <Image
                        src={profile.avatarDataUrl || '/placeholder.svg'}
                        alt="Profile Avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">{current.name}</h2>
                  <p className="text-gray-600 mb-4">{current.reason}</p>
                  <div className="space-y-2 text-gray-800 text-sm">
                    <p>
                      <b>추천 이유:</b> {current.reason}
                    </p>
                    <p>
                      <b>직업이 하는 일:</b> {current.role}
                    </p>
                    <p>
                      <b>직업이 되는 법:</b> {current.howTo}
                    </p>
                    <p>
                      <b>관련 전공 리스트:</b> {current.majors?.join(', ') || '정보 없음'}
                    </p>
                    <p>
                      <b>관련 자격증:</b> {current.certificates?.join(', ') || '정보 없음'}
                    </p>
                    <p>
                      <b>임금 정보:</b> {current.salary || '정보 없음'}
                    </p>
                    <p>
                      <b>직업 전망:</b> {current.outlook || '정보 없음'}
                    </p>
                    <p>
                      <b>필요 지식 영역:</b> {current.knowledge?.join(', ') || '정보 없음'}
                    </p>
                    <p>
                      <b>근무 환경:</b> {current.environment || '정보 없음'}
                    </p>
                    <p>
                      <b>직업 가치관:</b> {current.values?.join(', ') || '정보 없음'}
                    </p>
                    <p>
                      <b>직업 만족도:</b> {current.satisfaction || '정보 없음'}
                    </p>
                    <p>
                      <b>일자리 현황:</b> {current.labor || '정보 없음'}
                    </p>
                    <p>
                      <b>업무 수행 능력:</b> {current.skills?.join(', ') || '정보 없음'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">미션</h3>
                  <Button
                    onClick={generateMission}
                    disabled={isGeneratingMission || hasActiveMissionForCareer(current.id)}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isGeneratingMission ? '미션 생성 중...' : '미션 받기'}
                  </Button>
                </div>

                {hasActiveMissionForCareer(current.id) && !currentMission && (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg mb-4">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">미션을 완료한 후 다시 시도해 주세요.</span>
                  </div>
                )}

                {currentMission ? (
                  <Card className="bg-gray-50 p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-lg">{currentMission.title}</h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          currentMission.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {currentMission.status === 'completed' ? '완료' : '진행 중'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{currentMission.content}</p>
                    <div className="text-sm text-gray-500 mb-4">
                      생성일: {new Date(currentMission.createdAt).toLocaleDateString()}
                      {currentMission.completedAt && (
                        <span className="ml-4">
                          완료일: {new Date(currentMission.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {currentMission.status === 'progress' && (
                        <Button
                          onClick={completeMission}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          완료
                        </Button>
                      )}
                      <Button
                        onClick={() => setShowDeleteConfirm(true)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        삭제
                      </Button>
                    </div>
                  </Card>
                ) : (
                  !hasActiveMissionForCareer(current.id) && (
                    <p className="text-gray-500 text-sm">아직 생성된 미션이 없습니다.</p>
                  )
                )}
              </div>
            </Card>
          </section>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-white p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold mb-4">미션 삭제</h3>
              <p className="text-gray-600 mb-6">정말로 이 미션을 삭제하시겠습니까?</p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  아니오
                </Button>
                <Button variant="destructive" onClick={handleDeleteMission}>
                  예
                </Button>
              </div>
            </Card>
          </div>
        )}

        {showDeleteResultConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-white p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold mb-4">추천 결과 삭제</h3>
              <p className="text-gray-600 mb-6">정말로 이 추천 결과를 삭제하시겠습니까?</p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowDeleteResultConfirm(false)}>
                  아니오
                </Button>
                <Button variant="destructive" onClick={handleDeleteResult}>
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
