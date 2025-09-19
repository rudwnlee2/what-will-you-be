// src/api/members.ts

import axiosInstance from './axiosInstance';
import type { LoginData, UpdateProfileData, UserProfile } from '../types/user.types';
import type { MemberRequest } from '../types/api';

/**
 * 1. 회원가입
 * POST /api/members/signup
 */
export const signup = async (data: MemberRequest): Promise<UserProfile> => {
  const response = await axiosInstance.post('/api/members/signup', data);
  return response.data;
};

/**
 * 2. 로그인
 * POST /api/members/login
 * 응답 body는 비어있지만, 헤더에 토큰이 담겨 오므로 response 객체 전체를 반환합니다.
 */
export const login = async (data: LoginData) => {
  const response = await axiosInstance.post('/api/members/login', data);
  // 컴포넌트에서 response.headers['authorization']으로 토큰을 추출할 수 있습니다.
  return response;
};

/**
 * 3. 아이디 중복 확인
 * GET /api/members/check-loginid/{loginId}
 */
export const checkLoginId = async (loginId: string): Promise<{ exists: boolean }> => {
  const response = await axiosInstance.get(`/api/members/check-username/${loginId}`);
  return response.data;
};

/**
 * 4. 내 정보 조회
 * GET /api/members/me
 */
export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await axiosInstance.get('/api/members/me');
  return response.data;
};

/**
 * 5. 내 정보 수정
 * PATCH /api/members/me
 */
export const updateMyProfile = async (data: UpdateProfileData): Promise<UserProfile> => {
  const response = await axiosInstance.patch('/api/members/me', data);
  return response.data;
};

/**
 * 6. 회원 탈퇴
 * DELETE /api/members/me
 */
export const deleteMyAccount = async (): Promise<void> => {
  await axiosInstance.delete('/api/members/me');
};
