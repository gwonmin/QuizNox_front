import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorBoundary } from "./components/ErrorBoundary";

const Home = lazy(() => import("./pages/Home"));
const MockExam = lazy(() => import("./pages/MockExam/MockExam"));
const MockExamStart = lazy(() => import("./pages/MockExam/MockExamStart"));
const MockExamPlay = lazy(() => import("./pages/MockExam/MockExamPlay"));
const MockExamReview = lazy(() => import("./pages/MockExam/MockExamReview"));
const MockExamResult = lazy(() => import("./pages/MockExam/MockExamResult"));
const QuizTopic = lazy(() => import("./pages/Quiz/Topic"));
const QuizList = lazy(() => import("./pages/Quiz/List"));
const QuizPlayPage = lazy(() => import("./pages/Quiz/Play"));
const NotFound = lazy(() => import("./pages/NotFound"));

/**
 * 앱의 메인 컴포넌트
 * @returns {JSX.Element} 앱의 메인 컴포넌트
 */
export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-8">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mock-exam" element={<MockExam />} />
                <Route path="/mock-exam/start" element={<MockExamStart />} />
                <Route path="/mock-exam/play" element={<MockExamPlay />} />
                <Route path="/mock-exam/review" element={<MockExamReview />} />
                <Route path="/mock-exam/result" element={<MockExamResult />} />
                <Route path="/quiz/topic" element={<QuizTopic />} />
                <Route path="/quiz/list" element={<QuizList />} />
                <Route path="/quiz/play" element={<QuizPlayPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
