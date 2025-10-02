import { useState } from 'react';

const sections = [
  {
    key: 'intro',
    label: '서비스 소개',
    content: `
# 서비스 소개
WWUB 진로 추천 서비스는 **RAG 기법을 적용한 AI**를 활용해
학생 개인의 성향, 관심사, 가치관을 분석하여 최적의 직업을 제안합니다.

## RAG란 무엇인가요?
RAG는 **Retrieval-Augmented Generation**의 약자이며, 번역하면 **‘검색 증강 생성’**입니다.
RAG는 다음 단계를 거칩니다:
1. 사전에 외부 데이터 생성
2. 사용자 입력 내용 이해
3. 관련 내용 찾기
4. 찾은 내용 참조해서 생성
생성형 AI가 답변을 생성할 때, 자신이 학습한 내용 외에도 외부에서 검색 결과를 가져오거나,
사용자가 입력한 파일 등을 참고하도록 하여 더 적절한 맥락과 신뢰할 수 있는 답변을 생성하게 합니다.

## 왜 RAG를 사용하였나요?
방대한 양의 텍스트 데이터를 학습하여 인간의 언어를 이해하고 생성하는 AI 모델을 
‘대규모 언어 모델’(Large Language Model, LLM)이라고 합니다. 
LLM은 텍스트가 존재하는 모든 곳에서 활용 가능하고, 
특히 사람이 "읽고, 요약하고, 답하는" 일을 자동화하거나 보조하는 데 강합니다.

그러나 LLM은 만능이 아닙니다.
- 과거 정보를 학습했기 때문에, 학습 시점 이후에 일어난 사건이나 변화는 알지 못합니다. 
- 또한 이전에 제공한 대화 맥락을 완벽히 기억하지 못해 맞춤형 답변에 한계가 있습니다. 
- 또 하나의 큰 한계는 사실이 아닌 내용을 마치 사실처럼 그럴듯하게 말하는 오류(환각, hallucination)를 일으킬 수 있다는 점입니다.

이를 보완하기 위해, LLM이 신뢰할 수 있는 외부 정보를 검색·참조한 뒤 답변하도록 하는 방식이 바로 **RAG**입니다.

## 이 서비스에서 AI는 어떤 데이터를 참조하나요?
이 서비스에서는 정부 기관인 **고용24**에서 제공하는 **OPEN-API 직업 상세정보**를 벡터화하여 참조합니다.
       `,
  },
  {
    key: 'how',
    label: '어떻게 작동하나요?',
    content: `
# 어떻게 작동하나요?

5단계 입력 → AI 분석 → 맞춤 직업/학과/로드맵 제안.

RAG 기법을 적용한 AI를 활용해 학생 개인의 성향, 관심사, 가치관을 분석하여 최적의 직업을 제안합니다.

### 1. 외부 데이터 생성: 사전 준비하기
문자로 작성된 직업 정보들을 AI가 이해하기 쉽게 **숫자 배열(벡터)**로 바꾼 후, 데이터베이스에 저장합니다.  
글로 된 직업 정보와 벡터 데이터를 연결해둡니다.

### 2. 임베딩: 사용자 정보를 AI가 알기 쉽게 바꾸기
사용자가 정보를 글로 입력하면, 이를 숫자 배열(벡터)로 바꾸는 과정을 거칩니다.  
이 과정을 **‘임베딩(embedding)’**이라고 합니다.

### 3. 관련 정보 검색: 사용자와 어울리는 직업 찾기
벡터로 바뀐 사용자 정보를, 미리 저장해둔 직업 벡터 정보와 비교하여 가장 비슷한 직업 3가지를 찾습니다.

### 4. 외부 자료 참조해서 새로운 내용 생성: 직업 요약 & 추천 이유
고용24 직업 정보는 길고 복잡해 한눈에 보기 어렵습니다.  
따라서 AI가 이를 간단하게 요약하고, 사용자 특징과 직업에 필요한 역량·성향·흥미를 연결해 **추천 이유를 설명**합니다.
`,
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
