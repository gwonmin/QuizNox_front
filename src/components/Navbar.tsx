import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { RootState, AppDispatch } from "../store";
import { logout } from "../store/authSlice";
import { Button } from "./ui/button";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);
  const hideNavbar = location.pathname === "/quiz/play";
  
  // 드롭다운 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setIsMobileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // 드롭다운 닫기
      setIsDropdownOpen(false);
      setIsMobileDropdownOpen(false);
      
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen(!isMobileDropdownOpen);
  };

  return (
    !hideNavbar && (
      <nav className="flex items-center justify-between p-4 bg-primary text-primary-foreground relative">
        <Link to="/" className="text-lg font-bold">
          QUIZNOX
        </Link>

        <div className="hidden md:flex gap-4 items-center">
          <Link to="/" className="hover:text-primary-foreground/80 transition-colors">
            홈
          </Link>
          <Link to="/quiz/topic" className="hover:text-primary-foreground/80 transition-colors">
            문제풀기
          </Link>
          <Link to="/mock-exam" className="hover:text-primary-foreground/80 transition-colors">
            모의고사
          </Link>

          {isAuthenticated ? (
            <div className="relative ml-4" ref={dropdownRef}>
              {/* 사용자 아이콘 버튼 */}
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
                aria-label="사용자 메뉴"
              >
                <svg
                  className="w-6 h-6 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {/* 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* 사용자 정보 */}
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                    <p className="text-xs text-gray-500">환영합니다!</p>
                  </div>
                  
                  {/* 로그아웃 버튼 */}
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '로그아웃 중...' : '로그아웃'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2 ml-4">
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/30"
                >
                  로그인
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/30"
                >
                  회원가입
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* 모바일 메뉴 */}
        <div className="md:hidden flex items-center gap-2">
          <Link to="/quiz/topic" className="text-primary-foreground hover:text-primary-foreground/80 transition-colors">
            문제풀기
          </Link>
          {isAuthenticated ? (
            <div className="relative" ref={mobileDropdownRef}>
              {/* 모바일 사용자 아이콘 버튼 */}
              <button
                onClick={toggleMobileDropdown}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
                aria-label="사용자 메뉴"
              >
                <svg
                  className="w-5 h-5 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {/* 모바일 드롭다운 메뉴 */}
              {isMobileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* 사용자 정보 */}
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-900 truncate">{user?.username}</p>
                    <p className="text-xs text-gray-500">환영합니다!</p>
                  </div>
                  
                  {/* 로그아웃 버튼 */}
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '로그아웃 중...' : '로그아웃'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button
                variant="outline"
                size="sm"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/30 text-xs"
              >
                로그인
              </Button>
            </Link>
          )}
        </div>
      </nav>
    )
  );
}
