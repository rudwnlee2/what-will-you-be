// src/components/layout/WipModal.tsx
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

// Modal 컴포넌트가 받을 props의 타입을 정의합니다.
interface WipModalProps {
  isOpen: boolean; // 모달이 열려있는지 여부
  onClose: () => void; // 모달을 닫는 함수
}

export default function WipModal({ isOpen, onClose }: WipModalProps) {
  // isOpen이 false이면 아무것도 렌더링하지 않습니다.
  if (!isOpen) {
    return null;
  }

  return (
    // 모달 배경 (어두운 반투명 오버레이)
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose} // 배경을 클릭하면 모달이 닫힙니다.
    >
      {/* 모달 컨텐츠 */}
      <div
        className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()} // 컨텐츠 클릭 시 닫히는 것을 방지
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900">개발 진행중</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-full p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 text-center mb-6 leading-relaxed">
          현재 이 기능은 준비 중입니다. 조금만 기다려주세요!
        </p>

        <div className="flex justify-center">
          <Button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
