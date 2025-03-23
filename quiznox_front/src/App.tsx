import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";

const Home = lazy(() => import("./pages/Home"));
const MockExam = lazy(() => import("./pages/MockExam"));
const QuizTopic = lazy(() => import("./pages/Quiz/Topic"));
const QuizList = lazy(() => import("./pages/Quiz/List"));
const QuizPlayPage = lazy(() => import("./pages/Quiz/Play"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<div className="p-4 text-center">로딩 중...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/mock-exam" element={<MockExam />} />
          <Route path="/quiz/topic" element={<QuizTopic />} />
          <Route path="/quiz/list" element={<QuizList />} />
          <Route path="/quiz/play" element={<QuizPlayPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
