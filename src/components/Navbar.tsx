import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/quiz/play";
  return (
    !hideNavbar && (
      <nav className="flex items-center justify-between p-4 bg-primary text-primary-foreground relative">
        <Link to="/" className="text-lg font-bold">
          QUIZNOX
        </Link>

        <div className="hidden md:flex gap-4">
          <Link to="/" className="hover:text-primary-foreground/80 transition-colors">
            홈
          </Link>
          <Link to="/quiz/topic" className="hover:text-primary-foreground/80 transition-colors">
            문제풀기
          </Link>
          <Link to="/mock-exam" className="hover:text-primary-foreground/80 transition-colors">
            모의고사
          </Link>
        </div>

        <div className="md:hidden">
          <Link to="/quiz/topic" className="text-primary-foreground hover:text-primary-foreground/80 transition-colors">
            문제풀기
          </Link>
        </div>
      </nav>
    )
  );
}
