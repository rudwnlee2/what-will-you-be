# What Will You Be 🎯

AI 기반 맞춤형 진로 추천 시스템

## 📋 프로젝트 개요

**What Will You Be**는 사용자의 성향, MBTI, 홀랜드 유형, 직업가치관 등을 종합 분석하여 AI 기반 맞춤형 직업을 추천하는 웹 서비스입니다.

### 주요 특징
- 🤖 **AI 기반 직업 추천**: Python + FAISS 벡터 검색 엔진
- 🔐 **JWT 인증 시스템**: 안전한 사용자 인증 및 세션 관리
- 📱 **반응형 웹 디자인**: 모바일, 태블릿, 데스크톱 최적화
- 🎨 **현대적 UI/UX**: React 19 + TailwindCSS + Radix UI
- 🚀 **마이크로서비스 아키텍처**: 백엔드, 프론트엔드, AI 서비스 분리

## 🏗 시스템 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │  AI Recommender │
│   (React 19)    │◄──►│  (Spring Boot)  │◄──►│   (Django)      │
│   Port: 5173    │    │   Port: 8080    │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   TailwindCSS   │    │     MySQL       │    │  FAISS Vector   │
│   Radix UI      │    │   Database      │    │    Database     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠 기술 스택

### Frontend
- **React 19.1.0** - 최신 React 버전
- **TypeScript 5.8.3** - 타입 안전성
- **Vite 7.0.0** - 빠른 빌드 도구
- **TailwindCSS 3.4.x** - 유틸리티 CSS 프레임워크
- **Radix UI** - 접근성 있는 헤드리스 컴포넌트
- **TanStack Query 5.84.1** - 서버 상태 관리
- **React Router DOM 7.6.3** - 클라이언트 라우팅

### Backend
- **Java 17** - LTS 버전
- **Spring Boot 3.5.0** - 최신 Spring Boot
- **Spring Security 6.x** - 인증/인가
- **Spring Data JPA** - ORM
- **MySQL 8.0** - 관계형 데이터베이스
- **JWT** - 토큰 기반 인증
- **Gradle 8.14.2** - 빌드 도구

### AI Recommender
- **Python 3.x** - AI/ML 개발 언어
- **Django** - 웹 프레임워크
- **FAISS** - 벡터 유사도 검색
- **Sentence Transformers** - 텍스트 임베딩
- **SQLite** - 경량 데이터베이스

## 📁 프로젝트 구조

```
what-will-you-be/
├── backend/                    # Spring Boot 백엔드
│   ├── src/main/java/         # Java 소스 코드
│   │   └── com/example/whatwillyoube/
│   │       ├── config/        # 설정 클래스
│   │       ├── controller/    # REST API 컨트롤러
│   │       ├── domain/        # JPA 엔티티
│   │       ├── dto/          # 데이터 전송 객체
│   │       ├── repository/    # 데이터 접근 계층
│   │       ├── service/       # 비즈니스 로직
│   │       └── security/      # 보안 설정
│   ├── src/test/             # 테스트 코드
│   ├── build.gradle          # Gradle 빌드 설정
│   └── README.md            # 백엔드 문서
├── frontend/WWUB/            # React 프론트엔드
│   ├── src/
│   │   ├── api/             # API 클라이언트
│   │   ├── components/      # 재사용 컴포넌트
│   │   ├── hooks/           # 커스텀 훅
│   │   ├── pages/           # 페이지 컴포넌트
│   │   └── types/           # TypeScript 타입
│   ├── package.json         # npm 의존성
│   └── README.md           # 프론트엔드 문서
├── recommender/             # Django AI 추천 서비스
│   ├── recommend_app/       # 추천 앱
│   │   ├── services/       # AI 추천 로직
│   │   └── serializers/    # API 직렬화
│   ├── data/               # 벡터 데이터베이스
│   └── manage.py          # Django 관리 스크립트
├── docs/                   # 프로젝트 문서
│   └── erd.png            # 데이터베이스 ERD
└── README.md              # 메인 프로젝트 문서
```

## 🎯 주요 기능

### ✅ 구현 완료
- **회원 관리**: 회원가입, 로그인, 프로필 수정
- **JWT 인증**: 토큰 기반 보안 인증
- **진로 탐색 폼**: MBTI, 홀랜드, 직업가치관 입력
- **AI 직업 추천**: Python 기반 벡터 유사도 검색
- **추천 결과 관리**: 조회, 상세보기, 삭제, 히스토리
- **반응형 UI**: 모바일/태블릿/데스크톱 최적화
- **실시간 유효성 검증**: 폼 입력 검증
- **로딩 상태 관리**: 사용자 경험 최적화
