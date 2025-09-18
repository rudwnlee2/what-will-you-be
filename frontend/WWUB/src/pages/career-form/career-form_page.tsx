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
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import { useRecommendation } from '../../hooks/useRecommendation';
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
  const { updateRecommendation, isUpdating } = useRecommendation();
  const { createRecommendations, isCreating } = useJobRecommendation();

  const [form, setForm] = useState<{
    dream: string;
    dreamReason: string;
    interest: string;
    mbti: MBTI | '';
    holland: Holland | '';
    favoriteSubjects: string[];
    jobValue: JobValue | '';
  }>({
    dream: '',
    dreamReason: '',
    interest: '',
    mbti: '',
    holland: '',
    favoriteSubjects: [],
    jobValue: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubjectChange = (subject: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      favoriteSubjects: checked
        ? [...prev.favoriteSubjects, subject]
        : prev.favoriteSubjects.filter((s) => s !== subject),
    }));
  };

  const isComplete = useMemo(() => {
    return (
      form.dream.trim() &&
      form.dreamReason.trim() &&
      form.interest.trim() &&
      form.mbti &&
      form.holland &&
      form.favoriteSubjects.length > 0 &&
      form.jobValue
    );
  }, [form]);

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
      favoriteSubject: form.favoriteSubjects.join(', '),
      jobValue: form.jobValue as JobValue,
    };

    updateRecommendation(requestData, {
      onSuccess: () => {
        // 진로 정보 저장 후 직업 추천 생성
        createRecommendations(undefined, {
          onSuccess: () => {
            alert('진로 정보가 저장되고 직업 추천이 생성되었습니다!');
            navigate('/results');
          },
          onError: (error) => {
            alert('직업 추천 생성 중 오류가 발생했습니다: ' + error.message);
          },
        });
      },
      onError: (error) => {
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

              <div>
                <Label className="font-semibold">좋아하는 과목 (복수 선택 가능)</Label>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SUBJECT_OPTIONS.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={form.favoriteSubjects.includes(subject)}
                        onCheckedChange={(checked) =>
                          handleSubjectChange(subject, checked as boolean)
                        }
                      />
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

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!isComplete || isUpdating || isCreating}
                  className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isUpdating || isCreating ? '제출 중...' : '제출하기'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
