# What Will You Be - Frontend

AI 기반 진로 추천 시스템의 프론트엔드 웹 애플리케이션

## 📋 프로젝트 개요

**What Will You Be Frontend**는 사용자의 성향, MBTI, 홀랜드 유형, 직업가치관을 입력받아 AI 기반 맞춤형 직업 추천을 제공하는 반응형 웹 애플리케이션입니다.

## 🛠 기술 스택

### 사용 언어
- TypeScript 5.8.3

### 프레임워크
- React 19.1.0
- Vite 7.0.0 (빌드 도구)
- React Router DOM 7.6.3

### 상태 관리
- TanStack Query 5.84.1 (서버 상태)
- Custom Hooks (클라이언트 상태)

### UI 라이브러리
- TailwindCSS 3.4.x
- Radix UI (헤드리스 컴포넌트)
- Lucide React 0.536.0 (아이콘)
- Class Variance Authority (조건부 스타일링)

### 개발 도구
- ESLint 9.30.1 (코드 품질)
- Prettier 3.6.2 (코드 포맷팅)
- Axios 1.11.0 (HTTP 클라이언트)

## 📊 시스템 구조도

### 컴포넌트 아키텍처
```
Pages → Hooks → API → Backend Services
  ↓       ↓       ↓
 UI ← Components ← Types
```

### 프로젝트 구조
```
src/
├── api/                    # API 클라이언트
│   ├── axiosInstance.ts   # HTTP 클라이언트 설정
│   ├── auth.ts           # 인증 API
│   ├── members.ts        # 회원 관리 API
│   ├── recommendations.ts # 추천 정보 API
│   └── jobs.ts          # 직업 추천 API
├── components/            # 재사용 컴포넌트
│   ├── ui/              # 기본 UI 컴포넌트
│   └── layout/          # 레이아웃 컴포넌트
├── hooks/               # 커스텀 훅
│   ├── useAuth.ts       # 인증 상태 관리
│   ├── useJobRecommendation.ts # 직업 추천
│   └── useRecommendation.ts    # 추천 정보
├── pages/              # 페이지 컴포넌트
│   ├── login/         # 로그인
│   ├── signup/        # 회원가입
│   ├── career-form/   # 진로 탐색 폼
│   ├── results/       # 추천 결과
│   └── history/       # 추천 히스토리
├── types/             # TypeScript 타입
└── lib/              # 유틸리티 함수
```

## 🎯 주요 기능

### 핵심 기능
- **JWT 인증**: 토큰 기반 로그인/회원가입
- **진로 탐색 폼**: MBTI, 홀랜드, 직업가치관 입력
- **AI 직업 추천**: 실시간 추천 결과 조회
- **추천 관리**: 결과 저장, 삭제, 히스토리 관리
- **반응형 UI**: 모바일/태블릿/데스크톱 최적화
- **실시간 검증**: 폼 입력 유효성 검사

### 페이지 구성
- `/` - 메인 홈페이지
- `/login` - 로그인
- `/signup` - 회원가입
- `/career-form` - 진로 탐색 폼
- `/results` - 추천 결과 목록
- `/results/:id` - 추천 결과 상세
- `/history` - 추천 히스토리
- `/me` - 마이페이지

### API 연동 현황
- ✅ 회원 관리 (가입, 로그인, 프로필)
- ✅ 진로 정보 (저장, 조회, 수정)
- ✅ 직업 추천 (생성, 조회, 삭제)
- ✅ 옵션 조회 (MBTI, 홀랜드, 직업가치관)
- 🚧 친구 시스템 (UI 완료, API 대기)
- 🚧 미션 시스템 (UI 완료, API 대기)

```

## 📊 데이터 플로우

### 인증 플로우
```
로그인 → JWT 토큰 저장 → API 요청 헤더 자동 설정 → 인증된 요청
```

### 추천 플로우
```
진로폼 입력 → 추천정보 저장 → AI 추천 요청 → 결과 표시 → 히스토리 저장
```

### 상태 관리 구조
```typescript
// TanStack Query 사용 예시
const { data: user, isLoading } = useQuery({
  queryKey: ['user'],
  queryFn: fetchUser
});

// 커스텀 훅 사용
const { login, logout, isAuthenticated } = useAuth();
const { create, delete: deleteRec } = useJobRecommendation();
```

## 🎨 UI 컴포넌트 시스템

### 디자인 토큰
- **컬러**: Purple 기반 브랜드 컬러
- **타이포그래피**: 시스템 폰트 스택
- **스페이싱**: TailwindCSS 8px 기반 시스템
- **브레이크포인트**: Mobile(640px), Tablet(768px), Desktop(1024px)

### Radix UI 컴포넌트
- Alert Dialog, Avatar, Checkbox
- Dropdown Menu, Label, Radio Group
- Select, Button, Card, Input

### 반응형 디자인
```css
/* Mobile First 접근법 */
.container {
  @apply px-4 sm:px-6 lg:px-8;
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3;
}
```

## 🔧 성능 최적화

### 빌드 최적화
- **Vite**: 빠른 HMR 및 번들링
- **Tree Shaking**: 사용하지 않는 코드 제거
- **Code Splitting**: 라우트별 청크 분할
- **Asset Optimization**: 이미지 및 정적 자산 최적화

### 런타임 최적화
- **TanStack Query**: 서버 상태 캐싱
- **React.memo**: 불필요한 리렌더링 방지
- **Lazy Loading**: 페이지별 지연 로딩
- **Debounced Input**: 검색 입력 최적화
```

## 🔗 연동 서비스

### Spring Boot 백엔드 연동
- **Base URL**: http://localhost:8080
- **인증**: JWT Bearer Token
- **자동 토큰 관리**: Axios 인터셉터
- **에러 처리**: 401 응답 시 자동 로그아웃

### AI 추천 서비스 연동
- 백엔드를 통한 간접 연동
- 실시간 추천 결과 수신
- 추천 이유 및 상세 정보 표시

### API 엔드포인트
```typescript
// 주요 API 호출 예시
POST /api/members/login
GET /api/recommendation-info
POST /api/job-recommendations
GET /api/job-recommendations
DELETE /api/job-recommendations/{id}
```