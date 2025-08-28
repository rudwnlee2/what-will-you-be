// API 타입 정의
export interface LoginRequest {
  username: string;
  password: string;
}

export interface MemberRequest {
  loginId: string;
  password: string;
  name: string;
  email: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string;
}

export interface MemberResponse {
  id: number;
  loginId: string;
  name: string;
  email: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string;
}

export interface RecommendationInfoRequest {
  dream: string;
  dreamReason: string;
  interest: string;
  jobValue: JobValue;
  mbti: MBTI;
  hobby: string;
  favoriteSubject: string;
  holland: Holland;
}

export interface RecommendationInfoResponse extends RecommendationInfoRequest {
  memberId: number;
  createdAt: string;
  updatedAt: string;
}

// 직업 추천 관련 타입
export interface JobRecommendationResponse {
  recommendationId: number;
  jobName: string;
  recommendedAt: string;
  jobSummary: string;
  reason: string;
  relatedMajors: string;
  relatedCertificates: string;
  salary: string;
  prospect: string;
  requiredKnowledge: string;
  careerPath: string;
  environment: string;
  jobValues: string;
}

export interface JobRecommendationListItem {
  recommendationId: number;
  jobName: string;
  recommendedAt: string;
}

export type MBTI = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export type Holland = 
  | 'REALISTIC' | 'INVESTIGATIVE' | 'ARTISTIC'
  | 'SOCIAL' | 'ENTERPRISING' | 'CONVENTIONAL';

export type JobValue = 
  | 'STABILITY' | 'COMPENSATION' | 'WORK_LIFE_BALANCE'
  | 'FUN' | 'BELONGING' | 'SELF_DEVELOPMENT'
  | 'CHALLENGE' | 'INFLUENCE' | 'CONTRIBUTION'
  | 'ACHIEVEMENT' | 'RECOGNITION' | 'AUTONOMY';