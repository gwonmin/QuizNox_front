import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import quizReducer from "./quizSlice";
import mockExamReducer from "./mockExamSlice";

// persist 설정
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["quiz", "mockExam"], // quiz와 mockExam 모두 persist
};

// root reducer 생성
const rootReducer = combineReducers({
  quiz: quizReducer,
  mockExam: mockExamReducer,
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
