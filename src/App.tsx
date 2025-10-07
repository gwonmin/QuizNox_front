import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProtectedRoute } from "./components/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const MockExam = lazy(() => import("./pages/MockExam/MockExam"));
const MockExamStart = lazy(() => import("./pages/MockExam/MockExamStart"));
const MockExamPlay = lazy(() => import("./pages/MockExam/MockExamPlay"));
const MockExamReview = lazy(() => import("./pages/MockExam/MockExamReview"));
const MockExamResult = lazy(() => import("./pages/MockExam/MockExamResult"));
const QuizTopic = lazy(() => import("./pages/Quiz/Topic"));
const QuizList = lazy(() => import("./pages/Quiz/List"));
const QuizPlayPage = lazy(() => import("./pages/Quiz/Play"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));

function AppContent() {
  // App 레벨에서는 useCurrentUser를 호출하지 않음
  // ProtectedRoute에서만 호출하여 중복 방지

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* 인증 페이지 - 헤더 없이 전체 화면 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 메인 앱 - 헤더 포함 */}
        <Route
          path="/*"
          element={
            <div className="h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 container mx-auto px-4 py-8">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* 보호된 라우트 (인증 필요) */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Home />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/home"
                      element={
                        <ProtectedRoute>
                          <Home />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/mock-exam"
                      element={
                        <ProtectedRoute>
                          <MockExam />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/mock-exam/start"
                      element={
                        <ProtectedRoute>
                          <MockExamStart />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/mock-exam/play"
                      element={
                        <ProtectedRoute>
                          <MockExamPlay />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/mock-exam/review"
                      element={
                        <ProtectedRoute>
                          <MockExamReview />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/mock-exam/result"
                      element={
                        <ProtectedRoute>
                          <MockExamResult />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/quiz/topic"
                      element={
                        <ProtectedRoute>
                          <QuizTopic />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/quiz/list"
                      element={
                        <ProtectedRoute>
                          <QuizList />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/quiz/play"
                      element={
                        <ProtectedRoute>
                          <QuizPlayPage />
                        </ProtectedRoute>
                      }
                    />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}

/**
 * 앱의 메인 컴포넌트
 * @returns {JSX.Element} 앱의 메인 컴포넌트
 */
export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </BrowserRouter>
  );
}
