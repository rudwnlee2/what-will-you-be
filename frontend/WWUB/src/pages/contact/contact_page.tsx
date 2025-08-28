import SiteHeader from '@/components/site-header';
import { useState } from 'react';

const sections = [
  {
    key: 'faq',
    label: '자주 묻는 질문',
    content: '서비스 이용, 결과 해석, 오류 해결에 대한 안내입니다.',
  },
  {
    key: 'support',
    label: '문의하기',
    content: '이메일 support@careerfit.kr 로 문의 주시면 빠르게 도와드릴게요.',
  },
  {
    key: 'terms',
    label: '이용약관/개인정보',
    content: '서비스 이용약관과 개인정보처리방침을 확인하세요.',
  },
];

export default function ContactPage() {
  const [active, setActive] = useState(sections[0].key);
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
          <p className="text-gray-700 leading-relaxed">
            {sections.find((s) => s.key === active)?.content}
          </p>
        </main>
      </div>
    </div>
  );
}
