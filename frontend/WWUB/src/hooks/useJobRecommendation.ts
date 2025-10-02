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
// 필요한 타입을 job.types.ts에서 가져옵니다.

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
    // 👇 onSuccess 로직을 아래와 같이 단순화합니다.
    onSuccess: (data) => {
      // 1. 'jobRecommendations' 쿼리를 '무효화'하여 다음 번에 history 페이지에 접근할 때
      //    자동으로 최신 데이터를 다시 불러오도록 설정합니다.
      //    (모든 페이지를 무효화하기 위해 페이지 번호 '1'을 제거합니다)
      queryClient.invalidateQueries({ queryKey: ['jobRecommendations'] });

      // 2. 추천 결과 페이지가 즉시 사용할 수 있도록, 이번 추천 결과는 캐시에 직접 저장합니다.
      //    이 로직은 간단하고 오류 가능성이 적으므로 그대로 둡니다.
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
