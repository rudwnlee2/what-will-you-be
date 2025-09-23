// src/lib/auth.ts

const TOKEN_KEY = 'jwtToken';

/** JWT 토큰을 디코딩하여 payload(내용물)를 추출하는 내부 함수 */
function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    // Base64url을 일반 Base64로 변환합니다.
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // atob로 디코딩한 후, 한글 깨짐을 방지하기 위해 UTF-8로 변환하는 과정
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('토큰 디코딩 실패:', e);
    return null;
  }
}

/** 로그인 성공 후 토큰을 localStorage에 저장하는 함수 */
export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/** localStorage에서 토큰을 가져오고, 'Bearer ' 접두어를 제거하는 함수 */
export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  // 토큰이 존재하고 'Bearer '로 시작하면, 해당 부분을 제거하고 순수 토큰만 반환합니다.
  if (token && token.startsWith('Bearer ')) {
    return token.slice(7); // 'Bearer '.length === 7
    // 또는 return token.replace('Bearer ', '');
  }
  return token; // 'Bearer '가 없는 일반 토큰이거나 null인 경우 그대로 반환
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
