// src/hooks/useWipModal.ts
import { useState } from 'react';

// 이 훅은 모달의 열림/닫힘 상태와 그것을 제어하는 함수들을 반환합니다.
export const useWipModal = () => {
  const [isWipModalOpen, setIsWipModalOpen] = useState(false);

  const openWipModal = () => setIsWipModalOpen(true);
  const closeWipModal = () => setIsWipModalOpen(false);

  return {
    isWipModalOpen,
    openWipModal,
    closeWipModal,
  };
};
