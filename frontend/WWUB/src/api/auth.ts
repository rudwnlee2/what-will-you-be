// src/api/auth.ts (새로운 역할)

const TOKEN_KEY = 'jwtToken';

/** 로그인 성공 후 토큰을 localStorage에 저장하는 함수 */
export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/** localStorage에서 토큰을 가져오는 함수 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/** 로그아웃 시 토큰을 삭제하는 함수 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/** 현재 로그인 되어 있는지 (토큰이 있는지) 확인하는 함수 */
export const isLoggedIn = (): boolean => {
  const token = getToken();
  return !!token; // 토큰이 있으면 true, 없으면 false
};
