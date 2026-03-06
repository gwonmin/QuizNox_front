import { create } from "zustand";
import { persist } from "zustand/middleware";

interface QuizStore {
  topicId: string;
  scrollIndex: number;
  setTopicId: (topicId: string) => void;
  setScrollIndex: (index: number) => void;
  resetState: () => void;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set) => ({
      topicId: "",
      scrollIndex: 0,

      setTopicId: (topicId: string) => {
        set({ topicId });
      },

      setScrollIndex: (scrollIndex: number) => {
        set({ scrollIndex });
      },

      resetState: () => {
        set({
          topicId: "",
          scrollIndex: 0,
        });
      },
    }),
    {
      name: "quiz-storage",
      partialize: (state) => ({
        topicId: state.topicId,
        scrollIndex: state.scrollIndex,
      }),
    }
  )
);
