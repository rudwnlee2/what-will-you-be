import axios, { type AxiosResponse } from 'axios'; // ❗  AxiosResponse 타입을 import 합니다.

// ❗  우리만의 커스텀 에러 클래스를 정의합니다.
// Error 클래스를 상속받아, message 외에 response 속성도 가질 수 있도록 확장합니다.
class ApiError extends Error {
  response: AxiosResponse;

  constructor(message: string, response: AxiosResponse) {
    super(message); // Error 클래스의 생성자 호출
    this.name = 'ApiError';
    this.response = response;
  }
}

// 1. .env 파일에서 URL을 가져옵니다.
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // ❗  백엔드에서 보낸 커스텀 에러 메시지가 있는지 확인합니다.
    // ❗  error가 axios 에러인지, response가 있는지 확인합니다.
    if (axios.isAxiosError(error) && error.response) {
      const customMessage = error.response?.data?.message;

      if (customMessage) {
        // ❗  커스텀 메시지가 있다면, 그 메시지를 가진 새로운 Error 객체를 생성합니다.
        // ❗  any 대신, 새로 만든 ApiError 클래스를 사용하여 에러를 생성합니다.
        const customError = new ApiError(customMessage, error.response);
        return Promise.reject(customError);
      }

      // 401 에러 처리 로직은 그대로 유지합니다.
      if (error.response?.status === 401) {
        localStorage.removeItem('jwtToken');
        window.location.href = '/login';
      }
    }
    // ❗ 커스텀 메시지가 없다면, 기존 Axios 에러를 그대로 반환합니다.
    return Promise.reject(error);
  },
);

export default axiosInstance;
