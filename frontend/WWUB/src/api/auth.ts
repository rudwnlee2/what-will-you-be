// src/lib/auth.ts

const TOKEN_KEY = 'jwtToken';

/** JWT 토큰을 디코딩하여 payload(내용물)를 추출하는 내부 함수 */
function decodeJwt(token: string) {
  try {
    // atob는 Base64로 인코딩된 문자열을 디코딩합니다.
    // JWT는 세 부분(header.payload.signature)으로 나뉘어 있으므로,
    // 가운데 payload 부분만 디코딩하면 됩니다.
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('토큰 디코딩 실패:', e);
    return null;
  }
}

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
  return !!token;
};

/** 현재 로그인된 사용자의 정보를 가져오는 함수 (새로 추가) */
export const getCurrentUser = (): { username: string } | null => {
  const token = getToken();
  if (!token) {
    return null;
  }
  const decoded = decodeJwt(token);
  // 백엔드가 JWT에 'username'이라는 키로 사용자 아이디를 넣어준다고 가정합니다.
  // 만약 다른 키(예: name, sub)를 사용한다면 이 부분을 수정해야 합니다.
  return decoded ? { username: decoded.username } : null;
};
