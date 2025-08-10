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
      className="w-full cursor-pointer transition-all duration-200 hover:bg-muted/30"
      style={{
        borderRadius: 0,
        margin: 0,
        padding: 0,
        border: 'none'
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`문제 ${question.questionNumber}로 이동`}
    >
      <CardHeader className="!p-0" style={{ padding: '4px 8px 2px 8px' }}>
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
      <CardContent className="!p-0" style={{ padding: '0 8px 4px 8px' }}>
        <CardTitle className="text-sm md:text-base leading-tight break-words line-clamp-2">
          {question.questionText || "내용 없음"}
        </CardTitle>
      </CardContent>
    </Card>
  );
}
