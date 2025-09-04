// src/api/options.ts

import axiosInstance from './axiosInstance';
import type { OptionItem, RecommendationOptionsResponse } from '../types/options.types';

/** 1. 성별 옵션 조회 */
export const getGenderOptions = async (): Promise<OptionItem[]> => {
  const response = await axiosInstance.get('/api/options/genders');
  return response.data;
};

/** 2. 추천 관련 옵션 조회 */
export const getRecommendationOptions = async (): Promise<RecommendationOptionsResponse> => {
  const response = await axiosInstance.get('/api/options/recommendations');
  return response.data;
};
