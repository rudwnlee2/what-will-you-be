import type React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useUpdateProfile, useDeleteAccount } from '../../../hooks/useUser'; // ❗ 새 훅 import
import type { UpdateProfileData } from '../../../types/user.types';
import { AlertTriangle } from 'lucide-react'; // ❗ 비밀번호 불일치 아이콘

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();
  const { mutate: deleteAccount } = useDeleteAccount();

  const [profile, setProfileState] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
  });

  // ❗ 1. 비밀번호 상태 관리 로직을 다시 추가합니다.
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(undefined);

  //  비밀번호 일치 여부를 실시간으로 확인하는 useEffect 추가
  useEffect(() => {
    // 확인 비밀번호가 입력되었을 때만 불일치 여부를 검사
    setPasswordMismatch(!!confirmPassword && password !== confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user) {
      setProfileState({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        school: user.school || '',
      });
    }
  }, [isAuthenticated, navigate, user]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setPreview(dataUrl);
      setProfileState((prev) => ({ ...prev, avatarDataUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return; // user 정보가 없으면 실행하지 않음

    // ❗ 3. 비밀번호 유효성 검사를 강화합니다.
    if (!password || passwordMismatch) {
      alert('비밀번호를 올바르게 입력해주세요. 정보 수정을 위해서는 비밀번호 확인이 필요합니다.');
      return;
    }

    const updatedData: UpdateProfileData = {
      // 수정 불가능한 원본 데이터
      loginId: user.loginId,
      birth: user.birth,
      gender: user.gender,
      // 수정 가능한 최신 데이터
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      school: profile.school,
      password: password, // 사용자가 입력한 비밀번호 포함
    };
    updateProfile(updatedData); // ❗ API 호출로 변경
  };

  const onDeleteAccount = () => {
    deleteAccount(); // ❗ API 호출로 변경
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <Card className="bg-white shadow">
          <CardContent className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold mb-6">내 정보 수정</h1>
            <form onSubmit={onSubmit} className="space-y-8">
              {/* Avatar */}
              <div>
                <Label className="font-medium">프로필 이미지</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                    {preview ? (
                      <img
                        src={preview || '/placeholder.svg'}
                        alt="미리보기"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        미리보기
                      </div>
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="max-w-xs"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  이미지를 업로드하면 추천 결과 카드에 개인화 미리보기가 표시됩니다.
                </p>
              </div>

              {/* Editable Information */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">수정 가능한 정보</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      value={profile.name || ''}
                      onChange={(e) => setProfileState((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email || ''}
                      onChange={(e) => setProfileState((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">전화번호</Label>
                    <Input
                      id="phone"
                      placeholder="전화번호"
                      value={profile.phone || ''}
                      onChange={(e) => setProfileState((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="school">학교</Label>
                    <Input
                      id="school"
                      placeholder="학교"
                      value={profile.school || ''}
                      onChange={(e) => setProfileState((p) => ({ ...p, school: e.target.value }))}
                    />
                  </div>
                  {/* ❗ 5. 비밀번호 필드를 수정 가능 영역으로 이동 */}
                  <div>
                    <Label htmlFor="password">비밀번호 수정 및 확인</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호 입력"
                    />
                  </div>
                  <div className="relative">
                    <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="비밀번호 재입력"
                    />
                    {passwordMismatch && (
                      <div className="absolute right-2 top-9 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-xs text-red-500">불일치</span>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Non-editable Information */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">수정 불가 정보</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="username">아이디</Label>
                    <Input id="username" value={user?.loginId || ''} disabled />
                  </div>
                  <div>
                    <Label htmlFor="birth">생년월일</Label>
                    <Input id="birth" value={user?.birth || ''} disabled />
                  </div>
                  <div>
                    <Label htmlFor="gender">성별</Label>
                    <Input id="gender" value={user?.gender === 'MALE' ? '남성' : '여성'} disabled />
                  </div>
                </div>
              </section>

              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {isSaving ? '저장중...' : '저장하기'}
                </Button>

                {/* Account Deletion */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive">
                      회원 탈퇴
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>정말로 삭제 하시겠습니까?</AlertDialogTitle>
                      <AlertDialogDescription>
                        계정과 개인 정보, 추천 기록이 모두 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>아니오</AlertDialogCancel>
                      <AlertDialogAction onClick={onDeleteAccount}>예</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
