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
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { MemberRequest } from '../../types/api';

type FormState = {
  loginId: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | '';
  agreeToTerms: boolean;
};

export default function SignupPage() {
  const { signup, isSignupLoading, signupError } = useAuth();

  const [formData, setFormData] = useState<FormState>({
    loginId: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    gender: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [usernameChecked, setUsernameChecked] = useState<null | boolean>(null);

  const handleInputChange = (field: keyof FormState, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if ((field === 'password' || field === 'confirmPassword') && typeof value === 'string') {
      const newPassword = field === 'password' ? value : formData.password;
      const newConfirmPassword = field === 'confirmPassword' ? value : formData.confirmPassword;
      setPasswordMismatch(!!newConfirmPassword && newPassword !== newConfirmPassword);
    }
  };

  const handleUsernameCheck = async () => {
    setUsernameChecked(null);
    await new Promise((r) => setTimeout(r, 400));
    setUsernameChecked(true);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!formData.loginId.trim()) next.loginId = '아이디를 입력해주세요.';
    if (!formData.name.trim()) next.name = '이름을 입력해주세요.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      next.email = '올바른 이메일 주소를 입력해주세요.';
    if (formData.password.length < 8) next.password = '비밀번호는 8자 이상이어야 합니다.';
    if (formData.password !== formData.confirmPassword)
      next.confirmPassword = '비밀번호가 일치하지 않습니다.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.birthDate))
      next.birthDate = 'YYYY-MM-DD 형식으로 입력해주세요.';
    if (!formData.gender) next.gender = '성별을 선택해주세요.';
    if (!formData.agreeToTerms) next.agreeToTerms = '개인정보 처리에 동의가 필요합니다.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const memberData: MemberRequest = {
      loginId: formData.loginId,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      gender: formData.gender as 'MALE' | 'FEMALE',
      birthDate: formData.birthDate,
    };

    signup(memberData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8 sm:p-10">

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">회원가입</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="loginId" className="text-gray-700 font-medium mb-2 block">
              아이디
            </Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="loginId"
                  placeholder="아이디를 입력하세요"
                  value={formData.loginId}
                  onChange={(e) => handleInputChange('loginId', e.target.value)}
                  aria-invalid={!!errors.loginId}
                />
                {errors.loginId && <p className="mt-1 text-sm text-red-600">{errors.loginId}</p>}
              </div>
              <Button
                type="button"
                onClick={handleUsernameCheck}
                variant="outline"
                className="bg-transparent"
              >
                중복확인
              </Button>
            </div>
            {usernameChecked === true && (
              <p className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <CheckCircle2 className="h-4 w-4" /> 사용 가능한 아이디입니다.
              </p>
            )}
            {usernameChecked === null && <p className="text-sm text-gray-500 mt-1">확인중...</p>}
          </div>

          <div>
            <Label htmlFor="name" className="text-gray-700 font-medium mb-2 block">
              이름
            </Label>
            <Input
              id="name"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

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
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

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
              aria-invalid={!!errors.password}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

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
              className={passwordMismatch ? 'border-red-500' : ''}
              aria-invalid={!!errors.confirmPassword}
            />
            {passwordMismatch && (
              <div className="absolute right-2 top-[52px] flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-xs text-red-500">비밀번호를 다시 입력해 주세요</span>
              </div>
            )}
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <Label htmlFor="birthDate" className="text-gray-700 font-medium mb-2 block">
              생년월일
            </Label>
            <Input
              id="birthDate"
              placeholder="YYYY-MM-DD 형식으로 입력하세요"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              aria-invalid={!!errors.birthDate}
            />
            {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
          </div>

          <div>
            <Label className="text-gray-700 font-medium mb-2 block">성별</Label>
            <Select value={formData.gender} onValueChange={(v) => handleInputChange('gender', v)}>
              <SelectTrigger id="gender" aria-invalid={!!errors.gender}>
                <SelectValue placeholder="성별을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">남성</SelectItem>
                <SelectItem value="FEMALE">여성</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
          </div>



          <div className="flex items-center">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              aria-invalid={!!errors.agreeToTerms}
            />
            <Label htmlFor="agreeToTerms" className="ml-2 text-gray-700">
              개인정보 수집 및 이용에 동의합니다
            </Label>
          </div>
          {errors.agreeToTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
          )}

          <Button
            type="submit"
            disabled={!formData.agreeToTerms || isSignupLoading}
            className="w-full py-3 bg-black text-white font-semibold hover:bg-gray-800 disabled:bg-gray-400"
          >
            {isSignupLoading ? '처리중...' : '회원가입'}
          </Button>
          {signupError && (
            <p className="text-center text-sm text-red-600">
              {signupError.message || '회원가입 중 오류가 발생했습니다.'}
            </p>
          )}
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
