# What Will You Be - 서비스 전체 아키텍처

## 🏗️ 전체 시스템 구조

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              클라이언트 계층                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Frontend (React + TypeScript + Vite)                                      │
│  ├── 포트: 3000                                                              │
│  ├── UI 컴포넌트: Radix UI + Tailwind CSS                                   │
│  ├── 상태관리: TanStack Query                                                │
│  ├── 라우팅: React Router DOM                                               │
│  └── API 통신: Axios                                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │ HTTP/REST API
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              백엔드 API 계층                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Spring Boot Backend (Java)                                                │
│  ├── 포트: 8080                                                              │
│  ├── 인증/인가: JWT + Spring Security                                        │
│  ├── 데이터베이스: MySQL (포트: 3306)                                         │
│  ├── ORM: JPA/Hibernate                                                     │
│  └── 주요 엔드포인트:                                                          │
│      ├── /api/members (회원 관리)                                            │
│      ├── /api/job-recommendations (직업 추천)                               │
│      ├── /api/recommendation-info (추천 정보)                               │
│      └── /api/options (옵션 관리)                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │ HTTP API 호출
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AI 추천 엔진 계층                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  Django Recommender Service (Python)                                       │
│  ├── 포트: 8000                                                              │
│  ├── 프레임워크: Django REST Framework                                       │
│  ├── 데이터베이스: SQLite                                                     │
│  ├── AI/ML 스택:                                                             │
│  │   ├── OpenAI GPT-4o-mini (텍스트 생성)                                   │
│  │   ├── OpenAI text-embedding-3-small (임베딩)                            │
│  │   ├── FAISS (벡터 검색)                                                   │
│  │   └── RAG (Retrieval-Augmented Generation)                              │
│  └── 주요 기능:                                                               │
│      ├── 벡터 임베딩 생성                                                      │
│      ├── 유사도 기반 직업 검색                                                 │
│      ├── GPT 기반 추천 이유 생성                                              │
│      └── 개인화된 직업 정보 재구성                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │ API 호출
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              외부 서비스 계층                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  OpenAI API Services                                                       │
│  ├── GPT-4o-mini: 텍스트 생성 및 추천 이유 생성                              │
│  ├── text-embedding-3-small: 텍스트 벡터화                                  │
│  └── 사용량 제한: 토큰 기반 과금                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 데이터 플로우

### 1. 사용자 직업 추천 요청 플로우

```
[사용자] 
    │ 1. 로그인 + 추천 요청
    ▼
[Frontend React App]
    │ 2. JWT 토큰과 함께 API 호출
    ▼
[Spring Boot Backend]
    │ 3. JWT 검증 및 사용자 정보 조회
    │ 4. Python API 호출 (member_id 전달)
    ▼
[Django Recommender]
    │ 5. 사용자 텍스트 임베딩 생성
    │ 6. FAISS 벡터 검색으로 유사 직업 찾기
    │ 7. GPT로 추천 이유 생성
    │ 8. GPT로 개인화된 직업 정보 재구성
    ▼
[OpenAI API]
    │ 9. 임베딩 벡터 반환
    │ 10. 생성된 텍스트 반환
    ▼
[Django Recommender]
    │ 11. 추천 결과 JSON 응답
    ▼
[Spring Boot Backend]
    │ 12. 추천 결과 DB 저장
    │ 13. 클라이언트에 응답
    ▼
[Frontend React App]
    │ 14. 추천 결과 UI 렌더링
    ▼
[사용자]
```

## 🗄️ 데이터베이스 구조

### Spring Boot Backend (MySQL)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Member      │    │JobRecommendations│   │RecommendationInfo│
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │◄──┤ member_id (FK)  │    │ id (PK)         │
│ username        │    │ id (PK)         │    │ member_id (FK)  │
│ password        │    │ job_name        │    │ interests       │
│ email           │    │ job_sum         │    │ skills          │
│ name            │    │ way             │    │ values          │
│ birth_date      │    │ major           │    │ personality     │
│ gender          │    │ certificate     │    │ holland_code    │
│ created_at      │    │ pay             │    │ mbti            │
│ updated_at      │    │ job_prospect    │    │ created_at      │
└─────────────────┘    │ knowledge       │    │ updated_at      │
                       │ job_environment │    └─────────────────┘
                       │ job_values      │
                       │ created_at      │
                       │ updated_at      │
                       └─────────────────┘
```

### Django Recommender (SQLite)
```
┌─────────────────┐
│ Vector Store    │
├─────────────────┤
│ metadata.json   │ ← 직업 정보 메타데이터
│ vectorDB_index  │ ← FAISS 인덱스 파일
│ .faiss          │
└─────────────────┘
```

## 🔧 주요 기술 스택

### Frontend
- **React 19** + **TypeScript**: 모던 웹 개발
- **Vite**: 빠른 개발 서버 및 빌드
- **TanStack Query**: 서버 상태 관리
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **Radix UI**: 접근성 우선 컴포넌트

### Backend (Spring Boot)
- **Java 17** + **Spring Boot 3.x**
- **Spring Security**: JWT 기반 인증
- **JPA/Hibernate**: ORM
- **MySQL**: 관계형 데이터베이스
- **RestTemplate**: HTTP 클라이언트

### AI Recommender (Django)
- **Python 3.x** + **Django 4.x**
- **Django REST Framework**: API 개발
- **OpenAI API**: GPT-4o-mini, text-embedding-3-small
- **FAISS**: 벡터 유사도 검색
- **SQLite**: 경량 데이터베이스

## 🚀 배포 및 운영

### 개발 환경
```
Frontend:  localhost:3000
Backend:   localhost:8080
Recommender: localhost:8000
Database:  localhost:3306 (MySQL)
```

### 주요 설정
- **CORS**: 모든 오리진 허용 (개발용)
- **JWT**: 30분 만료
- **OpenAI**: API 키 기반 인증
- **Database**: 자동 스키마 업데이트

## 🔐 보안 고려사항

1. **JWT 토큰**: 사용자 인증 및 세션 관리
2. **CORS 정책**: 프로덕션에서는 특정 도메인만 허용 필요
3. **API 키 관리**: OpenAI API 키 환경변수 분리 필요
4. **데이터베이스**: 민감 정보 암호화 필요

## 📊 성능 최적화

1. **벡터 검색**: FAISS 인덱스로 빠른 유사도 검색
2. **캐싱**: 임베딩 결과 캐싱으로 API 호출 최소화
3. **배치 처리**: 다중 추천 요청 시 배치 처리
4. **연결 풀**: 데이터베이스 연결 풀 최적화

## 🔄 확장 가능성

1. **마이크로서비스**: 각 서비스 독립 배포 가능
2. **로드 밸런싱**: 다중 인스턴스 운영 가능
3. **데이터베이스 샤딩**: 사용자 증가 시 데이터 분산
4. **AI 모델 업그레이드**: 새로운 모델로 쉬운 교체