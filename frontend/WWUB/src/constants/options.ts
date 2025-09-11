import type { MBTI, Holland, JobValue } from '../types/api';

export const MBTI_OPTIONS: { value: MBTI; label: string }[] = [
  { value: 'ISTJ', label: 'ISTJ - 청렴결백한 논리주의자' },
  { value: 'ISFJ', label: 'ISFJ - 용감한 수호자' },
  { value: 'INFJ', label: 'INFJ - 통찰력 있는 선지자' },
  { value: 'INTJ', label: 'INTJ - 용의주도한 전략가' },
  { value: 'ISTP', label: 'ISTP - 만능 재주꾼' },
  { value: 'ISFP', label: 'ISFP - 호기심 많은 예술가' },
  { value: 'INFP', label: 'INFP - 열정적인 중재자' },
  { value: 'INTP', label: 'INTP - 논리적인 사색가' },
  { value: 'ESTP', label: 'ESTP - 모험을 즐기는 사업가' },
  { value: 'ESFP', label: 'ESFP - 자유로운 영혼의 연예인' },
  { value: 'ENFP', label: 'ENFP - 재기발랄한 활동가' },
  { value: 'ENTP', label: 'ENTP - 뜨거운 논쟁을 즐기는 변론가' },
  { value: 'ESTJ', label: 'ESTJ - 엄격한 관리자' },
  { value: 'ESFJ', label: 'ESFJ - 사교적인 외교관' },
  { value: 'ENFJ', label: 'ENFJ - 정의로운 사회운동가' },
  { value: 'ENTJ', label: 'ENTJ - 대담한 통솔자' },
];

export const HOLLAND_OPTIONS: { value: Holland; label: string }[] = [
  { value: 'REALISTIC', label: '현실형 - 손으로 직접 작업하는 것을 좋아함' },
  { value: 'INVESTIGATIVE', label: '탐구형 - 문제 해결과 과학적 탐구를 즐김' },
  { value: 'ARTISTIC', label: '예술형 - 자유롭고 창의적인 활동을 선호' },
  { value: 'SOCIAL', label: '사회형 - 사람들과의 소통과 도움 주기를 좋아함' },
  { value: 'ENTERPRISING', label: '진취형 - 리더십과 설득력으로 조직을 이끄는 것을 좋아함' },
  { value: 'CONVENTIONAL', label: '관습형 - 정해진 규칙과 절차에 따라 일하는 것을 선호' },
];

export const JOB_VALUE_OPTIONS: { value: JobValue; label: string }[] = [
  { value: 'STABILITY', label: '안정성 - 하고 싶은 일을 계속 안정적으로 하는 것' },
  { value: 'COMPENSATION', label: '보수 - 경제적 보상을 얻는 것' },
  { value: 'WORK_LIFE_BALANCE', label: '일과 삶의 균형 - 일과 개인생활의 균형' },
  { value: 'FUN', label: '즐거움 - 일에서 흥미와 보람을 느끼는 것' },
  { value: 'BELONGING', label: '소속감 - 구성원이 되는 것을 중요하게 여김' },
  { value: 'SELF_DEVELOPMENT', label: '자기계발 - 자신의 능력을 발전시키는 것' },
  { value: 'CHALLENGE', label: '도전성 - 새로운 일에 도전하는 것' },
  { value: 'INFLUENCE', label: '영향력 - 사람들을 이끄는 것' },
  { value: 'CONTRIBUTION', label: '사회적 기여 - 다른 사람들의 행복과 복지에 기여' },
  { value: 'ACHIEVEMENT', label: '성취 - 목표를 달성하는 것' },
  { value: 'RECOGNITION', label: '사회적 인정 - 인정받고 존경받는 것' },
  { value: 'AUTONOMY', label: '자율성 - 스스로 결정하고 선택하는 것' },
];

export const SUBJECT_OPTIONS = ['국어', '영어', '수학', '사회', '과학', '예체능', '기타'];
