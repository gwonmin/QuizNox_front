import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Question, QuizState } from "../types/quiz";

const initialState: QuizState = {
  topicId: "",
  questions: [],
  scrollIndex: 0,
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setTopicId(state, action: PayloadAction<string>) {
      state.topicId = action.payload;
    },
    setQuestions(state, action: PayloadAction<Question[]>) {
      state.questions = [...action.payload];
    },
    setScrollIndex(state, action: PayloadAction<number>) {
      state.scrollIndex = action.payload;
    },
  },
});

export const { setTopicId, setQuestions, setScrollIndex } = quizSlice.actions;
export default quizSlice.reducer;
