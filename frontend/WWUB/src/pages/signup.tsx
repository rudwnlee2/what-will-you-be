'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle } from 'lucide-react';
import api from '@/lib/api';

const initialFormData = {
  username: '',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  birthDate: '',
  gender: '',
  phone: '',
  school: '',
  agreeToTerms: false,
};
type SignupFormData = typeof initialFormData;

const genderOptions = [
  { value: 'MALE', label: '남성' },
  { value: 'FEMALE', label: '여성' },
];

const signupUser = async (userData: Omit<SignupFormData, 'confirmPassword' | 'agreeToTerms'>) => {
  const { data } = await api.post('/api/members/signup', userData);
  return data;
};

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      alert('회원가입이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    },
    onError: (error) => {
      console.error('회원가입 실패:', error);
      alert('회원가입 중 오류가 발생했습니다. 입력 정보를 확인해주세요.');
    },
  });

  const handleInputChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === 'password' || field === 'confirmPassword') {
        const newPassword = field === 'password' ? (value as string) : newData.password;
        const newConfirmPassword =
          field === 'confirmPassword' ? (value as string) : newData.confirmPassword;
        setPasswordMismatch(!!newConfirmPassword && newPassword !== newConfirmPassword);
      }
      return newData;
    });
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof SignupFormData, string>> = {};
    if (!formData.username) errors.username = '아이디를 입력해주세요.';
    if (!formData.email.includes('@')) errors.email = '올바른 이메일 형식이 아닙니다.';
    if (formData.password.length < 8) errors.password = '비밀번호는 8자 이상이어야 합니다.';
    if (passwordMismatch) errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    if (!formData.gender) errors.gender = '성별을 선택해주세요.';
    if (!formData.agreeToTerms) errors.agreeToTerms = '약관에 동의해주세요.';

    setFormErrors(errors);
    // Object.keys(errors).length가 0이면 에러가 없는 것이므로 true 반환
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordMismatch || !formData.agreeToTerms) {
      alert('입력 정보를 다시 확인해주세요.');
      return;
    }
    const { confirmPassword: _pc, agreeToTerms: _at, ...payload } = formData;
    signupMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">회원가입</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <Label htmlFor="username" className="text-gray-700 font-medium mb-2 block">
              아이디
            </Label>
            <div className="flex space-x-2">
              <Input
                id="username"
                type="text"
                placeholder="아이디를 입력하세요"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />

              <Button
                type="button"
                onClick={handleUsernameCheck}
                variant="outline"
                className="px-4 py-2 whitespace-nowrap bg-transparent"
              ></Button>
            </div>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-gray-700 font-medium mb-2 block">
              이름
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium mb-2 block">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium mb-2 block">
              비밀번호
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* Confirm Password */}
          <div className="relative">
            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium mb-2 block">
              비밀번호 확인
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={passwordMismatch ? 'border-red-500' : ''}
            />
            {passwordMismatch && (
              <div className="absolute right-2 top-10 flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-xs text-red-500">비밀번호가 일치하지 않습니다.</span>
              </div>
            )}
          </div>
          {/* Birth Date */}
          <div>
            <Label htmlFor="birthDate" className="text-gray-700 font-medium mb-2 block">
              생년월일
            </Label>
            <Input
              id="birthDate"
              type="text"
              placeholder="YYYY-MM-DD"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* Gender Select */}
          <div>
            <Label className="text-gray-700 font-medium mb-2 block">성별</Label>
            <Select
              onValueChange={(value) => handleInputChange('gender', value)}
              value={formData.gender}
            >
              <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <SelectValue placeholder="성별을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {/* 4. 프론트엔드에 직접 정의한 데이터 사용 */}
                {genderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.gender && <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>}
          </div>
          {/* Phone */}
          <div>
            <Label htmlFor="phone" className="text-gray-700 font-medium mb-2 block">
              전화번호
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* School */}
          <div>
            <Label htmlFor="school" className="text-gray-700 font-medium mb-2 block">
              학교
            </Label>
            <Input
              id="school"
              type="text"
              value={formData.school}
              onChange={(e) => handleInputChange('school', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* Terms Agreement */}
          <div className="flex items-center">
            <input
              id="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="agreeToTerms" className="ml-2">
              개인정보 수집 및 이용에 동의합니다
            </Label>
          </div>
          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!formData.agreeToTerms || passwordMismatch || signupMutation.isPending}
            className="w-full py-3 text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-lg"
          >
            {signupMutation.isPending ? '가입 처리 중...' : '회원가입'}
          </Button>
        </form>
      </div>
    </div>
  );
}
