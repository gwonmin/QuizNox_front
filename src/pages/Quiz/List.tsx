import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { setScrollIndex, fetchQuestions } from "../../store/quizSlice";
import { FixedSizeList as List } from "react-window";
import { QuestionCard } from "../../components/QuestionCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ErrorBoundary } from "../../components/ErrorBoundary";

/**
 * 문제 목록 페이지 컴포넌트
 * @returns {JSX.Element} 문제 목록 페이지 컴포넌트
 */
export default function QuestionListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get("topicId");

  const dispatch = useDispatch<AppDispatch>();
  const {
    questions,
    scrollIndex,
    loading,
    error,
    topicId: existingTopicId,
  } = useSelector((state: RootState) => state.quiz);

  useEffect(() => {
    if (!topicId) return;

    // 이미 같은 topicId의 데이터가 있으면 API 호출하지 않음
    if (existingTopicId === topicId && questions.length > 0) return;

    dispatch(fetchQuestions(topicId));
  }, [topicId, dispatch, existingTopicId, questions.length]);

  const handleQuestionClick = (questionNumber: number) => {
    dispatch(
      setScrollIndex(
        questions.findIndex((q) => q.questionNumber === questionNumber)
      )
    );
    navigate(`/quiz/play?topicId=${topicId}&q=${questionNumber}`);
  };

  const itemSize = useMemo(() => 112, []);
  const initialScrollOffset = useMemo(
    () => scrollIndex * itemSize,
    [scrollIndex]
  );

  if (!topicId) {
    return <p className="p-4 text-center text-red-500">쿼리가 없습니다.</p>;
  }

  if (loading === "loading") {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="p-4 text-center text-red-500">{error}</p>;
  }

  if (!questions.length) {
    return <p className="p-4 text-center">문제가 없습니다.</p>;
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
      <div style={style} className="flex justify-center">
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
      <main className="p-4 mx-auto">
        <h2 className="text-xl font-bold mb-6 text-center">
          전체 문제 목록 ({questions.length}개)
        </h2>
        <List
          height={600}
          itemCount={questions.length}
          itemSize={itemSize}
          width="100%"
          initialScrollOffset={initialScrollOffset}
        >
          {Row}
        </List>
      </main>
    </ErrorBoundary>
  );
}
