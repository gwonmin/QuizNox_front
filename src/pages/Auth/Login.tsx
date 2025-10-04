import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { login, clearError } from '../../store/authSlice';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setValidationError('');
  };

  const validateForm = (): boolean => {
    if (!formData.username || !formData.password) {
      setValidationError('사용자명과 비밀번호를 입력해주세요.');
      return false;
    }

    if (formData.username.length < 3 || formData.username.length > 20) {
      setValidationError('사용자명은 3-20자 사이여야 합니다.');
      return false;
    }

    if (formData.password.length < 4) {
      setValidationError('비밀번호는 4자 이상이어야 합니다.');
      return false;
    }

    // 사용자명은 영문, 숫자, 언더스코어만 허용
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(formData.username)) {
      setValidationError('사용자명은 영문, 숫자, 언더스코어(_)만 사용할 수 있습니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(login(formData)).unwrap();
      navigate('/');
    } catch (error) {
      // 에러는 Redux에서 처리
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="w-full p-6 sm:p-8 shadow-2xl border-0">
          <div className="text-center mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">QuizNox</h1>
              <div className="w-12 sm:w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">로그인</h2>
            <p className="text-sm sm:text-base text-gray-600">
              계정에 로그인하여 학습을 시작하세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {(error || validationError) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error || validationError}</p>
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
                className="w-full px-4 py-3 sm:py-4 text-base border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 touch-manipulation"
                autoComplete="username"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                영문, 숫자, 언더스코어(_)만 사용 가능
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
              {loading ? '로그인 중...' : '로그인'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              계정이 없으신가요?{' '}
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
    </div>
  );
}
