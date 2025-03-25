import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/quiz/play";
  return (
    !hideNavbar && (
      <nav className="flex items-center justify-between p-4 bg-blue-600 text-white relative">
        <Link to="/" className="text-lg font-bold">
          QUIZNOX
        </Link>

        <div className="hidden md:flex gap-4">
          <Link to="/">홈</Link>
          <Link to="/quiz/topic">문제풀기</Link>
          <Link to="/mock-exam">모의고사</Link>
        </div>

        <div className="md:hidden">
          <Link to="/quiz/topic" className="text-white">
            문제풀기
          </Link>
        </div>
      </nav>
    )
  );
}
