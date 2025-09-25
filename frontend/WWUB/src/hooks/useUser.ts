// src/hooks/useUser.ts (새 파일)

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { updateMyProfile, deleteMyAccount } from '../api/members';
import { removeToken } from '../api/auth';
import type { UpdateProfileData } from '../types/user.types';

/** 내 정보 수정 뮤테이션 훅 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => updateMyProfile(data),
    onSuccess: () => {
      alert('정보가 성공적으로 수정되었습니다.');
      // 'me' 쿼리를 무효화하여 최신 프로필 정보를 다시 불러오게 함
      queryClient.invalidateQueries({ queryKey: ['me'] });
      navigate('/me');
    },
    onError: (error: Error) => {
      alert(`정보 수정 중 오류가 발생했습니다: ${error.message}`);
    },
  });
};

/** 회원 탈퇴 뮤테이션 훅 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => {
      alert('회원 탈퇴가 완료되었습니다.');
      removeToken(); // 토큰 삭제
      queryClient.clear(); // 모든 쿼리 캐시 삭제
      navigate('/'); // 메인 페이지로 이동
    },
    onError: (error: Error) => {
      alert(`회원 탈퇴 중 오류가 발생했습니다: ${error.message}`);
    },
  });
};
