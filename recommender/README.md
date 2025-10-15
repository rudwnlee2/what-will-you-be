# What Will You Be - AI Recommender

AI 기반 직업 추천 엔진 서비스

## 📋 프로젝트 개요

**AI Recommender**는 사용자의 성향, MBTI, 홀랜드 유형, 직업가치관을 분석하여 FAISS 벡터 검색과 OpenAI GPT를 활용한 맞춤형 직업 추천 서비스입니다.

## 🛠 기술 스택

### 사용 언어
- Python 3.x

### 프레임워크
- Django 5.x
- Django REST Framework

### AI/ML 라이브러리
- FAISS (벡터 유사도 검색)
- OpenAI API (GPT-4o-mini, text-embedding-3-small)
- NumPy (수치 연산)

### 데이터베이스
- SQLite (경량 데이터베이스)
- FAISS Vector Database (벡터 저장소)

### 개발 도구
- python-dotenv (환경변수 관리)
- CORS Headers (Cross-Origin 요청 처리)

## 📊 시스템 구조도

### AI 추천 프로세스
```
사용자 입력 → 텍스트 임베딩 → FAISS 벡터 검색 → 직업 메타데이터 매핑 → GPT 재구성 → 최종 추천
```

### 서비스 아키텍처
```
recommend_app/
├── services/
│   ├── recommendation.py    # 추천 프로세스 총괄
│   ├── engine.py           # OpenAI API 연동
│   └── vector_store.py     # FAISS 벡터 검색
├── serializers/
│   ├── user_input.py       # 입력 데이터 검증
│   └── recommend_output.py # 출력 데이터 직렬화
└── views.py               # REST API 엔드포인트
```

## 🎯 주요 기능

### 핵심 기능
- **벡터 임베딩**: OpenAI text-embedding-3-small 모델 활용
- **유사도 검색**: FAISS 인덱스 기반 고속 벡터 검색
- **직업 메타데이터 매핑**: job_id 기반 직업 정보 연결
- **AI 재구성**: GPT-4o-mini를 통한 추천 이유 및 직업 정보 보완
- **웹 검색 보완**: 부족한 직업 정보 자동 보완
- **REST API**: Spring Boot 백엔드와 JSON 통신

### API 엔드포인트
- `POST /api/recommend/` - 직업 추천 요청

```

## 📁 데이터 구조

### FAISS 벡터 데이터베이스
- `data/vectorDB_index.faiss` - FAISS 인덱스 파일
- `data/metadata.json` - 직업 메타데이터 (사용자 출력용)
- `data/chunks_meta.json` - 벡터-직업 매핑 정보

### 벡터 데이터베이스 구축
```bash
# 메타데이터로부터 FAISS 인덱스 생성
python scripts/build_faiss_from_metadata.py
```

## 🔧 성능 최적화

### 캐싱 전략
- FAISS 인덱스 메모리 캐싱 (서버 시작 시 1회 로드)
- 메타데이터 캐싱으로 디스크 I/O 최소화

### 검색 최적화
- 단계적 확장 검색 (step=10)
- 중복 직업 제거 알고리즘
- top_jobs 개수 제한으로 응답 시간 단축

## 🔗 연동 서비스

### Spring Boot 백엔드 연동
- RestClient를 통한 HTTP 통신
- JWT 토큰 기반 인증 (향후 구현 예정)
- JSON 데이터 교환

### CORS 설정
```python
CORS_ALLOW_ALL_ORIGINS = True
CSRF_TRUSTED_ORIGINS = [
    "http://127.0.0.1:8080",  # Spring Boot
    "http://localhost:3000",   # React Frontend
]
```