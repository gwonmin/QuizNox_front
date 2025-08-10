import React from "react";
import { QuestionCardProps } from "../types/components";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

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
    <Card
      className="w-full cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`문제 ${question.questionNumber}로 이동`}
    >
      <CardHeader className="pb-1 px-3 md:px-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-muted-foreground">
            문제 {question.questionNumber}
          </p>
          {isSelected && (
            <Badge variant="default" className="text-xs">
              현재 문제
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-3 md:px-4 pb-2">
        <CardTitle className="text-sm md:text-base leading-tight break-words line-clamp-2">
          {question.questionText || "내용 없음"}
        </CardTitle>
      </CardContent>
    </Card>
  );
}
