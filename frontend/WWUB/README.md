# WWUB (What Will You Be) - Frontend

진로/대학/전공 추천 서비스의 프론트엔드 애플리케이션입니다.

## 📋 프로젝트 개요

**What Will You Be**는 사용자의 성향, MBTI, 홀랜드 유형 등을 분석하여 맞춤형 직업을 추천하는 시스템의 프론트엔드입니다.

### 주요 기능
- ✅ 회원가입 / 로그인 (JWT 인증)
- ✅ 개인 프로필 관리 및 수정
- ✅ 진로 탐색 정보 입력 (MBTI, 홀랜드, 직업가치관 등)
- ✅ **AI 직업 추천 결과 조회 및 관리**
- ✅ 추천 결과 상세 보기 및 삭제
- ✅ 추천 히스토리 관리
- ✅ **반응형 디자인** (모바일, 태블릿, 데스크톱)
- ✅ **실시간 폼 유효성 검증**
- ✅ **로딩 상태 관리 및 에러 처리**
- 🚧 친구 시스템 (UI 구현 완료, API 연동 대기)
- 🚧 미션 시스템 (UI 구현 완료, API 연동 대기)

## 🛠 기술 스택

### 핵심 기술
- **React 19.1.0** - 최신 React 버전
- **TypeScript 5.8.3** - 타입 안전성
- **Vite 7.0.0** - 빠른 빌드 도구
- **React Router DOM 7.6.3** - 클라이언트 사이드 라우팅

### 상태 관리 & API
- **TanStack Query 5.84.1** - 서버 상태 관리 및 캐싱
- **Axios 1.11.0** - HTTP 클라이언트
- **Custom Hooks** - 비즈니스 로직 분리

### UI & 스타일링
- **TailwindCSS 3.4.x** - 유틸리티 기반 CSS 프레임워크
- **Radix UI** - 접근성 있는 헤드리스 UI 컴포넌트
  - Alert Dialog, Avatar, Checkbox, Dropdown Menu 등
- **Lucide React 0.536.0** - 아이콘 라이브러리
- **Class Variance Authority** - 조건부 스타일링

### 개발 도구
- **ESLint 9.30.1** - 코드 품질 관리
- **Prettier 3.6.2** - 코드 포맷팅
- **TypeScript ESLint** - TypeScript 린팅
- **Vite TypeScript Paths** - 절대 경로 지원

## 🏗 프로젝트 구조

```
src/
├── api/                    # API 클라이언트 및 서비스
│   ├── auth.ts            # 인증 관련 API
│   ├── axiosInstance.ts   # Axios 인스턴스 설정
│   ├── friends.ts         # 친구 관련 API (개발 중)
│   ├── jobs.ts            # 직업 추천 API
│   ├── members.ts         # 회원 관리 API
│   ├── mission.ts         # 미션 관련 API (개발 중)
│   ├── options.ts         # 옵션 조회 API
│   └── recommendations.ts # 추천 정보 API
├── app/                   # 앱 설정 및 라우팅
│   ├── about/            # 소개 페이지 컴포넌트
│   └── app.tsx           # 메인 앱 컴포넌트
├── components/            # 재사용 가능한 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   │   ├── pagination.tsx
│   │   ├── site-footer.tsx
│   │   ├── site-header.tsx
│   │   └── WipModal.tsx  # 개발 중 기능 모달
│   └── ui/               # 기본 UI 컴포넌트 (Radix UI 기반)
│       ├── alert-dialog.tsx
│       ├── avatar.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── radio-group.tsx
│       ├── select.tsx
│       └── textarea.tsx
├── constants/             # 상수 정의
│   └── options.ts        # MBTI, 홀랜드, 직업가치관 옵션
├── hooks/                # 커스텀 훅
│   ├── useAuth.ts        # 인증 관련 훅
│   ├── useJobRecommendation.ts # 직업 추천 훅
│   ├── useRecommendation.ts    # 추천 정보 훅
│   ├── useUser.ts        # 사용자 정보 훅
│   └── useWipModal.ts    # WIP 모달 훅
├── lib/                  # 유틸리티 라이브러리
│   ├── api.ts           # API 헬퍼 함수
│   └── utils.ts         # 공통 유틸리티
├── pages/               # 페이지 컴포넌트
│   ├── about/          # 소개 페이지
│   ├── career-form/    # 진로 탐색 폼
│   ├── community/      # 커뮤니티 페이지
│   ├── contact/        # 문의 페이지
│   ├── friends/        # 친구 관리 (개발 중)
│   ├── history/        # 추천 히스토리
│   ├── loading/        # 로딩 페이지
│   ├── login/          # 로그인
│   ├── me/             # 마이페이지
│   │   └── edit/       # 프로필 수정
│   ├── missions/       # 미션 페이지 (개발 중)
│   ├── privacy/        # 개인정보처리방침
│   ├── results/        # 추천 결과
│   │   └── detail/     # 추천 결과 상세
│   ├── signup/         # 회원가입
│   ├── terms/          # 이용약관
│   └── Homepage.tsx    # 메인 홈페이지
├── types/              # TypeScript 타입 정의
│   ├── api.ts         # API 관련 타입
│   ├── job.types.ts   # 직업 관련 타입
│   ├── options.types.ts # 옵션 관련 타입
│   ├── recommendation.types.ts # 추천 관련 타입
│   └── user.types.ts  # 사용자 관련 타입
├── App.css            # 전역 스타일
├── app.tsx           # 앱 진입점
├── index.css         # TailwindCSS 설정
├── main.tsx          # React 앱 마운트
└── vite-env.d.ts     # Vite 환경 타입
```

## 🚀 시작하기

### 사전 요구사항

- **Node.js 18** 이상
- **npm** 또는 **yarn**
- **백엔드 서버** (http://localhost:8080)

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd what-will-you-be/frontend/WWUB
   ```

2. **의존성 설치**
   ```bash
   npm install
   # 또는
   yarn install
   ```

3. **환경 변수 설정**
   
   `.env` 파일을 생성하고 다음 내용을 추가하세요:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   # 또는
   yarn dev
   ```

   애플리케이션은 기본적으로 `http://localhost:5173`에서 실행됩니다.

5. **빌드**
   ```bash
   npm run build
   # 또는
   yarn build
   ```

## 📡 API 연동

### 백엔드 서버 연결
- **기본 URL**: `http://localhost:8080`
- **인증 방식**: JWT Bearer Token
- **자동 토큰 관리**: Axios 인터셉터를 통한 자동 헤더 설정

### 주요 API 엔드포인트 연동 현황

#### ✅ 완료된 API 연동
- `POST /api/members/signup` - 회원가입
- `POST /api/members/login` - 로그인
- `GET /api/members/check-loginid/{loginId}` - 아이디 중복 확인
- `GET /api/members/me` - 내 정보 조회
- `PATCH /api/members/me` - 내 정보 수정
- `GET /api/recommendation-info` - 추천 정보 조회
- `PUT /api/recommendation-info` - 추천 정보 저장
- `POST /api/job-recommendations` - 직업 추천 생성
- `GET /api/job-recommendations` - 추천 목록 조회
- `GET /api/job-recommendations/{id}` - 추천 상세 조회
- `DELETE /api/job-recommendations/{id}` - 추천 삭제
- `GET /api/options/genders` - 성별 옵션 조회
- `GET /api/options/recommendations` - 추천 옵션 조회

#### 🚧 개발 중 (API만 작성됨)
- 친구 관리 관련 API
- 미션 시스템 관련 API

## 🎨 UI/UX 설계

### 디자인 시스템
- **컬러 팔레트**: Purple 기반 브랜딩
- **타이포그래피**: 시스템 폰트 스택
- **간격**: TailwindCSS 스페이싱 시스템
- **반응형**: Mobile-first 접근법

### 컴포넌트 아키텍처
- **Radix UI**: 접근성과 키보드 내비게이션 지원
- **Compound Components**: 복합 컴포넌트 패턴
- **Controlled Components**: React 상태 기반 폼 관리

### 주요 UI 컴포넌트
```typescript
// 버튼 컴포넌트 예시
<Button 
  variant="default" | "outline" | "ghost"
  size="sm" | "default" | "lg"
  disabled={boolean}
>
  버튼 텍스트
</Button>

// 카드 컴포넌트 예시
<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
  </CardHeader>
  <CardContent>
    내용
  </CardContent>
</Card>
```

## 🔐 인증 시스템

### JWT 토큰 관리
- **저장 위치**: localStorage
- **자동 갱신**: Axios 인터셉터
- **토큰 만료 처리**: 401 응답 시 자동 로그아웃

### 인증 플로우
```typescript
// useAuth 훅 사용 예시
const { 
  login, 
  signup, 
  logout, 
  user, 
  isAuthenticated,
  isLoginLoading 
} = useAuth();

// 로그인
login({ loginId: 'user123', password: 'password' });

// 인증 상태 확인
if (isAuthenticated) {
  // 인증된 사용자만 접근 가능한 컨텐츠
}
```

### 보호된 라우트
- 인증이 필요한 페이지는 자동으로 로그인 페이지로 리다이렉트
- `useAuth` 훅을 통한 인증 상태 확인

## 📊 상태 관리

### TanStack Query 활용
- **서버 상태 캐싱**: API 응답 자동 캐싱
- **백그라운드 업데이트**: 데이터 자동 동기화
- **낙관적 업데이트**: 사용자 경험 향상
- **에러 처리**: 통합된 에러 상태 관리

### 커스텀 훅 구조
```typescript
// useJobRecommendation 훅 예시
export const useJobRecommendation = () => {
  const { 
    create,        // 추천 생성
    delete: deleteRecommendation, // 추천 삭제
    isCreating,    // 생성 로딩 상태
    isDeleting     // 삭제 로딩 상태
  } = useJobRecommendationMutations();

  return {
    create,
    delete: deleteRecommendation,
    isCreating,
    isDeleting
  };
};
```

## 🎯 주요 기능 상세

### 1. 회원 관리
- **회원가입**: 실시간 유효성 검증, 아이디 중복 확인
- **로그인**: JWT 토큰 기반 인증
- **프로필 관리**: 개인정보 수정, 회원 탈퇴

### 2. 진로 탐색 폼
- **단계별 입력**: 장래희망, MBTI, 홀랜드 유형 등
- **실시간 저장**: 임시 저장 기능
- **유효성 검증**: 필수 항목 체크
- **반응형 디자인**: 모바일 최적화

### 3. 추천 결과 관리
- **카드 기반 UI**: 플립 카드 애니메이션
- **상세 정보**: 직업별 세부 정보 제공
- **결과 삭제**: 개별 추천 결과 삭제 가능
- **히스토리**: 과거 추천 결과 조회

### 4. 로딩 및 에러 처리
- **로딩 상태**: 각 API 호출별 로딩 표시
- **에러 처리**: 사용자 친화적 에러 메시지
- **재시도 로직**: 실패한 요청 재시도

## 🚧 개발 중인 기능

### 친구 시스템 (UI 완료, API 연동 대기)
- **친구 목록**: 온라인/오프라인 상태 표시
- **친구 요청**: 보내기/받기 기능
- **친구 검색**: 아이디 기반 검색
- **친구 프로필**: 진로 정보 공유

**구현된 UI 컴포넌트:**
```typescript
// 친구 목록 페이지
- 친구 요청 관리 (수락/거절)
- 친구 추가 (검색 기능)
- 친구 목록 (온라인 상태 표시)
- 친구와 미션 생성 기능
```

### 미션 시스템 (UI 완료, API 연동 대기)
- **개인 미션**: 진로별 개인 과제
- **그룹 미션**: 친구와 함께하는 미션
- **진행 상황**: 미션 완료 상태 관리
- **미션 생성**: AI 기반 미션 자동 생성

**구현된 기능:**
```typescript
// 미션 관리 함수들 (주석 처리됨)
- addMission(): 개인 미션 추가
- addFriendMission(): 친구 미션 추가
- updateMissionStatus(): 미션 상태 업데이트
- deleteMission(): 미션 삭제
```

## 🔧 개발 환경 설정

### ESLint 설정
```javascript
// eslint.config.js
export default [
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      'eslint:recommended',
      '@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'prettier'
    ],
    rules: {
      // 커스텀 규칙
    }
  }
];
```

### Prettier 설정
```javascript
// .prettierrc.cjs
module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2
};
```

### TailwindCSS 설정
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 커스텀 컬러 팔레트
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        // ...
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
```

## 📱 반응형 디자인

### 브레이크포인트
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

### 반응형 구현 예시
```typescript
// TailwindCSS 클래스 사용
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4 
  p-4 
  sm:p-6 
  lg:p-8
">
  {/* 반응형 그리드 */}
</div>
```

## 🧪 테스트 및 품질 관리

### 코드 품질
- **TypeScript**: 타입 안전성 보장
- **ESLint**: 코드 품질 검사
- **Prettier**: 일관된 코드 포맷팅

### 실행 스크립트
```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 린팅 검사
npm run lint

# 코드 포맷팅
npm run format

# 빌드 미리보기
npm run preview
```

## 🚀 배포

### 빌드 최적화
- **Vite**: 빠른 빌드 및 HMR
- **Tree Shaking**: 사용하지 않는 코드 제거
- **Code Splitting**: 라우트별 코드 분할
- **Asset Optimization**: 이미지 및 정적 자산 최적화

### 배포 환경 설정
```bash
# 프로덕션 빌드
npm run build

# dist 폴더가 생성됨
# 정적 파일 서버에 배포 가능
```

### 환경별 설정
```env
# 개발 환경
VITE_API_BASE_URL=http://localhost:8080

# 프로덕션 환경  
VITE_API_BASE_URL=https://api.whatwillyoube.com
```

## 📝 개발 현황 및 계획

### ✅ 완료된 기능
- 완전한 회원 관리 시스템
- JWT 기반 인증/인가
- 진로 탐색 폼 (단일 페이지)
- AI 직업 추천 시스템 연동
- 추천 결과 관리 (조회, 삭제, 상세보기)
- 반응형 UI/UX 디자인
- 실시간 폼 유효성 검증
- 로딩 상태 및 에러 처리
- TanStack Query 기반 상태 관리
- TypeScript 타입 안전성

### 🚧 진행 예정
- [ ] 친구 시스템 API 연동
- [ ] 미션 시스템 API 연동
- [ ] 실시간 알림 시스템
- [ ] PWA (Progressive Web App) 지원
- [ ] 다크 모드 지원
- [ ] 국제화 (i18n) 지원

### 🔧 기술 개선 계획
- [ ] 단위 테스트 추가 (Jest, React Testing Library)
- [ ] E2E 테스트 (Playwright)
- [ ] 성능 최적화 (React.memo, useMemo)
- [ ] 접근성 개선 (ARIA, 키보드 내비게이션)
- [ ] SEO 최적화
- [ ] 번들 크기 최적화
- [ ] 캐싱 전략 개선

## 🔍 주요 파일 설명

### 핵심 설정 파일
- `vite.config.ts`: Vite 빌드 도구 설정
- `tailwind.config.js`: TailwindCSS 설정
- `tsconfig.json`: TypeScript 컴파일러 설정
- `eslint.config.js`: ESLint 규칙 설정

### API 관련 파일
- `src/api/axiosInstance.ts`: Axios 인스턴스 및 인터셉터 설정
- `src/api/auth.ts`: 토큰 관리 헬퍼 함수
- `src/hooks/useAuth.ts`: 인증 관련 비즈니스 로직

### 타입 정의 파일
- `src/types/api.ts`: 백엔드 API 타입 정의
- `src/types/user.types.ts`: 사용자 관련 타입
- `src/types/job.types.ts`: 직업 추천 관련 타입

## 📞 문의 및 지원

- **이슈 리포트**: GitHub Issues
- **기능 요청**: GitHub Discussions  
- **문서**: 프로젝트 Wiki

---

**개발팀** | What Will You Be Project  
**최종 업데이트** | 2024년 12월 (친구/미션 시스템 UI 완성)