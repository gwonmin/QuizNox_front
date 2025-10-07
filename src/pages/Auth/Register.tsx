import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useRegister } from '../../hooks/queries/useAuthQueries';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { LoadingOverlay } from '../../components/LoadingOverlay';

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated, clearError } = useAuthStore();
  const { mutate: register, isPending: loading, error } = useRegister();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
  });

  const [validationError, setValidationError] = useState('');

  // 이미 로그인된 경우 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // 컴포넌트 언마운트 시 에러 초기화
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setValidationError('');
  };

  const validateForm = (): boolean => {
    if (!formData.username || !formData.password || !formData.passwordConfirm) {
      setValidationError('모든 필드를 입력해주세요.');
      return false;
    }

    if (formData.username.length < 3 || formData.username.length > 20) {
      setValidationError('사용자명은 3-20자 사이여야 합니다.');
      return false;
    }

    // 사용자명은 영문, 숫자, 언더스코어만 허용
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(formData.username)) {
      setValidationError('사용자명은 영문, 숫자, 언더스코어(_)만 사용할 수 있습니다.');
      return false;
    }

    if (formData.password.length < 4) {
      setValidationError('비밀번호는 4자 이상이어야 합니다.');
      return false;
    }

    if (formData.password !== formData.passwordConfirm) {
      setValidationError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    register({
      username: formData.username,
      password: formData.password,
    }, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="w-full p-6 sm:p-8 shadow-2xl border-0">
          <div className="text-center mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">QuizNox</h1>
              <div className="w-12 sm:w-16 h-1 bg-green-600 mx-auto rounded-full"></div>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">회원가입</h2>
            <p className="text-sm sm:text-base text-gray-600">
              새 계정을 만들어 학습을 시작하세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {(error || validationError) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error?.message || validationError}</p>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                사용자명
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 sm:py-4 text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 touch-manipulation"
                placeholder="영문이름 포함 필수 (ex: gwonmin123)"
                autoComplete="username"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                20자 이내 영문, 숫자, 언더스코어(_)만 사용 가능
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 sm:py-4 text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 touch-manipulation"
                placeholder="비밀번호 (4자 이상)"
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-semibold text-gray-700 mb-2">
                비밀번호 확인
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                value={formData.passwordConfirm}
                onChange={handleChange}
                className="w-full px-4 py-3 sm:py-4 text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 touch-manipulation"
                placeholder="비밀번호 확인"
                autoComplete="new-password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 sm:py-4 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none touch-manipulation min-h-[48px]"
              disabled={loading}
            >
              {loading ? '가입 중...' : '회원가입'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link 
                to="/login" 
                className="text-green-600 hover:text-green-700 hover:underline font-semibold transition-colors touch-manipulation"
              >
                로그인
              </Link>
            </div>
          </form>
        </Card>
      </div>
      
      {/* 로딩 오버레이 */}
      <LoadingOverlay show={loading} message="회원가입 중..." />
    </div>
  );
}
