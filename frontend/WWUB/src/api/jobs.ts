// src/api/jobs.ts

import axiosInstance from './axiosInstance';
import type { JobRecommendationDetail, JobRecommendationsListResponse } from '../types/job.types';

/** 1. 직업 추천 생성 */
export const createJobRecommendation = async (): Promise<JobRecommendationDetail[]> => {
  const response = await axiosInstance.post('/api/job-recommendations');
  return response.data;
};

/** 2. 내 직업 추천 목록 조회 */
export const getJobRecommendationsList = async (
  page: number = 0,
  size: number = 12,
): Promise<JobRecommendationsListResponse> => {
  const response = await axiosInstance.get('/api/job-recommendations', {
    params: { page, size },
  });
  return response.data;
};

/** 3. 직업 추천 상세 조회 */
export const getJobRecommendationDetail = async (
  recommendationId: number,
): Promise<JobRecommendationDetail> => {
  const response = await axiosInstance.get(`/api/job-recommendations/${recommendationId}`);
  return response.data;
};

/** 4. 직업 추천 삭제 */
export const deleteJobRecommendation = async (recommendationId: number): Promise<void> => {
  await axiosInstance.delete(`/api/job-recommendations/${recommendationId}`);
};
