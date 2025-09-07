interface RawQuestion {
  topic_id: string;
  question_number: string;
  question_text: string;
  choices: string[];
  most_voted_answer: string;
}

interface Question {
  questionNumber: number;
  questionText: string;
  choices: string[];
  mostVotedAnswer: string;
}

interface QuizState {
  topicId: string;
  questions: Question[];
  scrollIndex: number;
  loading: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// 모의고사 관련 타입 추가
type ExamType = 'associate' | 'professional';

interface MockExamConfig {
  associate: {
    timeLimit: number; // 분
    passThreshold: number;
    name: string;
  };
  professional: {
    timeLimit: number;
    passThreshold: number;
    name: string;
  };
}

interface MockExamState {
  examType: ExamType | null;
  examTypeId: string | null; // AWS_DVA, AWS_SAA, AWS_SOA, AWS_DOP
  examName: string | null; // AWS Certified Developer
  examShortName: string | null; // Developer Associate
  timeLimit: number; // 분 단위
  remainingTime: number; // 초 단위
  currentQuestionIndex: number;
  answers: (string | null)[]; // 65개 답안
  questions: Question[]; // 모의고사 문제들
  isStarted: boolean;
  isCompleted: boolean;
  isSubmitted: boolean;
  startTime: number | null;
  endTime: number | null;
  loading: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface AnswerDetail {
  questionNumber: number;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
}

// 시험 세션 인터페이스

interface MockExamResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number; // 백분율
  isPassed: boolean;
  passThreshold: number;
  timeUsed: number; // 사용한 시간 (초)
  answers: AnswerDetail[];
  examType: ExamType;
}

// 시험 결과 상세 정보 타입
interface ExamResultDetail {
  questionIndex: number;
  question: string;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  choices: string[];
}

// 시험 결과 상태 타입
interface ExamResultState {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  passThreshold: number;
  isPassed: boolean;
  timeSpent: number;
  answerDetails: ExamResultDetail[];
}

// 답안 상태 타입
type AnswerStatus = 'answered' | 'unanswered' | 'correct' | 'incorrect';
type BadgeVariant = 'default' | 'secondary' | 'destructive';

interface AnswerStatusInfo {
  status: AnswerStatus;
  label: string;
  variant: BadgeVariant;
}

export type { 
  RawQuestion, 
  Question, 
  QuizState, 
  ExamType, 
  MockExamConfig, 
  MockExamState, 
  AnswerDetail, 
  MockExamResult,
  ExamResultDetail,
  ExamResultState,
  AnswerStatus,
  BadgeVariant,
  AnswerStatusInfo
};
