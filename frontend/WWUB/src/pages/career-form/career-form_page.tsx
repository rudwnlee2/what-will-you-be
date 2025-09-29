import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // ❗ 이 줄을 추가하세요.
import { Button } from '@/components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import {
  useGetRecommendationInfo,
  useUpdateRecommendationInfo,
} from '../../hooks/useRecommendation';
import { useJobRecommendation } from '../../hooks/useJobRecommendation';
import {
  MBTI_OPTIONS,
  HOLLAND_OPTIONS,
  JOB_VALUE_OPTIONS,
  SUBJECT_OPTIONS,
} from '../../constants/options';
import type { RecommendationInfoRequest, MBTI, Holland, JobValue } from '../../types/api';

export default function CareerFormSinglePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: initialData, isLoading: isInfoLoading } = useGetRecommendationInfo();
  const { mutate: updateRecommendation, isPending: isUpdating } = useUpdateRecommendationInfo();

  const { isCreating } = useJobRecommendation();
  // 저장 메시지 state 추가
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [form, setForm] = useState<{
    dream: string;
    dreamReason: string;
    interest: string;
    mbti: MBTI | '';
    holland: Holland | '';
    favoriteSubject: string;
    jobValue: JobValue | '';
  }>({
    dream: '',
    dreamReason: '',
    interest: '',
    mbti: '',
    holland: '',
    favoriteSubject: '',
    jobValue: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (initialData) {
      setForm({
        dream: initialData.dream || '',
        dreamReason: initialData.dreamReason || '',
        interest: initialData.interest || '',
        mbti: initialData.mbti || '',
        holland: initialData.holland || '',
        // favoriteSubject는 쉼표로 구분된 문자열이므로 배열로 변환합니다.
        favoriteSubject: initialData.favoriteSubject || '',
        jobValue: initialData.jobValue || '',
      });
    }
  }, [initialData]);

  const isComplete = useMemo(() => {
    return (
      form.dream.trim() &&
      form.dreamReason.trim() &&
      form.interest.trim() &&
      form.mbti &&
      form.holland &&
      form.favoriteSubject.length > 0 &&
      form.jobValue
    );
  }, [form]);
  //'저장하기' 버튼을 위한 함수 추가
  const saveForm = () => {
    // 1. 필수 항목이 모두 채워졌는지 확인 (저장은 필수가 아니어도 되게 하려면 이 줄을 지워도 됩니다)
    if (!isComplete) {
      alert('모든 항목을 입력해야 저장할 수 있습니다.');
      return;
    }

    // 2. 서버에 보낼 데이터 형식으로 변환
    const requestData: RecommendationInfoRequest = {
      dream: form.dream,
      dreamReason: form.dreamReason,
      interest: form.interest,
      mbti: form.mbti as MBTI,
      holland: form.holland as Holland,
      hobby: form.interest,
      favoriteSubject: form.favoriteSubject,
      jobValue: form.jobValue as JobValue,
    };

    // 3. updateRecommendation 함수를 호출하여 서버에 저장
    updateRecommendation(requestData, {
      onSuccess: () => {
        setSaveMessage('성공적으로 저장되었습니다!');
        setTimeout(() => setSaveMessage(null), 3000); // 3초 후 메시지 숨기기
      },
      onError: (error) => {
        setSaveMessage(`저장 중 오류 발생: ${error.message}`);
      },
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;

    const requestData: RecommendationInfoRequest = {
      dream: form.dream,
      dreamReason: form.dreamReason,
      interest: form.interest,
      mbti: form.mbti as MBTI,
      holland: form.holland as Holland,
      hobby: form.interest, // 취미와 관심사를 같은 필드로 사용
      favoriteSubject: form.favoriteSubject,
      jobValue: form.jobValue as JobValue,
    };

    updateRecommendation(requestData, {
      onSuccess: () => {
        // ❗ 정보 저장에 성공하면, 즉시 로딩 페이지로 이동합니다.
        // 실제 추천 생성은 로딩 페이지에서 수행합니다.
        navigate('/loading');
      },
      onError: (error: Error) => {
        alert('진로 정보 저장 중 오류가 발생했습니다: ' + error.message);
      },
    });
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <Card className="bg-white shadow-xl">
          <CardContent className="p-6 sm:p-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              진로 탐색을 위한 정보를 입력해주세요
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              아래 항목을 한 번에 입력하면, 나에게 맞는 직업을 추천해드려요
            </p>
            {/* 로딩 및 저장 메시지 UI 추가 */}
            <div>
              {isInfoLoading && (
                <p className="text-center text-gray-500 mb-4">저장된 정보를 불러오는 중입니다...</p>
              )}
              {saveMessage && (
                <p className="text-center text-green-600 font-semibold mb-4">{saveMessage}</p>
              )}
            </div>
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
                    <SelectContent className="bg-ground shadow-md border">
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
                    <SelectContent className="bg-ground shadow-md border">
                      {HOLLAND_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                {/* 1. 라벨은 하나만 남기고, 문구를 '하나만 선택'으로 수정합니다. */}
                <Label className="font-semibold">좋아하는 과목 (하나만 선택)</Label>

                {/* 2. 불필요한 div를 없애고 RadioGroup에 grid 스타일을 적용합니다. */}
                <RadioGroup
                  value={form.favoriteSubject}
                  onValueChange={(value) => setForm((p) => ({ ...p, favoriteSubject: value }))}
                  className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3"
                >
                  {/* 3. map 함수는 한 번만 사용하여 각 과목을 RadioGroupItem으로 만듭니다. */}
                  {SUBJECT_OPTIONS.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <RadioGroupItem value={subject} id={subject} />
                      <Label htmlFor={subject}>{subject}</Label>
                    </div>
                  ))}
                </RadioGroup>
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
                  <SelectContent className="bg-ground shadow-md border">
                    {JOB_VALUE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/*  버튼 영역 수정 */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={saveForm}
                  disabled={isUpdating || isCreating}
                >
                  저장하기
                </Button>
                <Button
                  type="submit"
                  disabled={!isComplete || isUpdating || isCreating}
                  className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isUpdating || isCreating ? '제출 중...' : '추천 받기'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
