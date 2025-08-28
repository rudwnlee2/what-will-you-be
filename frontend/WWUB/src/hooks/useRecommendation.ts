import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recommendationAPI } from '../services/api';
import { RecommendationInfoRequest } from '../types/api';

export const useRecommendation = () => {
  const queryClient = useQueryClient();

  const recommendationQuery = useQuery({
    queryKey: ['recommendation-info'],
    queryFn: recommendationAPI.getRecommendationInfo,
    enabled: !!localStorage.getItem('jwtToken'),
    retry: false,
  });

  const updateRecommendationMutation = useMutation({
    mutationFn: recommendationAPI.createOrUpdateRecommendationInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendation-info'] });
    },
  });

  return {
    recommendationInfo: recommendationQuery.data?.data,
    isLoading: recommendationQuery.isLoading,
    error: recommendationQuery.error,
    updateRecommendation: (data: RecommendationInfoRequest, options?: { onSuccess?: () => void; onError?: (error: any) => void }) => {
      updateRecommendationMutation.mutate(data, options);
    },
    isUpdating: updateRecommendationMutation.isPending,
    updateError: updateRecommendationMutation.error,
  };
};