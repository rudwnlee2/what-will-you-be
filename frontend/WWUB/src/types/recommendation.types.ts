// src/types/recommendation.types.ts

/**
 * 추천 정보 조회 및 등록/수정 시 사용되는 데이터 타입
 * GET & PUT /api/recommendation-info
 */
// 백엔드 enum 타입들
export type JobValueType = 'STABILITY' | 'CREATIVITY' | 'LEADERSHIP' | 'SERVICE' | 'ACHIEVEMENT' | 'INDEPENDENCE';
export type MBTIType = 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP' | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';
export type HollandType = 'REALISTIC' | 'INVESTIGATIVE' | 'ARTISTIC' | 'SOCIAL' | 'ENTERPRISING' | 'CONVENTIONAL';

export interface RecommendationInfo {
  dream: string;
  dreamReason: string;
  interest: string;
  jobValue: JobValueType;
  mbti: MBTIType;
  hobby: string;
  favoriteSubject: string;
  holland: HollandType;
}
