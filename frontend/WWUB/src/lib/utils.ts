import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * ISO 형식의 날짜 문자열을 "YYYY년 MM월 DD일 오전/오후 H:MM" 형식으로 변환합니다.
 * @param dateString - "2024-12-20T14:30:00"와 같은 ISO 날짜 문자열
 * @returns 포맷팅된 날짜 문자열
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);

  // toLocaleString을 사용하면 사용자의 지역에 맞는 형식으로 쉽게 변환할 수 있습니다.
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true, // 오후/오전 표시
  };

  return new Intl.DateTimeFormat('ko-KR', options).format(date);
  // 결과 예시: "2024년 12월 20일 오후 2:30"
};
