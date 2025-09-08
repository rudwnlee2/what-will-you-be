'use client';

import type React from 'react';

import SiteHeader from '@/components/layout/site-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { computeAge, getProfile, type Profile } from '@/api/profile';
import { getAllUsers, getCurrentUser, isLoggedIn } from '@/api/auth';
import { useRouter } from 'next/navigation';

type Options = {
  mbti: string[];
  holland: string[];
  subjects: string[];
  values: string[];
};

export default function MyInfoPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [options, setOptions] = useState<Options | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    futureDream: '',
    dreamReason: '',
    interestsHobbies: '',
    mbtiType: '',
    hollandType: '',
    subject: '',
    otherSubject: '',
    careerValue: '',
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
      return;
    }
    const cu = getCurrentUser();
    setUsername(cu?.username || null);
    const p = getProfile();
    // fallback email from user store if missing
    if (!p?.email && cu?.username) {
      const users = getAllUsers() as any;
      const rec = users[cu.username];
      setProfile(
        p
          ? { ...p, email: rec?.email || p.email }
          : {
              name: cu.name,
              email: rec?.email || '',
            },
      );
    } else {
      setProfile(p);
    }

    loadOptionsAndSavedData();
  }, [router]);

  const loadOptionsAndSavedData = async () => {
    setLoading(true);
    try {
      // Load options
      const res = await fetch('/api/options', { cache: 'no-store' });
      if (res.ok) {
        const data = (await res.json()) as Options;
        setOptions(data);
      }

      // Load saved career form data
      const user = getCurrentUser();
      if (user) {
        const formRes = await fetch(`/api/career-form/load?userId=${user.id}`);
        if (formRes.ok) {
          const result = await formRes.json();
          if (result.success && result.data) {
            setForm(result.data);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const age = useMemo(() => computeAge(profile?.birthDate ?? undefined), [profile]);

  const setSubject = (s: string) => {
    setForm((prev) => {
      const nextOther = s !== '기타' ? '' : prev.otherSubject;
      return { ...prev, subject: s, otherSubject: nextOther };
    });
  };

  const isComplete = useMemo(() => {
    const requiresOther = form.subject === '기타';
    return (
      form.futureDream.trim() &&
      form.dreamReason.trim() &&
      form.interestsHobbies.trim() &&
      form.mbtiType &&
      form.hollandType &&
      form.subject &&
      (!requiresOther || form.otherSubject.trim()) &&
      form.careerValue
    );
  }, [form]);

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
        body: JSON.stringify({ ...form, userId: user.id }),
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem('careerForm', JSON.stringify(form));
    router.push('/loading');
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8">
        {/* Profile Section */}
        <Card className="bg-white shadow">
          <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={
                  profile?.avatarDataUrl ||
                  '/placeholder.svg?height=96&width=96&query=profile%20avatar'
                }
                alt="프로필 이미지"
              />
              <AvatarFallback>프로필</AvatarFallback>
            </Avatar>
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{profile?.name || '이름 미입력'}</h2>
                <Link href="/me/edit">
                  <Button variant="outline">내 정보 수정</Button>
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 mt-3 text-gray-700 text-sm">
                <div>아이디: {username || '-'}</div>
                <div>이메일: {profile?.email || '-'}</div>
                <div>
                  나이: {age ?? '-'}
                  {age !== null ? '세' : ''}
                </div>
                <div>성별: {profile?.gender || '-'}</div>
                <div>학교: {profile?.school || '-'}</div>
                <div>전화번호: {profile?.phone || '-'}</div>
                <div>생년월일: {profile?.birthDate || '-'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow">
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-xl font-semibold mb-4">진로 탐색 정보</h3>
            <p className="text-gray-600 mb-6">
              진로 추천에 필요한 정보를 수정하고 저장할 수 있습니다.
            </p>

            {saveMessage && (
              <div
                className={`mb-4 p-3 rounded-md ${
                  saveMessage.includes('오류')
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}
              >
                {saveMessage}
              </div>
            )}

            {loading ? (
              <p className="text-gray-600">정보를 불러오는 중...</p>
            ) : options ? (
              <form onSubmit={submit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="futureDream" className="font-semibold">
                      장래희망
                    </Label>
                    <Textarea
                      id="futureDream"
                      placeholder="당신의 장래희망을 자유롭게 적어주세요"
                      rows={3}
                      value={form.futureDream}
                      onChange={(e) => setForm((p) => ({ ...p, futureDream: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dreamReason" className="font-semibold">
                      장래희망을 선택한 이유
                    </Label>
                    <Textarea
                      id="dreamReason"
                      placeholder="왜 이 직업을 선택하셨나요?"
                      rows={3}
                      value={form.dreamReason}
                      onChange={(e) => setForm((p) => ({ ...p, dreamReason: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="interests" className="font-semibold">
                    관심사와 취미
                  </Label>
                  <Textarea
                    id="interests"
                    placeholder="관심 있는 활동, 즐겨하는 취미를 자유롭게 입력해주세요"
                    rows={3}
                    value={form.interestsHobbies}
                    onChange={(e) => setForm((p) => ({ ...p, interestsHobbies: e.target.value }))}
                    className="mt-2"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="font-semibold">MBTI 유형</Label>
                    <Select
                      value={form.mbtiType}
                      onValueChange={(v) => setForm((p) => ({ ...p, mbtiType: v }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="MBTI 유형을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.mbti.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-semibold">홀란드 유형</Label>
                    <Select
                      value={form.hollandType}
                      onValueChange={(v) => setForm((p) => ({ ...p, hollandType: v }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="홀란드 유형을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.holland.map((h) => (
                          <SelectItem key={h} value={h}>
                            {h}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="font-semibold">좋아하는 과목</Label>
                  <RadioGroup value={form.subject} onValueChange={setSubject} className="mt-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {options.subjects.map((s) => (
                        <div key={s} className="flex items-center space-x-2">
                          <RadioGroupItem value={s} id={s} />
                          <Label htmlFor={s}>{s}</Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                  {form.subject === '기타' && (
                    <div className="mt-3">
                      <Label htmlFor="otherSubject" className="text-sm text-gray-700">
                        기타 과목 입력
                      </Label>
                      <Input
                        id="otherSubject"
                        placeholder="예: 코딩, 경제, 심리학 등"
                        value={form.otherSubject}
                        onChange={(e) => setForm((p) => ({ ...p, otherSubject: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label className="font-semibold">직업 가치관</Label>
                  <Select
                    value={form.careerValue}
                    onValueChange={(v) => setForm((p) => ({ ...p, careerValue: v }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="가장 중요한 가치관을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.values.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    onClick={saveForm}
                    disabled={saving}
                    variant="outline"
                    className="px-6 py-3 bg-transparent"
                  >
                    {saving ? '저장 중...' : '저장하기'}
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isComplete}
                    className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    진로 추천 받기
                  </Button>
                </div>
              </form>
            ) : (
              <p className="text-gray-600">정보를 불러올 수 없습니다.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
