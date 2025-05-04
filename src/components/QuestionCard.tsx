import React from "react";
import { QuestionCardProps } from "../types/components";

/**
 * 문제 카드 컴포넌트
 * @param {QuestionCardProps} props - 문제 카드 컴포넌트의 props
 * @returns {JSX.Element} 문제 카드 컴포넌트
 */
export function QuestionCard({
  question,
  onClick,
  isSelected,
}: QuestionCardProps) {
  const handleClick = () => {
    onClick(question.questionNumber);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`문제 ${question.questionNumber}로 이동`}
      className={`w-full p-4 bg-white shadow-md rounded-md text-left hover:shadow-lg transition`}
    >
      <p
        className={`text-sm font-semibold mb-2 ${
          isSelected ? "text-blue-600 font-bold" : "text-gray-600"
        }`}
      >
        문제 {question.questionNumber}
      </p>
      <h1 className="text-base md:text-lg font-semibold leading-relaxed line-clamp-2 text-gray-800">
        {question.questionText || "내용 없음"}
      </h1>
    </button>
  );
}
