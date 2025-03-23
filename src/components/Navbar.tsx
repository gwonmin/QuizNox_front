import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 bg-blue-600 text-white relative">
      <h1 className="text-lg font-bold">QUIZNOX</h1>

      {/* PC 네비게이션 */}
      <div className="hidden md:flex gap-4">
        <Link to="/home">홈</Link>
        <Link to="/quiz/topic">문제풀기</Link>
        <Link to="/mock-exam">모의고사</Link>
      </div>

      {/* 모바일 메뉴 버튼 */}
      <button
        className="md:hidden"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        ☰
      </button>

      {/* 모바일 메뉴 애니메이션 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, scaleY: 0.8 }}
            animate={{ height: "auto", opacity: 1, scaleY: 1 }}
            exit={{ height: 0, opacity: 0, scaleY: 0.8 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute top-14 left-0 w-full bg-blue-700 flex flex-col p-4 origin-top overflow-hidden"
          >
            <Link
              to="/home"
              className="py-2"
              onClick={() => setMenuOpen(false)}
            >
              홈
            </Link>
            <Link
              to="/quiz/topic"
              className="py-2"
              onClick={() => setMenuOpen(false)}
            >
              문제풀기
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
