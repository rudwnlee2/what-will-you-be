// src/hooks/useRecommendation.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// 1. 새로 만든 API 함수들을 가져옵니다.
import { getRecommendationInfo, updateRecommendationInfo } from '../api/recommendations';
import type { RecommendationInfo } from '../types/recommendation.types';
import { getToken } from '../api/auth';

export const useRecommendation = () => {
  const queryClient = useQueryClient();

  const infoQuery = useQuery({
    queryKey: ['recommendationInfo'], // 2. 쿼리 키 명확화
    queryFn: getRecommendationInfo,
    enabled: !!getToken(),
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: updateRecommendationInfo,
    onSuccess: () => {
      alert('진로 탐색 정보가 저장되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['recommendationInfo'] });
    },
  });

  return {
    // Data & Status (Query)
    recommendationInfo: infoQuery.data,
    isLoading: infoQuery.isLoading,
    error: infoQuery.error,

    // Methods & Status (Mutation)
    update: (data: RecommendationInfo) => updateMutation.mutate(data),
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};
