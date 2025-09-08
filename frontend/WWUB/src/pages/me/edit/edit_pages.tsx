'use client';

import type React from 'react';

import SiteHeader from '@/components/layout/site-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getProfile, setProfile, type Profile, clearAllPersonalData } from '@/api/profile';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
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
import {
  getAllUsers,
  getCurrentUser,
  isLoggedIn,
  setCurrentUser,
  clearCurrentUser,
} from '@/api/auth';

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfileState] = useState<Profile>({
    name: '',
    email: '',
    birthDate: '',
    gender: '',
    phone: '',
    school: '',
    avatarDataUrl: '',
  });
  const [username, setUsername] = useState<string>('');
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  // Editable fields (password managed in users store)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
      return;
    }
    const cu = getCurrentUser();
    const uname = cu?.username || '';
    setUsername(uname);
    const p = getProfile();
    if (p) {
      setProfileState({ ...profile, ...p });
      setPreview(p.avatarDataUrl);
    } else {
      // fallback from users store if any
      const users = getAllUsers() as any;
      const rec = uname ? users[uname] : null;
      setProfileState({
        name: cu?.name || '',
        email: rec?.email || '',
        birthDate: rec?.birthDate || '',
        gender: rec?.gender || '',
        phone: '',
        school: '',
        avatarDataUrl: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    setPasswordMismatch(!!confirmPassword && password !== confirmPassword);
  }, [password, confirmPassword]);

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
    if (passwordMismatch) return;
    setSaving(true);

    // Save profile to profile store
    setProfile(profile);

    // Update users store (name, email, password if provided)
    try {
      const users = getAllUsers() as any;
      const rec = users[username] || {};
      users[username] = {
        ...rec,
        username,
        name: profile.name,
        email: profile.email,
        password: password ? password : rec.password,
        birthDate: profile.birthDate || rec.birthDate,
        gender: profile.gender || rec.gender,
      };
      localStorage.setItem('wwub_users', JSON.stringify(users));
      // Update current user name for header greeting
      setCurrentUser({ username, name: profile.name });
    } catch {}

    setTimeout(() => {
      setSaving(false);
      router.push('/me');
    }, 300);
  };

  const onDeleteAccount = () => {
    try {
      // Remove from users db
      const users = getAllUsers() as any;
      if (username && users[username]) {
        delete users[username];
        localStorage.setItem('wwub_users', JSON.stringify(users));
      }
      // Clear auth and personal data
      clearCurrentUser();
      clearAllPersonalData();
    } finally {
      router.replace('/');
    }
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <SiteHeader />
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
                      <Image
                        src={preview || '/placeholder.svg?height=96&width=96&query=avatar'}
                        alt="미리보기"
                        fill
                        className="object-cover"
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
                    <Label htmlFor="password">비밀번호</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="변경 시 입력"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="변경 시 입력"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={passwordMismatch ? 'border-red-500' : ''}
                    />
                    {passwordMismatch && (
                      <div className="absolute right-2 top-[52px] flex items-center gap-1 text-red-600 text-xs">
                        <AlertTriangle className="w-4 h-4" />
                        비밀번호가 일치하지 않습니다
                      </div>
                    )}
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
                </div>
              </section>

              {/* Non-editable Information */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">수정 불가 정보</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="username">아이디</Label>
                    <Input id="username" value={username} disabled />
                  </div>
                  <div>
                    <Label htmlFor="birthDate">생년월일</Label>
                    <Input id="birthDate" value={profile.birthDate || ''} disabled />
                  </div>
                  <div>
                    <Label htmlFor="gender">성별</Label>
                    <Input id="gender" value={profile.gender || ''} disabled />
                  </div>
                </div>
              </section>

              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {saving ? '저장중...' : '저장하기'}
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
