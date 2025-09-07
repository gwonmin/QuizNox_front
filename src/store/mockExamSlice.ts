import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ExamType, MockExamState } from "../types/quiz";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

// 모의고사 설정 (공통 상수에서 생성)
const MOCK_EXAM_CONFIG = {
  associate: {
    timeLimit: 130, // 분
    passThreshold: 45,
    name: "AWS Certified Associate",
  },
  professional: {
    timeLimit: 180, // 분
    passThreshold: 45,
    name: "AWS Certified Professional",
  },
};

// 모의고사 문제 가져오기
export const fetchMockExamQuestions = createAsyncThunk(
  "mockExam/fetchQuestions",
  async (topicId: string) => {
    try {
      const response = await fetch(`${API_URL}/questions?topicId=${topicId}`);
      if (!response.ok) {
        throw new Error("모의고사 문제를 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      if (!data || !Array.isArray(data)) {
        throw new Error("잘못된 응답 형식입니다.");
      }

      // 전체 문제에서 랜덤하게 65문제 선택
      const shuffled = data.sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, 65);

      return selectedQuestions.map((rawQuestion: any, index: number) => ({
        questionNumber: index + 1, // 모의고사에서는 1부터 65까지
        questionText: rawQuestion.question_text,
        choices: rawQuestion.choices,
        mostVotedAnswer: rawQuestion.most_voted_answer,
        originalQuestionNumber: Number(rawQuestion.question_number), // 원본 문제 번호 보존
        topicId: rawQuestion.topic_id, // 원본 토픽 ID 보존
      }));
    } catch (error) {
      throw new Error("모의고사 문제를 불러오는데 실패했습니다.");
    }
  }
);

const initialState: MockExamState = {
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
  loading: "idle",
  error: null,
};

export const mockExamSlice = createSlice({
  name: "mockExam",
  initialState,
  reducers: {
    setExamType(state, action: PayloadAction<{ examType: ExamType; examTypeId: string; examName: string; examShortName: string }>) {
      state.examType = action.payload.examType;
      state.examTypeId = action.payload.examTypeId;
      state.examName = action.payload.examName;
      state.examShortName = action.payload.examShortName;
      state.timeLimit = MOCK_EXAM_CONFIG[action.payload.examType].timeLimit;
      state.remainingTime = MOCK_EXAM_CONFIG[action.payload.examType].timeLimit * 60; // 초로 변환
    },
    startExam(state) {
      state.isStarted = true;
      state.startTime = Date.now();
    },
    setAnswer(state, action: PayloadAction<{ questionIndex: number; answer: string | null }>) {
      const { questionIndex, answer } = action.payload;
      state.answers[questionIndex] = answer;
    },
    setCurrentQuestionIndex(state, action: PayloadAction<number>) {
      state.currentQuestionIndex = action.payload;
    },
    tickTimer(state) {
      if (state.remainingTime > 0) {
        state.remainingTime -= 1;
      } else {
        state.isCompleted = true;
        state.endTime = Date.now();
      }
    },
    submitExam(state) {
      state.isSubmitted = true;
      state.isCompleted = true;
      state.endTime = Date.now();
    },
    resetMockExam() {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMockExamQuestions.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchMockExamQuestions.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.questions = action.payload;
        // 문제가 로드되면 답안 배열 초기화
        state.answers = new Array(action.payload.length).fill(null);
      })
      .addCase(fetchMockExamQuestions.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "알 수 없는 오류가 발생했습니다.";
      });
  },
});

export const {
  setExamType,
  startExam,
  setAnswer,
  setCurrentQuestionIndex,
  tickTimer,
  submitExam,
  resetMockExam,
} = mockExamSlice.actions;

export default mockExamSlice.reducer;
