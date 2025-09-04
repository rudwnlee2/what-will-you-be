// src/hooks/useJobRecommendation.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// 1. 새로 만든 API 함수들을 가져옵니다.
import {
  getJobRecommendationsList,
  createJobRecommendation,
  deleteJobRecommendation,
  getJobRecommendationDetail,
} from '../api/jobs';
import { getToken } from '../api/auth';

/** 직업 추천 목록과 생성/삭제를 관리하는 훅 */
export const useJobRecommendations = () => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['jobRecommendations'], // 2. 쿼리 키 명확화
    queryFn: () => getJobRecommendationsList(), // 3. 페이지/사이즈는 필요시 인자로 받도록 수정 가능
    enabled: !!getToken(),
  });

  const createMutation = useMutation({
    mutationFn: createJobRecommendation,
    onSuccess: () => {
      alert('직업 추천이 생성되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['jobRecommendations'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJobRecommendation, // mutationFn은 recommendationId를 인자로 받음
    onSuccess: () => {
      alert('추천 기록이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['jobRecommendations'] });
    },
  });

  return {
    // Data & Status (List)
    recommendations: listQuery.data?.content,
    pageInfo: listQuery.data, // 페이징 정보 포함
    isListLoading: listQuery.isLoading,
    listError: listQuery.error,

    // Methods & Status (Create)
    create: () => createMutation.mutate(),
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    // Methods & Status (Delete)
    delete: (id: number) => deleteMutation.mutate(id),
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};

/** 직업 추천 상세 정보를 조회하는 훅 */
export const useJobRecommendationDetail = (id: number | null) => {
  return useQuery({
    queryKey: ['jobRecommendation', id],
    queryFn: () => getJobRecommendationDetail(id!), // id가 null이 아닐 때만 실행되므로 non-null assertion 사용
    enabled: !!id && !!getToken(),
  });
};
