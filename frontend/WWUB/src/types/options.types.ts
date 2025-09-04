// src/types/options.types.ts

/**
 * 기본 옵션 아이템 타입 (코드, 표시 이름)
 */
export interface OptionItem {
  code: string;
  displayName: string;
}

/**
 * 설명이 포함된 옵션 아이템 타입
 */
export interface DescriptiveOptionItem extends OptionItem {
  description: string;
}

/**
 * MBTI 옵션 아이템 타입
 */
export interface MbtiOptionItem {
  code: string;
  description: string;
}

/**
 * 추천 관련 옵션 전체 응답 타입
 * GET /api/options/recommendations
 */
export interface RecommendationOptionsResponse {
  hollandTypes: DescriptiveOptionItem[];
  jobValues: DescriptiveOptionItem[];
  mbtiTypes: MbtiOptionItem[];
}
