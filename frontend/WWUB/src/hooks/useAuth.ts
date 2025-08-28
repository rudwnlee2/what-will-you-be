import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { LoginRequest, MemberRequest } from '../types/api';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      const token = response.headers['authorization'] || response.headers['Authorization'];
      if (token) {
        const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        localStorage.setItem('jwtToken', cleanToken);
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        navigate('/');
      } else {
        throw new Error('로그인 응답에서 토큰을 찾을 수 없습니다.');
      }
    },
  });

  const signupMutation = useMutation({
    mutationFn: authAPI.signup,
    onSuccess: () => {
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    },
  });

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: authAPI.getProfile,
    enabled: !!localStorage.getItem('jwtToken'),
    retry: false,
  });

  const logout = () => {
    localStorage.removeItem('jwtToken');
    queryClient.clear();
    navigate('/login');
  };

  const isAuthenticated = !!localStorage.getItem('jwtToken');

  return {
    login: (credentials: LoginRequest) => loginMutation.mutate(credentials),
    signup: (memberData: MemberRequest) => signupMutation.mutate(memberData),
    logout,
    profile: profileQuery.data?.data,
    isAuthenticated,
    isLoginLoading: loginMutation.isPending,
    isSignupLoading: signupMutation.isPending,
    isProfileLoading: profileQuery.isLoading,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
  };
};