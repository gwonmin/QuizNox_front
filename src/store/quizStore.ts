import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question, QuizState, RawQuestion } from '../types/quiz';
import { quizApi } from '../services/api';

const mapQuestion = (rawQuestion: RawQuestion): Question => ({
  questionNumber: Number(rawQuestion.question_number),
  questionText: rawQuestion.question_text,
  choices: rawQuestion.choices,
  mostVotedAnswer: rawQuestion.most_voted_answer,
});

interface QuizStore extends QuizState {
  // Actions
  fetchQuestions: (topicId: string) => Promise<void>;
  setTopicId: (topicId: string) => void;
  setQuestions: (questions: Question[]) => void;
  setScrollIndex: (index: number) => void;
  resetState: () => void;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set) => ({
      // Initial state
      topicId: '',
      questions: [],
      scrollIndex: 0,
      loading: 'idle',
      error: null,

      // Actions
      fetchQuestions: async (topicId: string) => {
        set({ loading: 'loading', error: null });
        try {
          const response = await quizApi.get(`/questions?topicId=${topicId}`);
          
          // API 응답이 QuestionResponse 타입인지 확인
          if (!response.data || !Array.isArray(response.data)) {
            throw new Error('잘못된 응답 형식입니다.');
          }
          
          const questions = response.data.map(mapQuestion);
          
          set({
            loading: 'succeeded',
            questions,
            topicId, // 현재 선택된 topicId 저장
          });
        } catch (error: any) {
          set({
            loading: 'failed',
            error: error.message || '알 수 없는 오류가 발생했습니다.',
          });
        }
      },

      setTopicId: (topicId: string) => {
        set({ topicId });
      },

      setQuestions: (questions: Question[]) => {
        set({ questions: [...questions] });
      },

      setScrollIndex: (scrollIndex: number) => {
        set({ scrollIndex });
      },

      resetState: () => {
        set({
          topicId: '',
          questions: [],
          scrollIndex: 0,
          loading: 'idle',
          error: null,
        });
      },
    }),
    {
      name: 'quiz-storage',
      partialize: (state) => ({
        topicId: state.topicId,
        questions: state.questions,
        scrollIndex: state.scrollIndex,
      }),
    }
  )
);
