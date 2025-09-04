// src/types/job.types.ts

/**
 * 직업 추천 상세 정보 타입
 * POST /api/job-recommendations 응답의 배열 요소
 * GET /api/job-recommendations/{id} 응답
 */
export interface JobRecommendationDetail {
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

/**
 * 직업 추천 목록의 각 항목 타입
 * GET /api/job-recommendations 응답의 content 배열 요소
 */
export interface JobRecommendationListItem {
  recommendationId: number;
  jobName: string;
  recommendedAt: string;
}

/**
 * 페이징 정보 타입
 */
export interface Pageable {
  pageNumber: number;
  pageSize: number;
}

/**
 * 직업 추천 목록 전체 응답 타입
 * GET /api/job-recommendations
 */
export interface JobRecommendationsListResponse {
  content: JobRecommendationListItem[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
