// src/api/recommendations.ts

import axiosInstance from './axiosInstance';
import type { RecommendationInfo } from '../types/recommendation.types';

/**
 * 사용자의 추천 정보를 조회하는 API 함수
 * GET /api/recommendation-info
 */
export const getRecommendationInfo = async (): Promise<RecommendationInfo> => {
  const response = await axiosInstance.get('/api/recommendation-info');
  // 저장된 데이터가 없을 경우를 대비해 기본값을 반환하거나,
  // 컴포넌트에서 null 체크를 할 수 있도록 response.data 그대로 반환합니다.
  return response.data;
};

/**
 * 사용자의 추천 정보를 등록하거나 수정하는 API 함수
 * PUT /api/recommendation-info
 * @param data - 사용자가 입력한 추천 정보 데이터
 */
export const updateRecommendationInfo = async (
  data: RecommendationInfo,
): Promise<RecommendationInfo> => {
  const response = await axiosInstance.put('/api/recommendation-info', data);
  return response.data;
};
// src/api/recommendations.ts

import axiosInstance from './axiosInstance';
import type { RecommendationInfo } from '../types/recommendation.types';

/**
 * 사용자의 추천 정보를 조회하는 API 함수
 * GET /api/recommendation-info
 */
export const getRecommendationInfo = async (): Promise<RecommendationInfo> => {
  const response = await axiosInstance.get('/api/recommendation-info');
  // 저장된 데이터가 없을 경우를 대비해 기본값을 반환하거나,
  // 컴포넌트에서 null 체크를 할 수 있도록 response.data 그대로 반환합니다.
  return response.data;
};

/**
 * 사용자의 추천 정보를 등록하거나 수정하는 API 함수
 * PUT /api/recommendation-info
 * @param data - 사용자가 입력한 추천 정보 데이터
 */
export const updateRecommendationInfo = async (
  data: RecommendationInfo,
): Promise<RecommendationInfo> => {
  const response = await axiosInstance.put('/api/recommendation-info', data);
  return response.data;
};
// src/api/recommendations.ts

import axiosInstance from './axiosInstance';
import type { RecommendationInfo } from '../types/recommendation.types';

/**
 * 사용자의 추천 정보를 조회하는 API 함수
 * GET /api/recommendation-info
 */
export const getRecommendationInfo = async (): Promise<RecommendationInfo> => {
  const response = await axiosInstance.get('/api/recommendation-info');
  // 저장된 데이터가 없을 경우를 대비해 기본값을 반환하거나,
  // 컴포넌트에서 null 체크를 할 수 있도록 response.data 그대로 반환합니다.
  return response.data;
};

/**
 * 사용자의 추천 정보를 등록하거나 수정하는 API 함수
 * PUT /api/recommendation-info
 * @param data - 사용자가 입력한 추천 정보 데이터
 */
export const updateRecommendationInfo = async (
  data: RecommendationInfo,
): Promise<RecommendationInfo> => {
  const response = await axiosInstance.put('/api/recommendation-info', data);
  return response.data;
};
