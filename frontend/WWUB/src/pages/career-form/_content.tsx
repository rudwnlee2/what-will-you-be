'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import SiteHeader from '@/components/site-header';
import { getCurrentUser } from '@/api/auth';

export default function CareerFormPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    futureDream: '',
    dreamReason: '',
    interestsHobbies: '',
    favoriteSubject: '',
    otherSubject: '',
    mbtiType: '',
    hollandType: '',
    careerValue: '',
  });

  const mbtiOptions = [
    'ISTJ',
    'ISFJ',
    'INFJ',
    'INTJ',
    'ISTP',
    'ISFP',
    'INFP',
    'INTP',
    'ESTP',
    'ESFP',
    'ENFP',
    'ENTP',
    'ESTJ',
    'ESFJ',
    'ENFJ',
    'ENTJ',
  ];
  const hollandOptions = [
    '현실형 (Realistic)',
    '탐구형 (Investigative)',
    '예술형 (Artistic)',
    '사회형 (Social)',
    '진취형 (Enterprising)',
    '관습형 (Conventional)',
  ];
  const careerValueOptions = [
    '안정성 (Stability)',
    '성장 가능성 (Growth Potential)',
    '워라밸 (Work-Life Balance)',
    '경제적 보상 (Financial Reward)',
    '명예/인정 (Honor/Recognition)',
    '봉사 (Service)',
    '자율성 (Autonomy)',
    '창의성 (Creativity)',
    '사회적 기여 (Social Contribution)',
    '전문성 (Expertise)',
  ];

  const subjects = ['국어', '영어', '수학', '사회', '과학', '기타'];

  const loadSavedData = async () => {
    try {
      const user = getCurrentUser();
      if (!user) return;

      const res = await fetch(`/api/career-form/load?userId=${user.id}`);
      if (!res.ok) return;

      const result = await res.json();
      if (result.success && result.data) {
        setFormData(result.data);
        setSaveMessage('저장된 데이터를 불러왔습니다.');
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (error) {
      console.error('Failed to load saved data:', error);
    }
  };

  useEffect(() => {
    loadSavedData();
  }, []);

  const saveForm = async () => {
    try {
      setSaving(true);
      setSaveMessage(null);

      const user = getCurrentUser();
      if (!user) {
        setSaveMessage('로그인이 필요합니다.');
        return;
      }

      const res = await fetch('/api/career-form/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user.id }),
      });

      const result = await res.json();
      if (result.success) {
        setSaveMessage('저장되었습니다!');
      } else {
        setSaveMessage('저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setSaveMessage('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleSubmit = () => {
    sessionStorage.setItem('careerForm', JSON.stringify(formData));
    router.push('/loading');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div key="step1" className="space-y-4 animate-fade-in">
            <Label htmlFor="futureDream" className="text-gray-700 font-medium text-lg">
              장래희망
            </Label>
            <Textarea
              id="futureDream"
              placeholder="당신의 장래희망을 자유롭게 적어주세요"
              value={formData.futureDream}
              onChange={(e) => setFormData((p) => ({ ...p, futureDream: e.target.value }))}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />
          </div>
        );
      case 2:
        return (
          <div key="step2" className="space-y-4 animate-fade-in">
            <Label htmlFor="dreamReason" className="text-gray-700 font-medium text-lg">
              장래희망을 선택한 이유
            </Label>
            <Textarea
              id="dreamReason"
              placeholder="왜 이 직업을 선택하셨나요?"
              value={formData.dreamReason}
              onChange={(e) => setFormData((p) => ({ ...p, dreamReason: e.target.value }))}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />
          </div>
        );
      case 3:
        return (
          <div key="step3" className="space-y-4 animate-fade-in">
            <Label htmlFor="interestsHobbies" className="text-gray-700 font-medium text-lg">
              관심사와 취미
            </Label>
            <Textarea
              id="interestsHobbies"
              placeholder="관심 있는 활동, 즐겨하는 취미를 자유롭게 입력해주세요"
              value={formData.interestsHobbies}
              onChange={(e) => setFormData((p) => ({ ...p, interestsHobbies: e.target.value }))}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
            />
          </div>
        );
      case 4:
        return (
          <div key="step4" className="space-y-6 animate-fade-in">
            <Label className="text-gray-700 font-medium text-lg block mb-4">좋아하는 과목</Label>
            <RadioGroup
              value={formData.favoriteSubject}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, favoriteSubject: value }))
              }
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <div key={subject} className="flex items-center space-x-2">
                    <RadioGroupItem value={subject} id={`subject-${subject}`} />
                    <Label htmlFor={`subject-${subject}`} className="text-base font-normal">
                      {subject}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {formData.favoriteSubject === '기타' && (
              <div className="mt-4">
                <Label htmlFor="otherSubject" className="text-sm text-gray-700">
                  기타 과목 입력
                </Label>
                <Input
                  id="otherSubject"
                  placeholder="예: 코딩, 경제, 심리학 등"
                  value={formData.otherSubject}
                  onChange={(e) => setFormData((p) => ({ ...p, otherSubject: e.target.value }))}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        );
      case 5:
        return (
          <div key="step5" className="space-y-6 animate-fade-in">
            <Label className="text-gray-700 font-medium text-lg block mb-4">성격 및 성향</Label>
            <div>
              <Label className="text-gray-700 font-medium mb-2 block">MBTI 유형</Label>
              <Select
                value={formData.mbtiType}
                onValueChange={(v) => setFormData((p) => ({ ...p, mbtiType: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="MBTI 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {mbtiOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700 font-medium mb-2 block">홀란드 유형</Label>
              <Select
                value={formData.hollandType}
                onValueChange={(v) => setFormData((p) => ({ ...p, hollandType: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="홀란드 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {hollandOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-700 font-medium block mb-2">직업 가치관</Label>
              <Select
                value={formData.careerValue}
                onValueChange={(v) => setFormData((p) => ({ ...p, careerValue: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="가장 중요한 가치관을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {careerValueOptions.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <SiteHeader />
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8 sm:p-10">
          <CardContent className="p-0">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
              진로 탐색을 위한 정보를 입력해주세요
            </h1>
            <p className="text-lg text-center text-gray-600 mb-8">
              아래 항목들을 순서대로 입력하면, 나에게 맞는 직업을 추천해드려요
            </p>

            {saveMessage && (
              <div
                className={`mb-4 p-3 rounded-md text-center ${
                  saveMessage.includes('오류')
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}
              >
                {saveMessage}
              </div>
            )}

            <div className="text-center text-blue-600 font-semibold text-xl mb-8">
              {currentStep} / {totalSteps}
            </div>
            <div className="min-h-[300px]">{renderStepContent()}</div>
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <Button
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                disabled={currentStep === 1}
                variant="outline"
                className="px-6 py-3"
              >
                이전
              </Button>
              <div className="flex gap-3">
                <Button
                  onClick={saveForm}
                  disabled={saving}
                  variant="outline"
                  className="px-6 py-3 bg-transparent"
                >
                  {saving ? '저장 중...' : '저장하기'}
                </Button>
                {currentStep < totalSteps ? (
                  <Button
                    onClick={() => setCurrentStep((s) => Math.min(totalSteps, s + 1))}
                    className="px-6 py-3 bg-black text-white hover:bg-gray-800"
                  >
                    다음
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    제출하기
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
