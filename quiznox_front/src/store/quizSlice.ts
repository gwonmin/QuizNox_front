import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Question {
  questionNumber: number;
  questionText: string;
  choices: string[];
  mostVotedAnswer: string;
}

interface QuizState {
  tableName: string;
  questions: Question[];
}

const initialState: QuizState = {
  tableName: "",
  questions: [],
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setTableName(state, action: PayloadAction<string>) {
      state.tableName = action.payload;
    },
    setQuestions(state, action: PayloadAction<Question[]>) {
      state.questions = action.payload;
    },
  },
});

export const { setTableName, setQuestions } = quizSlice.actions;
export default quizSlice.reducer;
