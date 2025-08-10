import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { setScrollIndex, fetchQuestions } from "../../store/quizSlice";
import { VariableSizeList as List } from "react-window";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState(600);

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

  // 리스트 높이 업데이트 함수
  const updateListHeight = useCallback(() => {
    if (!containerRef.current) return;
    
    // 컨테이너의 실제 높이 계산
    const container = containerRef.current;
    const containerHeight = container.clientHeight;
    
    // 제목과 여백을 고려한 리스트 높이 계산
    const titleHeight = 80; // 제목 + 여백
    const newHeight = Math.max(400, containerHeight - titleHeight);
    
    setListHeight(newHeight);
  }, []);

  // 창 크기 변경 시 리스트 높이 업데이트
  useEffect(() => {
    // 초기 높이 설정 (약간의 지연을 두어 DOM이 완전히 렌더링된 후 실행)
    const timer = setTimeout(() => {
      updateListHeight();
    }, 100);
    
    // 리사이즈 이벤트 리스너 추가
    const handleResize = () => {
      updateListHeight();
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [updateListHeight]);

  // questions가 로드된 후 높이 재계산
  useEffect(() => {
    if (questions.length > 0) {
      // DOM이 업데이트된 후 높이 재계산
      const timer = setTimeout(() => {
        updateListHeight();
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [questions.length, updateListHeight]);

  const handleQuestionClick = (questionNumber: number) => {
    dispatch(
      setScrollIndex(
        questions.findIndex((q) => q.questionNumber === questionNumber)
      )
    );
    navigate(`/quiz/play?topicId=${topicId}&q=${questionNumber}`);
  };

  // 모바일에서는 더 큰 아이템 크기 사용하여 내용이 잘리지 않도록 함
  const itemSize = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    // 모바일에서는 문제 텍스트 길이에 따라 동적으로 크기 조정
    if (isMobile) {
      // 기본 크기를 120px로 늘리고, 긴 문제는 더 큰 크기 할당
      return 120;
    }
    return 112;
  }, []);

  // 동적 아이템 크기 계산 함수
  const getItemSize = useCallback((index: number) => {
    const question = questions[index];
    if (!question) return itemSize;
    
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return itemSize;
    
    // 모바일에서는 문제 텍스트 길이에 따라 크기 조정
    const textLength = question.questionText?.length || 0;
    if (textLength > 100) return 140; // 긴 문제
    if (textLength > 60) return 130;  // 중간 문제
    return 120; // 짧은 문제
  }, [questions, itemSize]);

  // VariableSizeList를 사용하므로 기본 아이템 크기로 초기 스크롤 오프셋 계산
  const initialScrollOffset = useMemo(() => {
    let offset = 0;
    for (let i = 0; i < Math.min(scrollIndex, questions.length); i++) {
      offset += getItemSize(i);
    }
    return offset;
  }, [scrollIndex, questions.length, getItemSize]);

  if (!topicId) {
    return <p className="p-4 text-center text-destructive">쿼리가 없습니다.</p>;
  }

  if (loading === "loading") {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="p-4 text-center text-destructive">{error}</p>;
  }

  if (!questions.length) {
    return <p className="p-4 text-center text-muted-foreground">문제가 없습니다.</p>;
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
      <div 
        ref={containerRef}
        className="h-full flex flex-col"
      >
        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-center text-foreground">
          전체 문제 목록 ({questions.length}개)
        </h2>
        <div className="flex-1">
          <List
            height={listHeight}
            itemCount={questions.length}
            itemSize={getItemSize}
            width="100%"
            initialScrollOffset={initialScrollOffset}
            estimatedItemSize={itemSize}
            className="[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {Row}
          </List>
        </div>
      </div>
    </ErrorBoundary>
  );
}
