# What Will You Be - Backend

진로 추천 시스템의 백엔드 API 서버입니다.

## 📋 프로젝트 개요

**What Will You Be**는 사용자의 성향, MBTI, 홀랜드 유형 등을 분석하여 맞춤형 직업을 추천하는 시스템입니다.

### 주요 기능
- 회원가입 / 로그인 (JWT 인증)
- 개인 프로필 관리
- 직업 추천 정보 입력 및 관리
- **직업 추천 API (Python API 연동 완료)**
- 직업 추천 결과 저장 및 조회
- 친구 관계 관리
- 개인/그룹 미션 시스템

## 🛠 기술 스택

- **Java 17**
- **Spring Boot 3.x**
- **Spring Security**
- **JPA (Hibernate)**
- **MySQL 8.0**
- **JWT (JSON Web Token)**
- **RestClient** (Python API 연동)
- **Gradle**

## 📊 데이터베이스 ERD

![ERD](../docs/erd.png)

> **참고**: 미션(Mission) 관련 테이블들은 JPA의 `@Inheritance(strategy = InheritanceType.JOINED)` 전략을 사용하여 구현되었습니다.

## 🚀 시작하기

### 사전 요구사항

- Java 17 이상
- MySQL 8.0
- Gradle
- Python API 서버 (http://127.0.0.1:8000)

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd what-will-you-be/backend
   ```

2. **데이터베이스 설정**
   ```sql
   CREATE DATABASE what_will_you_be;
   ```

3. **애플리케이션 설정**
   
   `src/main/resources/application.yml` 파일에서 데이터베이스 연결 정보를 확인/수정하세요:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://127.0.0.1:3306/what_will_you_be?useSSL=false&useUnicode=true&serverTimezone=Asia/Seoul
       username: root
       password: 
   ```

4. **애플리케이션 실행**
   ```bash
   ./gradlew bootRun
   ```

서버는 기본적으로 `http://localhost:8080`에서 실행됩니다.

## 📡 API 엔드포인트

### 회원 관리
- `POST /api/members/signup` - 회원가입
- `GET /api/members/check-loginid/{loginId}` - 아이디 중복 확인
- `POST /api/members/login` - 로그인
- `GET /api/members/me` - 내 정보 조회
- `PATCH /api/members/me` - 내 정보 수정
- `DELETE /api/members/me` - 회원 탈퇴

### 추천 정보 관리
- `GET /api/recommendation-info` - 추천 정보 조회
- `PUT /api/recommendation-info` - 추천 정보 등록/수정

### 직업 추천
- `POST /api/job-recommendations` - 직업 추천 생성 (Python API 연동)
- `GET /api/job-recommendations` - 내 직업 추천 목록 조회
- `GET /api/job-recommendations/{recommendationId}` - 직업 추천 상세 조회
- `DELETE /api/job-recommendations/{recommendationId}` - 직업 추천 삭제

### 옵션 조회
- `GET /api/options/genders` - 성별 옵션 조회
- `GET /api/options/recommendations` - 추천 관련 옵션 조회 (Holland, MBTI, JobValue)

## 🔐 인증

JWT 토큰 기반 인증을 사용합니다.

### 로그인 후 토큰 사용
1. 로그인 API 호출 시 응답 헤더의 `Authorization` 필드에서 토큰 획득
2. 이후 API 요청 시 헤더에 토큰 포함:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

### 보호된 엔드포인트
- `/api/members/me` (GET, PATCH, DELETE)
- `/api/recommendation-info` (GET, PUT)
- `/api/job-recommendations` (POST, GET, DELETE)

## 🏗 프로젝트 구조

```
src/main/java/com/example/whatwillyoube/whatwillyoube_backend/
├── config/          # 설정 클래스
├── controller/      # REST 컨트롤러
├── domain/          # 엔티티 클래스
├── dto/            # 데이터 전송 객체
├── interceptor/    # 인터셉터
├── repository/     # JPA 리포지토리
├── service/        # 비즈니스 로직
└── util/           # 유틸리티 클래스
```

## 🗃 주요 엔티티

### 회원 (Member)
- 기본 회원 정보 (아이디, 비밀번호, 이름, 이메일 등)
- 생년월일, 성별, 전화번호, 학교 정보

### 추천 정보 (RecommendationInfo)
- 꿈과 꿈을 갖게 된 이유
- 관심사, 취미, 좋아하는 과목
- MBTI, 홀랜드 유형, 직업 가치관

### 직업 추천 (JobRecommendations)
- 직업명, 직업 요약, 진로 방법
- 관련 전공, 필요 자격증, 예상 연봉
- 직업 전망, 필요 지식, 근무 환경
- 직업 가치관, 추천 이유

### 미션 시스템
- **Missions** (추상 클래스)
  - **IndividualMission** - 개인 미션
  - **GroupMission** - 그룹 미션
- **MissionProgress** - 미션 진행 상황

### 친구 관계 (Friend)
- 친구 초대 및 수락/거절 시스템
- 복합키 사용 (fromMemberId, toMemberId)

## 🔧 개발 환경 설정

### 데이터베이스 초기화
현재 `ddl-auto: validate` 설정으로 되어 있습니다. 개발 시에는 다음과 같이 변경할 수 있습니다:

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: create-drop  # 또는 update
```

### 로깅 설정
SQL 쿼리 로깅이 활성화되어 있습니다:
```yaml
spring:
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true
```

## 🧪 테스트

```bash
./gradlew test
```

## 🐍 Python API 연동

직업 추천 기능은 별도의 Python API 서버와 연동됩니다.

### Python API 요구사항
- **URL**: `http://127.0.0.1:8000/api/recommend/`
- **Method**: POST
- **Content-Type**: application/json

### 요청 데이터 구조
```json
{
  "dream": "소프트웨어 개발자",
  "interest": "프로그래밍, 기술",
  "jobValue": "STABILITY",
  "mbti": "INTJ",
  "hobby": "코딩, 독서",
  "favoriteSubject": "수학, 과학",
  "holland": "INVESTIGATIVE"
}
```

## 📝 향후 계획

- [x] ~~LLM 연동을 통한 직업 추천 API 구현~~ ✅ 완료
- [x] ~~직업 추천 결과 저장 및 조회~~ ✅ 완료
- [ ] 그룹 미션 기능 완성
- [ ] 친구 시스템 API 구현
- [ ] 미션 진행 상황 관리 API

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.