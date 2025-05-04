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
      <div className="flex items-center gap-2 mb-2">
        <p className="text-sm font-semibold text-gray-600">
          문제 {question.questionNumber}
        </p>
        {isSelected && (
          <span className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
            현재 문제
          </span>
        )}
      </div>
      <h1 className="text-base md:text-lg font-semibold leading-relaxed line-clamp-2 text-gray-800">
        {question.questionText || "내용 없음"}
      </h1>
    </button>
  );
}
