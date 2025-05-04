import React from "react";
import { QuestionCardProps } from "../types/components";

/**
 * 문제 카드 컴포넌트
 * @param {QuestionCardProps} props - 컴포넌트 props
 * @returns {JSX.Element} 문제 카드 컴포넌트
 */
export const QuestionCard: React.FC<QuestionCardProps> = React.memo(
  ({ question, onClick, isSelected = false }) => {
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
        className={`w-full p-4 bg-white shadow-md rounded-md text-left hover:shadow-lg transition ${
          isSelected ? "ring-2 ring-blue-500" : ""
        }`}
      >
        <p className="text-sm font-semibold text-gray-600 mb-2">
          문제 {question.questionNumber}
        </p>
        <h1 className="text-base md:text-lg font-semibold leading-relaxed line-clamp-2 text-gray-800">
          {question.questionText || "내용 없음"}
        </h1>
      </button>
    );
  }
);
