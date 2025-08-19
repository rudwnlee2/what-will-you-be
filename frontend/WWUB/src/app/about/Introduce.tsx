'use client';

import SiteHeader from '@/components/site-header';
import { useState } from 'react';

const sections = [
  {
    key: 'intro',
    label: '서비스 소개',
    content:
      'WWUB 진로 추천 서비스는 AI를 활용해 학생 개인의 성향, 관심사, 가치관을 분석하여 최적의 직업을 제안합니다.',
  },
  {
    key: 'how',
    label: '어떻게 작동하나요?',
    content: '5단계 입력 → AI 분석 → 맞춤 직업/학과/로드맵 제안.',
  },
  {
    key: 'policy',
    label: '개인정보·보안',
    content: '입력 데이터는 추천 외 목적에 사용되지 않으며, 동의 없이 공유되지 않습니다.',
  },
];

export default function AboutPage() {
  const [active, setActive] = useState(sections[0].key);
  const content = sections.find((s) => s.key === active)?.content;
  return (
    <div className="min-h-screen bg-purple-50">
      <SiteHeader />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex gap-8">
        <aside className="w-56 shrink-0">
          <nav className="sticky top-28 space-y-2">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={`w-full text-left px-4 py-2 rounded-md ${active === s.key ? 'bg-white shadow font-semibold' : 'hover:bg-white/70'}`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>
        <main className="flex-1 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">
            {sections.find((s) => s.key === active)?.label}
          </h2>
          <p className="text-gray-700 leading-relaxed">{content}</p>
        </main>
      </div>
    </div>
  );
}
