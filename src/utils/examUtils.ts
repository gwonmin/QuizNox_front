import { getExamTypeInfo } from '../constants/examTypes';

/**
 * 시험 관련 유틸리티 함수들
 */

/**
 * 시험 타입 ID를 시험 이름으로 변환
 * @param examType 시험 타입 ID
 * @returns 시험 이름
 */
export const getExamDisplayName = (examType: string): string => {
  const examInfo = getExamTypeInfo(examType);
  return examInfo?.name || "모의고사";
};

/**
 * 시험 타입 ID를 시험 레벨로 변환
 * @param examType 시험 타입 ID
 * @returns 시험 레벨 (Associate, Professional 등)
 */
export const getExamLevel = (examType: string): string => {
  const examInfo = getExamTypeInfo(examType);
  return examInfo?.level || "Associate";
};

/**
 * 시험 기본 정보 객체 생성
 * @param examType 시험 타입 ID
 * @returns 시험 기본 정보 객체
 */
export const getExamBasicInfo = (examType: string) => {
  const examInfo = getExamTypeInfo(examType);
  return {
    name: examInfo?.name || "모의고사",
    level: examInfo?.level || "Associate",
    timeLimit: examInfo?.timeLimit || 180,
    passThreshold: examInfo?.passThreshold || 45,
    questionCount: examType === 'AWS_DOP' ? 75 : 65
  };
};

/**
 * 답안 상태 계산 (응답/미답)
 * @param userAnswer 사용자 답안
 * @returns 답안 상태 객체
 */
export const getAnswerStatus = (userAnswer: string | null) => {
  if (!userAnswer) {
    return { 
      status: 'unanswered' as const, 
      label: '미답', 
      variant: 'secondary' as const 
    };
  }
  
  return {
    status: 'answered' as const,
    label: '응답',
    variant: 'default' as const
  };
};

/**
 * 답안 상태 계산 (정답/오답/미답)
 * @param userAnswer 사용자 답안
 * @param correctAnswer 정답
 * @returns 답안 상태 객체
 */
export const getAnswerResultStatus = (userAnswer: string | null, correctAnswer: string) => {
  if (!userAnswer) {
    return { 
      status: 'unanswered' as const, 
      label: '미답', 
      variant: 'secondary' as const 
    };
  }
  
  const isCorrect = userAnswer === correctAnswer;
  return {
    status: isCorrect ? 'correct' as const : 'incorrect' as const,
    label: isCorrect ? '정답' : '오답',
    variant: isCorrect ? 'default' as const : 'destructive' as const
  };
};

/**
 * 답변한 문제 수 계산
 * @param answers 답안 배열
 * @returns 답변한 문제 수
 */
export const getAnsweredQuestionsCount = (answers: (string | null)[]): number => {
  return answers.filter(answer => answer !== null).length;
};

/**
 * 시험 데이터 유효성 검사
 * @param questions 문제 배열
 * @param answers 답안 배열
 * @returns 유효성 검사 결과
 */
export const validateExamData = (questions: unknown[], answers: (string | null)[]) => {
  return {
    hasQuestions: questions && questions.length > 0,
    hasAnswers: answers && answers.length > 0,
    isValid: questions && questions.length > 0 && answers && answers.length > 0
  };
};
