// src/hooks/useRecommendation.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// 1. 새로 만든 API 함수들을 가져옵니다.
import { getRecommendationInfo, updateRecommendationInfo } from '../api/recommendations';

/** 1. 서버에 저장된 내 추천 정보를 가져오는 훅 (GET) */
export const useGetRecommendationInfo = () => {
  return useQuery({
    queryKey: ['recommendationInfo'], // 이 쿼리를 식별하는 고유 키
    queryFn: getRecommendationInfo, // API 호출 함수
    retry: false,
    refetchOnWindowFocus: false, // 다른 창에 갔다가 돌아와도 자동으로 데이터를 다시 불러오지 않음
  });
};

/** 2. 내 추천 정보를 서버에 저장/수정하는 훅 (PUT) */
export const useUpdateRecommendationInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRecommendationInfo,
    // onSuccess 콜백은 여기서 alert를 띄우는 대신,
    // 이 훅을 사용하는 컴포넌트(페이지)에서 직접 처리하는 것이 더 유연합니다.
    onSuccess: () => {
      // 정보가 성공적으로 업데이트되면, 'recommendationInfo' 쿼리를 최신화하여
      // 화면에 보이는 데이터를 동기화합니다.
      queryClient.invalidateQueries({ queryKey: ['recommendationInfo'] });
    },
  });
};
