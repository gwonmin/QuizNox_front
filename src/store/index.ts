import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import quizReducer from "./quizSlice";
import mockExamReducer from "./mockExamSlice";
import authReducer from "./authSlice";

// persist 설정
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["quiz", "mockExam", "auth"], // auth도 persist에 추가
};

// root reducer 생성
const rootReducer = combineReducers({
  quiz: quizReducer,
  mockExam: mockExamReducer,
  auth: authReducer,
});

// persist reducer 생성
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
