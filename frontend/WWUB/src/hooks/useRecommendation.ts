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
`

### ## 3. 커스텀 훅 사용 예시 (LoginPage.tsx)

이렇게 잘 만들어진 훅은 컴포넌트에서 아주 간단하게 사용할 수 있습니다.

`
'typescript'
// src/pages/login/LoginPage.tsx (예시)

import { useAuth } from '../hooks/useAuth.ts';

function LoginPage() {
  // 복잡한 로직은 모두 훅 안에! 컴포넌트는 필요한 것만 꺼내 씁니다.
  const { login, isLoginLoading, loginError } = useAuth();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    const loginData = { loginId: 'user123', password: 'password123' }; // 실제로는 form에서 값을 가져와야 함
    login(loginData);
  };

  return (
    <form onSubmit={handleLogin}>
      {/* ... 아이디, 비밀번호 input ... */}
      <button type="submit" disabled={isLoginLoading}>
        {isLoginLoading ? '로그인 중...' : '로그인'}
      </button>
      {loginError && <p>로그인 실패: {loginError.message}</p>}
    </form>
  );
}
