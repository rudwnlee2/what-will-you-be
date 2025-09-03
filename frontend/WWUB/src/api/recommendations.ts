// src/api/recommendations.ts

import axiosInstance from './axiosInstance';
import type { RecommendationInfo } from '../types/recommendation.types';

/**
 * 1. 추천 정보 조회
 * GET /api/recommendation-info
 */
export const getRecommendationInfo = async (): Promise<RecommendationInfo> => {
  const response = await axiosInstance.get('/api/recommendation-info');
  return response.data;
};

/**
 * 2. 추천 정보 등록/수정
 * PUT /api/recommendation-info
 */
export const updateRecommendationInfo = async (
  data: RecommendationInfo,
): Promise<RecommendationInfo> => {
  const response = await axiosInstance.put('/api/recommendation-info', data);
  return response.data;
};
