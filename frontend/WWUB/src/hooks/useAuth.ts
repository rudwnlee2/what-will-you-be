// src/hooks/useAuth.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
// 1. 새로 만든 API 함수들을 가져옵니다.
import {
  login as apiLogin,
  signup as apiSignup,
  checkLoginId as apicheckLoginId,
  getMyProfile,
} from '../api/members';
import { saveToken, removeToken, getToken } from '../api/auth'; // 토큰 관리 헬퍼
// 2. 새로운 타입 정의를 가져옵니다.
import type { LoginData } from '../types/user.types';
import type { MemberRequest } from '../types/api';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- Mutations ---

  const loginMutation = useMutation({
    mutationFn: apiLogin, // 3. API 함수 교체
    onSuccess: (response) => {
      const token = response.headers['authorization'];
      if (token) {
        saveToken(token); // 4. 토큰 저장 헬퍼 사용
        queryClient.invalidateQueries({ queryKey: ['me'] }); // 5. 쿼리 키 변경
        navigate('/');
      } else {
        throw new Error('로그인 응답에서 토큰을 찾을 수 없습니다.');
      }
    },
  });

  const signupMutation = useMutation({
    mutationFn: apiSignup, // API 함수 교체
    onSuccess: () => {
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    },
  });

  const checkLoginIdMutation = useMutation({
    mutationFn: apicheckLoginId, // API 함수 교체
    onSuccess: (isAvailable) => {
      if (!isAvailable) {
        alert('이미 사용 중인 아이디입니다.');
      }
    },
  });
  // --- Queries ---

  const profileQuery = useQuery({
    queryKey: ['me'], // 쿼리 키 변경 ('profile' -> 'me')
    queryFn: getMyProfile, // API 함수 교체
    enabled: !!getToken(), // 토큰 존재 여부로 쿼리 활성화
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분 동안은 캐시된 데이터 사용
  });

  // --- Helper Functions ---

  const logout = () => {
    removeToken();
    queryClient.clear(); // 쿼리 캐시 전체 비우기
    navigate('/login');
  };

  // --- Returned Values ---

  return {
    // Methods
    login: (credentials: LoginData) => loginMutation.mutate(credentials),
    signup: (memberData: MemberRequest) => signupMutation.mutate(memberData),
    logout,

    // State & Data
    user: profileQuery.data, // 6. '.data' 한 번만 접근
    isAuthenticated: profileQuery.isSuccess,

    // Status
    isLoginLoading: loginMutation.isPending,
    isSignupLoading: signupMutation.isPending,
    isProfileLoading: profileQuery.isLoading,
    ischeckLoginIdLoading: checkLoginIdMutation.isPending,
    // Errors
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    checkLoginIdError: checkLoginIdMutation.error,
    profileError: profileQuery.error,
  };
};
