'use client';

import type React from 'react';

import { useState } from 'react';
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
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
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
  });

  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [usernameChecked, setUsernameChecked] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Check password match (only for string values)
    if (typeof value === 'string' && (field === 'password' || field === 'confirmPassword')) {
      const newPassword = field === 'password' ? value : formData.password;
      const newConfirmPassword = field === 'confirmPassword' ? value : formData.confirmPassword;

      if (newConfirmPassword && newPassword !== newConfirmPassword) {
        setPasswordMismatch(true);
      } else {
        setPasswordMismatch(false);
      }
    }
  };

  const handleUsernameCheck = () => {
    // Simulate username check
    setUsernameChecked(true);
    // In real implementation, this would make an API call
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8 sm:p-10">
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
              >
                중복확인
              </Button>
            </div>
            {usernameChecked && (
              <p className="text-sm text-green-600 mt-1">사용 가능한 아이디입니다.</p>
            )}
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-gray-700 font-medium mb-2 block">
              이름
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="이름을 입력하세요"
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
              placeholder="이메일 주소를 입력하세요"
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
              placeholder="비밀번호를 입력하세요"
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
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                passwordMismatch ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {passwordMismatch && (
              <div className="absolute right-2 top-10 flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-xs text-red-500">비밀번호를 다시 입력해 주세요</span>
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
              placeholder="YYYY-MM-DD 형식으로 입력하세요"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Gender */}
          <div>
            <Label className="text-gray-700 font-medium mb-2 block">성별</Label>
            <Select onValueChange={(value) => handleInputChange('gender', value)}>
              <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <SelectValue placeholder="성별을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">남성</SelectItem>
                <SelectItem value="female">여성</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone" className="text-gray-700 font-medium mb-2 block">
              전화번호
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="전화번호를 입력하세요"
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
              placeholder="학교 이름을 입력하세요"
              value={formData.school}
              onChange={(e) => handleInputChange('school', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Terms Agreement */}
          <div className="flex items-center">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <Label htmlFor="agreeToTerms" className="ml-2 text-gray-700">
              개인정보 수집 및 이용에 동의합니다
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!formData.agreeToTerms || passwordMismatch}
            className="w-full py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            회원가입 완료
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
}
