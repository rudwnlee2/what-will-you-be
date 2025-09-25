import type React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

import {
  useGetRecommendationInfo,
  useUpdateRecommendationInfo,
} from '../../hooks/useRecommendation';
import type { RecommendationInfoRequest, MBTI, Holland, JobValue } from '../../types/api';
import {
  JOB_VALUE_OPTIONS,
  MBTI_OPTIONS,
  HOLLAND_OPTIONS,
  SUBJECT_OPTIONS,
} from '../../constants/options'; // 옵션 데이터 import
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // ❗ 이 줄을 추가하세요.

export default function MyInfoPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // ❗ 2. React Query 훅으로 데이터 로딩 및 저장 처리
  const { data: initialData, isLoading: isInfoLoading } = useGetRecommendationInfo();
  const { mutate: updateRecommendation, isPending: isUpdating } = useUpdateRecommendationInfo();

  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // ❗ 3. form 상태 이름을 API 타입과 일치시킴
  const [form, setForm] = useState({
    dream: '',
    dreamReason: '',
    interest: '',
    mbti: '' as MBTI | '',
    holland: '' as Holland | '',
    favoriteSubject: '', // UI용 배열 상태
    jobValue: '' as JobValue | '',
  });

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  // ❗ 4. 데이터 로딩 성공 시 form 상태 업데이트
  useEffect(() => {
    if (initialData) {
      setForm({
        dream: initialData.dream || '',
        dreamReason: initialData.dreamReason || '',
        interest: initialData.interest || '',
        mbti: initialData.mbti || '',
        holland: initialData.holland || '',
        // ❗ 2. 불러온 문자열을 배열로 변환하여 UI 상태에 저장
        favoriteSubject: initialData.favoriteSubject || '',
        jobValue: initialData.jobValue || '',
      });
    }
  }, [initialData]);

  // ❗ 3. 체크박스 핸들링 함수 추가

  const age = useMemo(() => {
    if (!user?.birth) return null;
    const today = new Date();
    const birth = new Date(user.birth);
    return today.getFullYear() - birth.getFullYear();
  }, [user?.birth]);

  // ❗ 4. 저장/제출 시 배열을 문자열로 변환하는 로직 추가
  const handleSaveOrSubmit = (onSuccessCallback: () => void) => {
    const requestData: RecommendationInfoRequest = {
      dream: form.dream,
      dreamReason: form.dreamReason,
      interest: form.interest,
      mbti: form.mbti as MBTI,
      holland: form.holland as Holland,
      hobby: form.interest, // API 명세에 따라 interest를 hobby로도 사용
      favoriteSubject: form.favoriteSubject, // 배열을 문자열로 변환
      jobValue: form.jobValue as JobValue,
    };
    updateRecommendation(requestData, {
      onSuccess: onSuccessCallback,
      onError: (error) => alert(`처리 중 오류 발생: ${error.message}`),
    });
  };
  // ❗ 5. 저장하기 함수를 실제 API 호출로 변경
  const saveForm = () => {
    handleSaveOrSubmit(() => {
      setSaveMessage('성공적으로 저장되었습니다!');
      setTimeout(() => setSaveMessage(null), 3000);
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveOrSubmit(() => navigate('/loading'));
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8">
        {/* Profile Section */}
        <Card className="bg-white shadow">
          <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="h-24 w-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{user?.name || '이름 미입력'}</h2>
                <Link to="/me/edit">
                  <Button variant="outline">내 정보 수정</Button>
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 mt-3 text-gray-700 text-sm">
                <div>아이디: {user?.loginId || '-'}</div>
                <div>이메일: {user?.email || '-'}</div>
                <div>
                  나이: {age ?? '-'}
                  {age !== null ? '세' : ''}
                </div>
                <div>
                  성별:{' '}
                  {user?.gender === 'MALE' ? '남성' : user?.gender === 'FEMALE' ? '여성' : '-'}
                </div>
                <div>학교: {user?.school || '-'}</div>
                <div>전화번호: {user?.phone || '-'}</div>
                <div>생년월일: {user?.birth || '-'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow">
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-xl font-semibold mb-4">진로 탐색 정보</h3>
            <p className="text-gray-600 mb-6">
              진로 추천에 필요한 정보를 수정하고 저장할 수 있습니다.
            </p>

            {saveMessage && (
              <div
                className={`mb-4 p-3 rounded-md ${
                  saveMessage.includes('오류')
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}
              >
                {saveMessage}
              </div>
            )}

            {isInfoLoading ? (
              <p className="text-gray-600">정보를 불러오는 중...</p>
            ) : (
              <form onSubmit={submit} className="space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="futureDream" className="font-semibold">
                      장래희망
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">당신의 목표를 자유롭게 적어주세요</p>
                  </div>
                  <div className="md:col-span-2">
                    <Textarea
                      id="futureDream"
                      placeholder="당신의 장래희망을 자유롭게 적어주세요"
                      rows={4}
                      value={form.dream}
                      onChange={(e) => setForm((p) => ({ ...p, dream: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="dreamReason" className="font-semibold">
                      장래희망을 선택한 이유
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">선택하신 이유를 알려주세요</p>
                  </div>
                  <div className="md:col-span-2">
                    <Textarea
                      id="dreamReason"
                      placeholder="왜 이 직업을 선택하셨나요?"
                      rows={4}
                      value={form.dreamReason}
                      onChange={(e) => setForm((p) => ({ ...p, dreamReason: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="interests" className="font-semibold">
                      관심사와 취미
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">관심 있는 활동, 즐겨하는 취미</p>
                  </div>
                  <div className="md:col-span-2">
                    <Textarea
                      id="interests"
                      placeholder="관심 있는 활동, 즐겨하는 취미를 자유롭게 입력해주세요"
                      rows={4}
                      value={form.interest}
                      onChange={(e) => setForm((p) => ({ ...p, interest: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="font-semibold">MBTI 유형</Label>
                    <Select
                      value={form.mbti}
                      onValueChange={(v) => setForm((p) => ({ ...p, mbti: v as MBTI }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="MBTI 유형을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {MBTI_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-semibold">홀란드 유형</Label>
                    <Select
                      value={form.holland}
                      onValueChange={(v) => setForm((p) => ({ ...p, holland: v as Holland }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="홀란드 유형을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {HOLLAND_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* ❗ 5. 좋아하는 과목 UI를 체크박스로 구현 */}
                <div>
                  <Label className="font-semibold">좋아하는 과목 (하나만 선택)</Label>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {SUBJECT_OPTIONS.map((subject) => (
                      <div key={subject} className="flex items-center space-x-2">
                        <RadioGroup
                          value={form.favoriteSubject}
                          onValueChange={(value) =>
                            setForm((p) => ({ ...p, favoriteSubject: value }))
                          }
                          className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3"
                        >
                          {SUBJECT_OPTIONS.map((subject) => (
                            <div key={subject} className="flex items-center space-x-2">
                              <RadioGroupItem value={subject} id={`me-${subject}`} />
                              <Label htmlFor={`me-${subject}`}>{subject}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <Label htmlFor={subject}>{subject}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="font-semibold">직업 가치관</Label>
                  <Select
                    value={form.jobValue}
                    onValueChange={(v) => setForm((p) => ({ ...p, jobValue: v as JobValue }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="가장 중요한 가치관을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_VALUE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" onClick={saveForm} disabled={isUpdating} variant="outline">
                    {isUpdating ? '저장 중...' : '저장하기'}
                  </Button>
                  <Button type="submit" disabled={isUpdating}>
                    진로 추천 받기
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
