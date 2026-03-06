import { getExamTypeInfo } from '../constants/examTypes';
import type { Question, ExamResultState, ExamResultDetail } from '../types/quiz';

/**
 * 시험 관련 유틸리티 함수들
 */

/**
 * 정답 값(문자열 또는 배열)을 비교용 문자 배열로 정규화
 */
function normalizeCorrectAnswer(value: string | string[]): string[] {
  if (Array.isArray(value)) {
    return [...value].sort();
  }
  if (typeof value === 'string') {
    return value.split('').filter(Boolean).sort();
  }
  return [];
}

/**
 * 사용자 답안과 정답을 비교 (복수 선택 지원)
 */
export function isAnswerCorrect(
  userAnswer: string | null,
  mostVotedAnswer: string | string[]
): boolean {
  if (!userAnswer) return false;
  const userChoices = normalizeCorrectAnswer(userAnswer);
  const correctChoices = normalizeCorrectAnswer(mostVotedAnswer);
  if (userChoices.length !== correctChoices.length) return false;
  return userChoices.every((c, i) => c === correctChoices[i]);
}

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

const DEFAULT_TIME_LIMIT = 180;
const DEFAULT_PASS_THRESHOLD = 45;
const DEFAULT_QUESTION_COUNT = 65;

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
    timeLimit: examInfo?.timeLimit ?? DEFAULT_TIME_LIMIT,
    passThreshold: examInfo?.passThreshold ?? DEFAULT_PASS_THRESHOLD,
    questionCount: examInfo?.questionCount ?? DEFAULT_QUESTION_COUNT,
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
 * 답안 상태 계산 (정답/오답/미답, 복수 선택 지원)
 */
export const getAnswerResultStatus = (
  userAnswer: string | null,
  correctAnswer: string | string[]
) => {
  if (!userAnswer) {
    return {
      status: "unanswered",
      label: "미답",
      variant: "secondary",
    } as const;
  }
  const correct = isAnswerCorrect(userAnswer, correctAnswer);
  return {
    status: correct ? "correct" : "incorrect",
    label: correct ? "정답" : "오답",
    variant: correct ? "default" : "destructive",
  } as const;
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

/**
 * 시험 결과 계산 (정답/오답 판정은 복수 선택 지원)
 */
export function computeExamResult(
  questions: Question[],
  answers: (string | null)[],
  examTypeId: string,
  startTime: number | null,
  endTime: number | null
): ExamResultState | null {
  if (!questions.length || !answers.length) return null;

  const examInfo = getExamTypeInfo(examTypeId);
  const passThreshold = examInfo?.passThreshold ?? DEFAULT_PASS_THRESHOLD;

  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const answerDetails: ExamResultDetail[] = questions.map((question, index) => {
    const userAnswer = answers[index] ?? null;
    const correctAnswer = question.mostVotedAnswer;
    const correct = isAnswerCorrect(userAnswer, correctAnswer);

    if (!userAnswer) {
      unansweredCount++;
    } else if (correct) {
      correctCount++;
    } else {
      incorrectCount++;
    }

    const displayCorrect =
      typeof correctAnswer === "string"
        ? correctAnswer
        : Array.isArray(correctAnswer)
          ? (correctAnswer as string[]).join("")
          : "";

    return {
      questionIndex: index,
      question: question.questionText,
      userAnswer,
      correctAnswer: displayCorrect,
      isCorrect: correct,
      choices: question.choices,
    };
  });

  const timeSpent =
    startTime != null && endTime != null
      ? Math.round((endTime - startTime) / 1000)
      : 0;

  return {
    score: correctCount,
    totalQuestions: questions.length,
    correctAnswers: correctCount,
    incorrectAnswers: incorrectCount,
    unansweredQuestions: unansweredCount,
    passThreshold,
    isPassed: correctCount >= passThreshold,
    timeSpent,
    answerDetails,
  };
}
