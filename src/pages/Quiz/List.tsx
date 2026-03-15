import type React from "react";
import { useNavigate } from "react-router-dom";
import { VariableSizeList as List } from "react-window";
import { QuestionCard } from "../../components/QuestionCard";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { Button } from "../../components/ui/button";
import { useQuizList } from "../../hooks/quiz/useQuizList";

/**
 * 문제 목록 페이지 컴포넌트
 * @returns {JSX.Element} 문제 목록 페이지 컴포넌트
 */
export default function QuestionListPage() {
  const navigate = useNavigate();
  const {
    topicId,
    containerRef,
    listRef,
    questions,
    loading,
    error,
    scrollIndex,
    listHeight,
    getItemSize,
    initialScrollOffset,
    handleQuestionClick,
  } = useQuizList();

  if (!topicId) {
    return <p className="p-4 text-center text-destructive">쿼리가 없습니다.</p>;
  }

  if (loading) {
    return (
      <>
        <LoadingOverlay show={true} />
      </>
    );
  }

  if (error) {
    return <p className="p-4 text-center text-destructive">{error.message}</p>;
  }

  if (!questions.length) {
    return (
      <p className="p-4 text-center text-muted-foreground">문제가 없습니다.</p>
    );
  }

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const question = questions[index];
    return (
      <div
        style={{
          ...style,
          // 카드 간 공백 완전 제거
          margin: 0,
          padding: 0,
          border: "none",
          outline: "none",
        }}
      >
        <QuestionCard
          question={question}
          onClick={handleQuestionClick}
          isSelected={index === scrollIndex}
        />
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div
        ref={containerRef}
        className="h-full flex flex-col overflow-hidden"
        style={{
          // 전체 화면 스크롤 방지 - Navbar와 main 패딩 고려
          height: "100%",
          maxHeight: "100%",
          overflow: "hidden",
        }}
      >
        <div className="mb-4 flex items-center justify-between gap-3 flex-shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-foreground">
            전체 문제 목록 ({questions.length}개)
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs md:text-sm text-primary"
            onClick={() => navigate("/quiz/topic")}
          >
            문제 유형으로 돌아가기
          </Button>
        </div>
        <div
          className="flex-1 overflow-hidden"
          style={{
            scrollbarWidth: "auto",
            msOverflowStyle: "auto",
            WebkitOverflowScrolling: "touch",
            // 스크롤 영역을 명확히 제한 - Navbar와 main 패딩 고려
            height: "100%",
            maxHeight: "100%",
            overflow: "hidden",
          }}
        >
          <List
            ref={listRef}
            height={listHeight}
            itemCount={questions.length}
            itemSize={getItemSize}
            width="100%"
            initialScrollOffset={initialScrollOffset}
            estimatedItemSize={80}
            className="[&::-webkit-scrollbar]:w-4 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-blue-500 [&::-webkit-scrollbar]:always-visible"
            style={{
              padding: 0,
              margin: 0,
              scrollbarWidth: "auto",
              msOverflowStyle: "auto",
              // 카드 간 공백 완전 제거
              gap: 0,
              rowGap: 0,
              columnGap: 0,
              // 전체 화면 스크롤 방지
              overflow: "auto",
            }}
          >
            {Row}
          </List>
        </div>
      </div>
    </ErrorBoundary>
  );
}
