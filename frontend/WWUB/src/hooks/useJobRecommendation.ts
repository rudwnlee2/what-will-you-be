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
export const useJobRecommendation = () => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['jobRecommendations'], // 2. 쿼리 키 명확화
    queryFn: () => getJobRecommendationsList(), // 3. 페이지/사이즈는 필요시 인자로 받도록 수정 가능
    enabled: !!getToken(),
  });

  const createMutation = useMutation({
    mutationFn: createJobRecommendation,
    onSuccess: (data) => {
      // ❗ 1. 성공 시 반환된 data를 받습니다.
      // ❗ 2. 생성된 최신 추천 결과를 'jobRecommendations' 목록 쿼리의 캐시에 직접 업데이트합니다.
      // 이렇게 하면 목록 페이지(history)가 즉시 최신 상태로 반영됩니다.
      queryClient.setQueryData(['jobRecommendations', 1], (oldData: any) => {
        // 기존 목록 데이터가 있으면 그 데이터를 사용하고, 없으면 기본 페이지 구조를 만듭니다.
        const existingContent = oldData?.content || [];
        return {
          ...oldData,
          content: data
            .map((detail) => ({
              // 상세 데이터를 목록 아이템 형식으로 변환
              recommendationId: detail.recommendationId,
              jobName: detail.jobName,
              reason: detail.reason,
              createdDate: detail.recommendedAt,
            }))
            .concat(existingContent),
        };
      });
      // ❗ 3. 추천 결과 페이지가 사용할 개별 추천 데이터도 캐시에 넣어줍니다.
      queryClient.setQueryData(['recommendationResult'], data);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJobRecommendation, // mutationFn은 recommendationId를 인자로 받음
    onSuccess: () => {
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
    createRecommendations: (data: void, options?: Parameters<typeof createMutation.mutate>[1]) =>
      createMutation.mutate(data, options),
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
