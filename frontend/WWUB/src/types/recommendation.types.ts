// src/types/recommendation.types.ts

/**
 * 추천 정보 조회 및 등록/수정 시 사용되는 데이터 타입
 * GET & PUT /api/recommendation-info
 */
export interface RecommendationInfo {
  dream: string;
  dreamReason: string;
  interest: string;
  jobValue: string;
  mbti: string;
  hobby: string;
  favoriteSubject: string;
  holland: string;
}
