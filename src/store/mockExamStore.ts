import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ExamType, MockExamState, Question } from '../types/quiz';

// 모의고사 설정 (공통 상수에서 생성)
const MOCK_EXAM_CONFIG = {
  associate: {
    timeLimit: 130, // 분
    passThreshold: 45,
    name: 'AWS Certified Associate',
  },
  professional: {
    timeLimit: 180, // 분
    passThreshold: 45,
    name: 'AWS Certified Professional',
  },
};

interface MockExamStore extends Omit<MockExamState, 'loading' | 'error'> {
  // Actions
  setExamType: (data: { examType: ExamType; examTypeId: string; examName: string; examShortName: string }) => void;
  startExam: () => void;
  setAnswer: (questionIndex: number, answer: string | null) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setQuestions: (questions: Question[]) => void;
  tickTimer: () => void;
  submitExam: () => void;
  resetMockExam: () => void;
}

export const useMockExamStore = create<MockExamStore>()(
  persist(
    (set) => ({
      // Initial state
      examType: null,
      examTypeId: null,
      examName: null,
      examShortName: null,
      timeLimit: 0,
      remainingTime: 0,
      currentQuestionIndex: 0,
      answers: new Array(65).fill(null),
      questions: [],
      isStarted: false,
      isCompleted: false,
      isSubmitted: false,
      startTime: null,
      endTime: null,

      // Actions

      setExamType: (data: { examType: ExamType; examTypeId: string; examName: string; examShortName: string }) => {
        const { examType, examTypeId, examName, examShortName } = data;
        set({
          examType,
          examTypeId,
          examName,
          examShortName,
          timeLimit: MOCK_EXAM_CONFIG[examType].timeLimit,
          remainingTime: MOCK_EXAM_CONFIG[examType].timeLimit * 60, // 초로 변환
        });
      },

      startExam: () => {
        set({
          isStarted: true,
          startTime: Date.now(),
        });
      },

      setAnswer: (questionIndex: number, answer: string | null) => {
        set((state) => {
          const newAnswers = [...state.answers];
          newAnswers[questionIndex] = answer;
          return { answers: newAnswers };
        });
      },

      setCurrentQuestionIndex: (currentQuestionIndex: number) => {
        set({ currentQuestionIndex });
      },

      setQuestions: (questions: Question[]) => {
        set({ 
          questions: [...questions],
          // 문제가 로드되면 답안 배열 초기화
          answers: new Array(questions.length).fill(null),
        });
      },

      tickTimer: () => {
        set((state) => {
          if (state.remainingTime > 0) {
            return { remainingTime: state.remainingTime - 1 };
          } else {
            return {
              isCompleted: true,
              endTime: Date.now(),
            };
          }
        });
      },

      submitExam: () => {
        set({
          isSubmitted: true,
          isCompleted: true,
          endTime: Date.now(),
        });
      },

      resetMockExam: () => {
        set({
          examType: null,
          examTypeId: null,
          examName: null,
          examShortName: null,
          timeLimit: 0,
          remainingTime: 0,
          currentQuestionIndex: 0,
          answers: new Array(65).fill(null),
          questions: [],
          isStarted: false,
          isCompleted: false,
          isSubmitted: false,
          startTime: null,
          endTime: null,
        });
      },
    }),
    {
      name: 'mockexam-storage',
      partialize: (state) => ({
        examType: state.examType,
        examTypeId: state.examTypeId,
        examName: state.examName,
        examShortName: state.examShortName,
        timeLimit: state.timeLimit,
        remainingTime: state.remainingTime,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        questions: state.questions,
        isStarted: state.isStarted,
        isCompleted: state.isCompleted,
        isSubmitted: state.isSubmitted,
        startTime: state.startTime,
        endTime: state.endTime,
      }),
    }
  )
);
