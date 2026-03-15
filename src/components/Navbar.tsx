import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useLogout } from "../hooks/queries/useAuthQueries";
import { HandbookSearchInput } from "./handbook/HandbookSearchInput";
import { LoadingOverlay } from "./LoadingOverlay";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout(undefined, { onSuccess: () => navigate("/login") });
  };

  if (location.pathname === "/quiz/play") return null;

  return (
    <>
      <nav className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
        <Link to="/" className="shrink-0 text-lg font-bold">
          QUIZNOX
        </Link>

        <div className="ml-auto flex w-full max-w-xs items-center gap-3 md:max-w-sm">
          <HandbookSearchInput />

          {isAuthenticated ? (
            <div className="relative shrink-0" ref={menuRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
                aria-label="사용자 메뉴"
              >
                <svg
                  className="h-5 w-5"
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

              {open && (
                <div className="absolute right-0 z-50 mt-2 w-44 rounded-lg border border-border bg-popover py-1 shadow-lg">
                  <div className="border-b border-border px-3 py-2">
                    <p className="truncate text-sm font-medium text-popover-foreground">
                      {user?.username}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full px-3 py-2 text-left text-sm text-popover-foreground transition-colors hover:bg-accent disabled:opacity-50"
                  >
                    {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="shrink-0 rounded-md border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary-foreground/20"
            >
              로그인
            </Link>
          )}
        </div>
      </nav>

      <LoadingOverlay show={isLoggingOut} message="로그아웃 중..." />
    </>
  );
}
