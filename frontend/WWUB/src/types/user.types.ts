/**
 * 로그인 페이지에서 사용될 데이터 타입입니다.
 * POST /api/members/login
 */
export interface LoginData {
  loginId: string;
  password: string;
}

/**
 * 회원가입 페이지에서 사용될 데이터 타입입니다.
 * POST /api/members/signup
 */
export interface SignUpData {
  loginId: string;
  name: string;
  email: string;
  password: string;
  birthDate: string; // "YYYY-MM-DD" 형식의 문자열
  gender: 'MALE' | 'FEMALE'; // 백엔드에서 받을 enum 값에 따라 수정
  phoneNumber: string;
  school: string;
}

/**
 * '내 정보 조회' 시 서버로부터 받아오는 전체 사용자 프로필 데이터 타입입니다.
 * GET /api/members/me
 */
export interface UserProfile {
  loginId: string;
  name: string;
  email: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  phoneNumber: string;
  school: string;
  profileImageUrl?: string; // 프로필 이미지는 없을 수도 있으므로 optional
}

/**
 * '내 정보 수정' 시 서버로 보내는 데이터 타입입니다.
 * 수정 가능한 필드만 포함하며, 비밀번호처럼 필수가 아닌 값은 optional로 지정합니다.
 * PATCH /api/members/me
 */
export interface UpdateProfileData {
  name: string;
  email: string;
  phoneNumber: string;
  school: string;
  password?: string; // 사용자가 입력할 때만 값을 보냄
  profileImage?: File; // 실제 이미지 파일 객체
}
