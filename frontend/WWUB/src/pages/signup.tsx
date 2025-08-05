'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
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

const fetchGenders = async (): Promise<string[]> => {
  const { data } = await api.get('/api/options/genders');
  return data;
};

const signupUser = async (userData: Omit<SignupFormData, 'confirmPassword' | 'agreeToTerms'>) => {
  const { data } = await api.post('/api/members/signup', userData);
  return data;
};

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const { data: genderOptions, isLoading: isGendersLoading } = useQuery<string[]>({
    queryKey: ['genders'],
    queryFn: fetchGenders,
    staleTime: 5 * 60 * 1000,
  });

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
            <Label htmlFor="username">아이디</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
            />
          </div>
          {/* Name */}
          <div>
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>
          {/* Email */}
          <div>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
          {/* Password */}
          <div>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </div>
          {/* Confirm Password */}
          <div className="relative">
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
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
            <Label htmlFor="birthDate">생년월일</Label>
            <Input
              id="birthDate"
              type="text"
              placeholder="YYYY-MM-DD"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
            />
          </div>
          {/* Gender Select */}
          <div>
            <Label>성별</Label>
            <Select
              onValueChange={(value) => handleInputChange('gender', value)}
              value={formData.gender}
              disabled={isGendersLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={'성별을 선택하세요'} />
              </SelectTrigger>
              <SelectContent>
                {genderOptions?.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender === 'MALE' ? '남성' : '여성'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Phone */}
          <div>
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
          {/* School */}
          <div>
            <Label htmlFor="school">학교</Label>
            <Input
              id="school"
              type="text"
              value={formData.school}
              onChange={(e) => handleInputChange('school', e.target.value)}
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
            className="w-full py-3"
          >
            {signupMutation.isPending ? '가입 처리 중...' : '회원가입 완료'}
          </Button>
        </form>
      </div>
    </div>
  );
}
