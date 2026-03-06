import type React from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuizStore } from "../../store/quizStore";
import { useQuestions } from "../queries/useQuizQueries";

function useVirtualListHeight(
  containerRef: React.RefObject<HTMLDivElement | null>,
  contentLength: number,
) {
  const [listHeight, setListHeight] = useState(600);

  const updateListHeight = useCallback(() => {
    if (!containerRef.current) return;

    const navbarHeight = 64;
    const mainPadding = 64;
    const titleHeight = 60;

    const availableHeight =
      window.innerHeight - navbarHeight - mainPadding - titleHeight;
    const newHeight = Math.max(300, availableHeight);

    setListHeight(newHeight);
  }, [containerRef]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateListHeight();
    }, 100);

    const handleResize = () => {
      updateListHeight();
    };

    const handleOrientationChange = () => {
      setTimeout(() => {
        updateListHeight();
      }, 300);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

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
          window.visualViewport.removeEventListener(
            "resize",
            handleViewportResize,
          );
        }
      };
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [updateListHeight]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateListHeight();
    }, 50);

    return () => clearTimeout(timer);
  }, [contentLength, updateListHeight]);

  return listHeight;
}

export function useQuizList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get("topicId");
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollIndex = useQuizStore((state) => state.scrollIndex);
  const setScrollIndex = useQuizStore((state) => state.setScrollIndex);

  const {
    data: questions = [],
    isLoading: loading,
    error,
  } = useQuestions(topicId || "");

  const listHeight = useVirtualListHeight(containerRef, questions.length);

  const handleQuestionClick = useCallback(
    (questionNumber: number) => {
      const index = questions.findIndex(
        (q) => q.questionNumber === questionNumber,
      );
      if (index >= 0) {
        setScrollIndex(index);
      }
      navigate(`/quiz/play?topicId=${topicId}&q=${questionNumber}`);
    },
    [navigate, questions, setScrollIndex, topicId],
  );

  const itemSize = useMemo(() => 80, []);

  const getItemSize = useCallback(
    (index: number) => {
      const question = questions[index];
      if (!question) return itemSize;

      const textLength = question.questionText?.length || 0;
      if (textLength > 100) return 95;
      if (textLength > 60) return 90;
      return 80;
    },
    [questions, itemSize],
  );

  const initialScrollOffset = useMemo(() => {
    let offset = 0;
    for (let i = 0; i < Math.min(scrollIndex, questions.length); i++) {
      offset += getItemSize(i);
    }
    return offset;
  }, [scrollIndex, questions.length, getItemSize]);

  return {
    topicId,
    containerRef,
    questions,
    loading,
    error,
    scrollIndex,
    listHeight,
    getItemSize,
    initialScrollOffset,
    handleQuestionClick,
  };
}

