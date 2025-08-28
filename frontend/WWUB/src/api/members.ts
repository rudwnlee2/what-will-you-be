import axiosInstance from './axiosInstance';

// API 요청/응답에 대한 타입은 src/types 폴더에서 관리하는 것이 좋습니다.
// 예: import type { LoginData, SignUpData, UserProfile } from '../types/user.types';

import type { LoginData, SignUpData, UserProfile } from '../types/user.types.ts';

// POST /api/members/login - 로그인
export const login = async (loginData: LoginData /* LoginData */) => {
  const response = await axiosInstance.post('/api/members/login', loginData);
  // 서버로부터 받은 데이터(예: { accessToken: '...' })를 반환합니다.
  return response.data;
};

// POST /api/members/signup - 회원가입
export const signup = async (signupData: SignUpData /* SignUpData */) => {
  const response = await axiosInstance.post('/api/members/signup', signupData);
  return response.data;
};

// GET /api/members/check-loginid/{loginId} - 아이디 중복 확인
export const checkLoginId = async (loginId: string) => {
  const response = await axiosInstance.get(`/api/members/check-loginid/${loginId}`);
  return response.data;
};

// GET /api/members/me - 내 정보 조회
export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await axiosInstance.get('/api/members/me' /*, UserProfile */);
  return response.data;
};

// PATCH /api/members/me - 내 정보 수정
export const updateMyProfile = async (
  profileData: Partial<UserProfile> /* Partial<UserProfile> */,
) => {
  const response = await axiosInstance.patch('/api/members/me', profileData);
  return response.data;
};

// DELETE /api/members/me - 회원 탈퇴
export const deleteMyAccount = async () => {
  const response = await axiosInstance.delete('/api/members/me');
  return response.data;
};
