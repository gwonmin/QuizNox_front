import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";

// ✅ 페이지 컴포넌트들 lazy import
const Home = lazy(() => import("./pages/Home"));
const MockExam = lazy(() => import("./pages/MockExam"));
const QuizTopic = lazy(() => import("./pages/Quiz/Topic"));
const QuizList = lazy(() => import("./pages/Quiz/List"));
const QuizPlayPage = lazy(() => import("./pages/Quiz/Play"));

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<div className="p-4 text-center">로딩 중...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mock-exam" element={<MockExam />} />
          <Route path="/quiz/topic" element={<QuizTopic />} />
          <Route path="/quiz/list" element={<QuizList />} />
          <Route path="/quiz/play" element={<QuizPlayPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
