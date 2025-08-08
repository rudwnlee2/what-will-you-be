'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

export default function CareerFormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    futureDream: '',
    dreamReason: '',
    interestsHobbies: '',
    favoriteSubjects: [] as string[],
    mbtiType: '',
    hollandType: '',
    careerValue1: '',
    careerValue2: '',
    careerValue3: '',
  });

  const totalSteps = 5;

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

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    setFormData((prev) => {
      const newSubjects = checked
        ? [...prev.favoriteSubjects, subject]
        : prev.favoriteSubjects.filter((s) => s !== subject);
      return { ...prev, favoriteSubjects: newSubjects };
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    // Here you would typically send data to your backend
    alert('진로 정보 제출 완료!');
  };

  /* const getFilteredCareerValues = (currentSelection: string) => {
    return careerValueOptions.filter(
      (value) =>
        value !== formData.careerValue1 &&
        value !== formData.careerValue2 &&
        value !== formData.careerValue3 &&
        value !== currentSelection,
    );
  };*/

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div key="step1" className="space-y-4">
            <Label htmlFor="futureDream" className="text-gray-700 font-medium text-lg">
              장래희망
            </Label>
            <Textarea
              id="futureDream"
              placeholder="당신의 장래희망을 자유롭게 적어주세요"
              value={formData.futureDream}
              onChange={(e) => handleInputChange('futureDream', e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-base"
            />
          </div>
        );
      case 2:
        return (
          <div key="step2" className="space-y-4">
            <Label htmlFor="dreamReason" className="text-gray-700 font-medium text-lg">
              장래희망을 선택한 이유
            </Label>
            <Textarea
              id="dreamReason"
              placeholder="왜 이 직업을 선택하셨나요?"
              value={formData.dreamReason}
              onChange={(e) => handleInputChange('dreamReason', e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-base"
            />
          </div>
        );
      case 3:
        return (
          <div key="step3" className="space-y-4">
            <Label htmlFor="interestsHobbies" className="text-gray-700 font-medium text-lg">
              관심사와 취미
            </Label>
            <Textarea
              id="interestsHobbies"
              placeholder="관심 있는 활동, 즐겨하는 취미를 자유롭게 입력해주세요"
              value={formData.interestsHobbies}
              onChange={(e) => handleInputChange('interestsHobbies', e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-base"
            />
          </div>
        );
      case 4:
        const subjects = ['국어', '영어', '수학', '사회', '과학', '예체능', '기타'];
        return (
          <div key="step4" className="space-y-6">
            <Label className="text-gray-700 font-medium text-lg block mb-4">좋아하는 과목</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${subject}`}
                    checked={formData.favoriteSubjects.includes(subject)}
                    onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                    className="w-5 h-5"
                  />
                  <Label htmlFor={`subject-${subject}`} className="text-base font-normal">
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div key="step5" className="space-y-6">
            <Label className="text-gray-700 font-medium text-lg block mb-4">성격 및 성향</Label>

            {/* MBTI */}
            <div>
              <Label htmlFor="mbtiType" className="text-gray-700 font-medium mb-2 block">
                MBTI 유형
              </Label>
              <Select
                onValueChange={(value) => handleInputChange('mbtiType', value)}
                value={formData.mbtiType}
              >
                <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-base">
                  <SelectValue placeholder="MBTI 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {mbtiOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Holland */}
            <div>
              <Label htmlFor="hollandType" className="text-gray-700 font-medium mb-2 block">
                홀란드 유형
              </Label>
              <Select
                onValueChange={(value) => handleInputChange('hollandType', value)}
                value={formData.hollandType}
              >
                <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-base">
                  <SelectValue placeholder="홀란드 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {hollandOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Career Values */}
            <div className="space-y-4">
              <Label className="text-gray-700 font-medium block">직업 가치관 (1~3순위 선택)</Label>
              <div>
                <Label htmlFor="careerValue1" className="text-gray-600 text-sm mb-1 block">
                  1순위
                </Label>
                <Select
                  onValueChange={(value) => handleInputChange('careerValue1', value)}
                  value={formData.careerValue1}
                >
                  <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-base">
                    <SelectValue placeholder="1순위 가치관 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {careerValueOptions.map((value) => (
                      <SelectItem
                        key={value}
                        value={value}
                        disabled={
                          value === formData.careerValue2 || value === formData.careerValue3
                        }
                      >
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="careerValue2" className="text-gray-600 text-sm mb-1 block">
                  2순위
                </Label>
                <Select
                  onValueChange={(value) => handleInputChange('careerValue2', value)}
                  value={formData.careerValue2}
                >
                  <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-base">
                    <SelectValue placeholder="2순위 가치관 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {careerValueOptions.map((value) => (
                      <SelectItem
                        key={value}
                        value={value}
                        disabled={
                          value === formData.careerValue1 || value === formData.careerValue3
                        }
                      >
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="careerValue3" className="text-gray-600 text-sm mb-1 block">
                  3순위
                </Label>
                <Select
                  onValueChange={(value) => handleInputChange('careerValue3', value)}
                  value={formData.careerValue3}
                >
                  <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-base">
                    <SelectValue placeholder="3순위 가치관 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {careerValueOptions.map((value) => (
                      <SelectItem
                        key={value}
                        value={value}
                        disabled={
                          value === formData.careerValue1 || value === formData.careerValue2
                        }
                      >
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8 sm:p-10">
        <CardContent className="p-0">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
            진로 탐색을 위한 정보를 입력해주세요
          </h1>
          <p className="text-lg text-center text-gray-600 mb-8">
            아래 항목들을 순서대로 입력하면, 나에게 맞는 직업을 추천해드려요
          </p>

          {/* Step Progress Indicator */}
          <div className="text-center text-blue-600 font-semibold text-xl mb-8">
            {currentStep} / {totalSteps}
          </div>

          {/* Form Content for Current Step */}
          <div className="min-h-[300px] flex flex-col justify-between">{renderStepContent()}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="outline"
              className="px-6 py-3 text-base bg-transparent hover:bg-gray-50"
            >
              이전
            </Button>
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                className="px-6 py-3 text-base bg-black text-white hover:bg-gray-800"
              >
                다음
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="px-6 py-3 text-base bg-blue-600 text-white hover:bg-blue-700"
              >
                제출하기
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
