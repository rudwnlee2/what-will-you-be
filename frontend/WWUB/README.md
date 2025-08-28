# WWUB (What Will You Be) - Frontend

진로/대학/전공 추천 서비스의 프론트엔드 애플리케이션입니다.

## 🚀 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **TailwindCSS** - 스타일링
- **React Router** - 라우팅
- **TanStack Query** - 서버 상태 관리
- **Axios** - HTTP 클라이언트
- **Radix UI** - 접근성 있는 UI 컴포넌트

## 📁 프로젝트 구조

```
src/
├── app/                    # 페이지 컴포넌트들
│   ├── career-form/       # 진로 탐색 폼
│   ├── login/             # 로그인
│   └── signup/            # 회원가입
├── components/            # 재사용 가능한 컴포넌트
│   └── ui/               # UI 기본 컴포넌트
├── hooks/                # 커스텀 훅
│   ├── useAuth.ts        # 인증 관련
│   └── useRecommendation.ts # 추천 관련
├── services/             # API 서비스
│   └── api.ts           # API 클라이언트
├── types/               # TypeScript 타입 정의
│   └── api.ts          # API 관련 타입
├── constants/           # 상수 정의
│   └── options.ts      # 선택 옵션들
└── pages/              # 추가 페이지들
    └── results.tsx     # 결과 페이지
```

## 🔧 설치 및 실행

### 1. 의존성 설치
```bash
npm install
# 또는
yarn install
```

### 2. 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
```

### 3. 빌드
```bash
npm run build
# 또는
yarn build
```

## 🌐 주요 기능

### 1. 사용자 인증
- 회원가입 / 로그인
- JWT 토큰 기반 인증
- 자동 토큰 갱신

### 2. 진로 탐색
- 단계별 폼 작성
- MBTI, 홀란드 유형 선택
- 관심사, 취미, 가치관 입력
- 실시간 유효성 검증

### 3. 추천 시스템
- 백엔드 API와 연동
- 개인화된 진로 추천
- 결과 저장 및 조회

## 🔗 API 연동

### 백엔드 서버 설정
`src/services/api.ts`에서 백엔드 서버 주소를 설정합니다:

```typescript
const API_BASE_URL = 'http://localhost:8080';
```

### 주요 API 엔드포인트
- `POST /api/members/signup` - 회원가입
- `POST /api/members/login` - 로그인
- `GET /api/members/me` - 프로필 조회
- `PUT /api/recommendation-info` - 진로 정보 저장
- `GET /api/recommendation-info` - 진로 정보 조회

## 🎨 UI 컴포넌트

Radix UI를 기반으로 한 재사용 가능한 컴포넌트들:
- Button, Input, Label
- Select, Checkbox, Textarea
- Card, Dialog 등

## 📱 반응형 디자인

TailwindCSS를 사용하여 모바일부터 데스크톱까지 반응형 디자인을 구현했습니다.

## 🔒 보안

- JWT 토큰 자동 관리
- 인증이 필요한 페이지 보호
- XSS 방지를 위한 입력 검증

## 🚀 배포

### Vercel 배포
```bash
npm run build
vercel --prod
```

### Netlify 배포
```bash
npm run build
# dist 폴더를 Netlify에 업로드
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.