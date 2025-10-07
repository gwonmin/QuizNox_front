import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuizStore } from "../../store/quizStore";
import { useQuestions } from "../../hooks/queries/useQuizQueries";
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

  const {
    scrollIndex,
    setScrollIndex,
    setQuestions,
  } = useQuizStore();

  // TanStack Query로 문제 데이터 가져오기
  const {
    data: questions = [],
    isLoading: loading,
    error,
  } = useQuestions(topicId || '');

  // 문제 데이터가 로드되면 스토어에 저장
  useEffect(() => {
    if (questions.length > 0 && topicId) {
      setQuestions(questions);
    }
  }, [questions, topicId, setQuestions]);





  // 리스트 높이 업데이트 함수 - Navbar와 main 패딩 고려
  const updateListHeight = useCallback(() => {
    if (!containerRef.current) return;
    
    // Navbar 높이 (p-4 = 16px * 2 + 텍스트 높이 ≈ 64px)
    const navbarHeight = 64;
    // main 요소의 상하 패딩 (py-8 = 32px * 2 = 64px)
    const mainPadding = 64;
    // 제목 높이
    const titleHeight = 60;
    
    // 사용 가능한 높이 계산
    const availableHeight = window.innerHeight - navbarHeight - mainPadding - titleHeight;
    const newHeight = Math.max(300, availableHeight);
    
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
    
    // 모바일에서는 orientationchange 이벤트도 감지
    const handleOrientationChange = () => {
      // 방향 전환 후 약간의 지연을 두고 높이 재계산
      setTimeout(() => {
        updateListHeight();
      }, 300);
    };
    
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);
    
    // visualViewport API 이벤트 (모바일에서 주소창 숨김/표시 감지)
    if (window.visualViewport) {
      const handleViewportResize = () => {
        updateListHeight();
      };
      window.visualViewport.addEventListener("resize", handleViewportResize);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleOrientationChange);
        if (window.visualViewport) {
          window.visualViewport.removeEventListener("resize", handleViewportResize);
        }
      };
    }
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
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
    setScrollIndex(
      questions.findIndex((q) => q.questionNumber === questionNumber)
    );
    navigate(`/quiz/play?topicId=${topicId}&q=${questionNumber}`);
  };

  // 아이템 크기 설정
  const itemSize = useMemo(() => {
    // 터치하기 쉽도록 80px로 설정
    return 80;
  }, []);

  // 동적 아이템 크기 계산 함수
  const getItemSize = useCallback((index: number) => {
    const question = questions[index];
    if (!question) return itemSize;
    
    // 문제 텍스트 길이에 따라 크기 조정
    const textLength = question.questionText?.length || 0;
    if (textLength > 100) return 95; // 긴 문제
    if (textLength > 60) return 90;  // 중간 문제
    return 80; // 짧은 문제
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="p-4 text-center text-destructive">{error.message}</p>;
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
       <div style={{
         ...style,
         // 카드 간 공백 완전 제거
         margin: 0,
         padding: 0,
         border: 'none',
         outline: 'none'
       }}>
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
          height: '100%',
          maxHeight: '100%',
          overflow: 'hidden'
        }}
      >
        <h2 className="text-lg md:text-xl font-bold mb-5 text-center text-foreground flex-shrink-0">
          전체 문제 목록 ({questions.length}개)
        </h2>
        <div 
          className="flex-1 overflow-hidden" 
          style={{ 
            scrollbarWidth: 'auto',
            msOverflowStyle: 'auto',
            WebkitOverflowScrolling: 'touch',
            // 스크롤 영역을 명확히 제한 - Navbar와 main 패딩 고려
            height: '100%',
            maxHeight: '100%',
            overflow: 'hidden'
          }}
        >
          <List
            height={listHeight}
            itemCount={questions.length}
            itemSize={getItemSize}
            width="100%"
            initialScrollOffset={initialScrollOffset}
            estimatedItemSize={itemSize}
                         className="[&::-webkit-scrollbar]:w-4 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-blue-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-blue-500 [&::-webkit-scrollbar]:always-visible"
            style={{ 
              padding: 0, 
              margin: 0,
              scrollbarWidth: 'auto',
              msOverflowStyle: 'auto',
              // 카드 간 공백 완전 제거
              gap: 0,
              rowGap: 0,
              columnGap: 0,
              // 전체 화면 스크롤 방지
              overflow: 'auto'
            }}
          >
            {Row}
          </List>
        </div>
      </div>
    </ErrorBoundary>
  );
}
