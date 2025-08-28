import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { jobRecommendationAPI } from '../services/api';

export const useJobRecommendation = () => {
  const queryClient = useQueryClient();

  const recommendationsListQuery = useQuery({
    queryKey: ['job-recommendations'],
    queryFn: jobRecommendationAPI.getRecommendationsList,
    enabled: !!localStorage.getItem('jwtToken'),
  });

  const createRecommendationsMutation = useMutation({
    mutationFn: jobRecommendationAPI.createRecommendations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-recommendations'] });
    },
  });

  const deleteRecommendationMutation = useMutation({
    mutationFn: jobRecommendationAPI.deleteRecommendation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-recommendations'] });
    },
  });

  return {
    recommendationsList: recommendationsListQuery.data?.data,
    isListLoading: recommendationsListQuery.isLoading,
    listError: recommendationsListQuery.error,
    
    createRecommendations: (data?: undefined, options?: { onSuccess?: () => void; onError?: (error: any) => void }) => {
      createRecommendationsMutation.mutate(data, options);
    },
    isCreating: createRecommendationsMutation.isPending,
    createError: createRecommendationsMutation.error,
    
    deleteRecommendation: deleteRecommendationMutation.mutate,
    isDeleting: deleteRecommendationMutation.isPending,
  };
};

export const useJobRecommendationDetail = (id: number) => {
  return useQuery({
    queryKey: ['job-recommendation', id],
    queryFn: () => jobRecommendationAPI.getRecommendationDetail(id),
    enabled: !!id && !!localStorage.getItem('jwtToken'),
  });
};