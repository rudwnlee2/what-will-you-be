// src/types/api.ts

export interface MemberRequest {
  loginId: string;
  name: string;
  email: string;
  password: string;
  birth: string;
  gender: 'MALE' | 'FEMALE';
  phone?: string;
  school?: string;
}

export interface MemberResponse {
  id: number;
  loginId: string;
  name: string;
  email: string;
  birth: string;
  gender: 'MALE' | 'FEMALE';
  phone?: string;
  school?: string;
  createdDate: string;
}

// MBTI 타입
export type MBTI =
  | 'ISTJ'
  | 'ISFJ'
  | 'INFJ'
  | 'INTJ'
  | 'ISTP'
  | 'ISFP'
  | 'INFP'
  | 'INTP'
  | 'ESTP'
  | 'ESFP'
  | 'ENFP'
  | 'ENTP'
  | 'ESTJ'
  | 'ESFJ'
  | 'ENFJ'
  | 'ENTJ';

// Holland 타입
export type Holland =
  | 'REALISTIC'
  | 'INVESTIGATIVE'
  | 'ARTISTIC'
  | 'SOCIAL'
  | 'ENTERPRISING'
  | 'CONVENTIONAL';

// JobValue 타입
export type JobValue =
  | 'STABILITY'
  | 'COMPENSATION'
  | 'WORK_LIFE_BALANCE'
  | 'FUN'
  | 'BELONGING'
  | 'SELF_DEVELOPMENT'
  | 'CHALLENGE'
  | 'INFLUENCE'
  | 'CONTRIBUTION'
  | 'ACHIEVEMENT'
  | 'RECOGNITION'
  | 'AUTONOMY';

// 추천 정보 요청 타입
export interface RecommendationInfoRequest {
  dream: string;
  dreamReason: string;
  interest: string;
  mbti: MBTI;
  holland: Holland;
  hobby: string;
  favoriteSubject: string;
  jobValue: JobValue;
}
