import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Question, QuizState, RawQuestion } from "../types/quiz";
import { quizApi } from "../services/api";

const mapQuestion = (rawQuestion: RawQuestion): Question => ({
  questionNumber: Number(rawQuestion.question_number),
  questionText: rawQuestion.question_text,
  choices: rawQuestion.choices,
  mostVotedAnswer: rawQuestion.most_voted_answer,
});

export const fetchQuestions = createAsyncThunk(
  "quiz/fetchQuestions",
  async (topicId: string) => {
    const response = await quizApi.get(`/questions?topicId=${topicId}`);
    // API 응답이 QuestionResponse 타입인지 확인
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("잘못된 응답 형식입니다.");
    }
    return response.data.map(mapQuestion);
  }
);

const initialState: QuizState = {
  topicId: "",
  questions: [],
  scrollIndex: 0,
  loading: "idle",
  error: null,
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
    resetState(state) {
      state.topicId = "";
      state.questions = [];
      state.scrollIndex = 0;
      state.loading = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.questions = action.payload;
        state.topicId = action.meta.arg; // 현재 선택된 topicId 저장
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "알 수 없는 오류가 발생했습니다.";
      });
  },
});

export const { setTopicId, setQuestions, setScrollIndex, resetState } =
  quizSlice.actions;
export default quizSlice.reducer;
