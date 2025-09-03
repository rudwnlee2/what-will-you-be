// src/types/user.types.ts

/**
 * 회원가입 시 서버로 보내는 데이터 타입
 * POST /api/members/signup
 */
export interface SignUpData {
  loginId: string;
  password: string;
  name: string;
  email: string;
  birth: string; // "YYYY-MM-DD"
  gender: 'MALE' | 'FEMALE';
  phone: string;
  school: string;
}

/**
 * 로그인 시 서버로 보내는 데이터 타입
 * POST /api/members/login
 */
export interface LoginData {
  loginId: string;
  password: string;
}

/**
 * 회원 정보 응답 공통 타입 (회원가입, 내 정보 조회/수정 응답)
 */
export interface UserProfile {
  id: number;
  loginId: string;
  name: string;
  email: string;
  birth: string;
  gender: 'MALE' | 'FEMALE';
  phone: string;
  school: string;
  createdDate: string; // ISO 8601 형식의 날짜 문자열
}

/**
 * 내 정보 수정 시 서버로 보내는 데이터 타입
 * PATCH /api/members/me
 * 모든 필드는 선택적이므로 Partial 유틸리티 타입을 사용하거나 직접 optional로 지정합니다.
 */
export type UpdateProfileData = Partial<Omit<UserProfile, 'id' | 'createdDate'>>;
