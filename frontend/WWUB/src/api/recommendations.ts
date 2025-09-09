// src/api/recommendations.ts

import axiosInstance from './axiosInstance';
import type { RecommendationInfoRequest } from '../types/api';

/**
 * 1. 추천 정보 조회
 * GET /api/recommendation-info
 */
export const getRecommendationInfo = async (): Promise<RecommendationInfoRequest> => {
  const response = await axiosInstance.get('/api/recommendation-info');
  return response.data;
};

/**
 * 2. 추천 정보 등록/수정
 * PUT /api/recommendation-info
 */
export const updateRecommendationInfo = async (
  data: RecommendationInfoRequest,
): Promise<RecommendationInfoRequest> => {
  const response = await axiosInstance.put('/api/recommendation-info', data);
  return response.data;
};
