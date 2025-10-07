import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question, QuizState } from '../types/quiz';

interface QuizStore extends Omit<QuizState, 'loading' | 'error'> {
  // Actions
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

      // Actions
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
