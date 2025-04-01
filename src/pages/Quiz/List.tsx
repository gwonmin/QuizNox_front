import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setQuestions,
  setTopicId,
  setScrollIndex,
} from "../../store/quizSlice";
import { RootState } from "../../store";
import { FixedSizeList as List } from "react-window";
import { Question } from "../../types/quiz";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

function mapQuestion(res: any): Question[] {
  return res.map(
    (e: {
      topic_id: string;
      question_number: string;
      question_text: string;
      choices: string[];
      most_voted_answer: string;
    }) => ({
      questionNumber: Number(e.question_number),
      questionText: e.question_text,
      choices: e.choices,
      mostVotedAnswer: e.most_voted_answer,
    })
  );
}

export default function QuestionListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get("topicId");

  const dispatch = useDispatch();
  const scrollIndex = useSelector((state: RootState) => state.quiz.scrollIndex);
  const existingQuestions = useSelector(
    (state: RootState) => state.quiz.questions
  );
  const existingTopicId = useSelector((state: RootState) => state.quiz.topicId);
  const [questions, setLocalQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (!topicId) return;

    if (existingQuestions.length > 0 && existingTopicId === topicId) {
      setLocalQuestions(existingQuestions);
      return;
    }

    fetch(`${API_URL}/questions?topicId=${topicId}`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = mapQuestion(data);
        dispatch(setQuestions(mapped));
        dispatch(setTopicId(topicId));
        setLocalQuestions(mapped);
      });
  }, [topicId, dispatch, existingQuestions, existingTopicId]);

  if (!topicId) {
    return <p className="p-4 text-center text-red-500">쿼리가 없습니다.</p>;
  }

  if (!questions.length) {
    return <p className="p-4 text-center">문제를 불러오는 중입니다...</p>;
  }

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const q = questions[index];
    return (
      <div style={style} className="flex justify-center">
        <button
          onClick={() => {
            dispatch(setScrollIndex(index)); // 현재 인덱스 저장
            navigate(`/quiz/play?topicId=${topicId}&q=${q.questionNumber}`);
          }}
          className="w-full p-4 bg-white shadow-md rounded-md text-left hover:shadow-lg transition"
        >
          <p className="text-sm font-semibold text-gray-600 mb-2">
            문제 {q.questionNumber}
          </p>

          <h1 className="text-base md:text-lg font-semibold leading-relaxed line-clamp-2 text-gray-800">
            {q.questionText || "내용 없음"}
          </h1>
        </button>
      </div>
    );
  };

  return (
    <main className="p-4 mx-auto">
      <h2 className="text-xl font-bold mb-6 text-center">
        전체 문제 목록 ({questions.length}개)
      </h2>
      <List
        height={600}
        itemCount={questions.length}
        itemSize={112}
        width="100%"
        initialScrollOffset={scrollIndex * 112}
      >
        {Row}
      </List>
    </main>
  );
}
