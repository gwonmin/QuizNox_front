import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { useLoginForm } from "../../hooks/auth/useLoginForm";

export default function Login() {
  const { formData, loading, displayError, handleChange, handleSubmit } =
    useLoginForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="w-full p-6 sm:p-8 shadow-2xl border-0">
          <div className="text-center mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                QuizNox
              </h1>
              <div className="w-12 sm:w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              로그인
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              계정에 로그인하여 학습을 시작하세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {displayError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{displayError}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                사용자명
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 sm:py-4 text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 touch-manipulation"
                autoComplete="username"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                영문, 숫자, 언더스코어(_)만 사용 가능
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 sm:py-4 text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 touch-manipulation"
                autoComplete="current-password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none touch-manipulation min-h-[48px]"
              disabled={loading || !formData.username || !formData.password}
            >
              {loading ? "로그인 중..." : "로그인"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              계정이 없으신가요?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors touch-manipulation"
              >
                회원가입
              </Link>
            </div>
          </form>
        </Card>
      </div>

      <LoadingOverlay show={loading} message="로그인 중..." />
    </div>
  );
}
