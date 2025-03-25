import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions, setTableName } from "../../store/quizSlice";
import { RootState } from "../../store";
import { FixedSizeList as List } from "react-window";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

interface Question {
  questionNumber: number;
  questionText: string;
  choices: string[];
  mostVotedAnswer: string;
}

function mapQuestion(res: any): Question[] {
  return res.map(
    (e: {
      question_number: string;
      data: {
        question_text: string;
        choices: string[];
        most_voted_answer: string;
      };
    }) => ({
      questionNumber: Number(e.question_number),
      questionText: e.data.question_text,
      choices: e.data.choices,
      mostVotedAnswer: e.data.most_voted_answer,
    })
  );
}

export default function QuestionListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const tableName = searchParams.get("tableName");
  const existingQuestions = useSelector(
    (state: RootState) => state.quiz.questions
  );
  const existingTableName = useSelector(
    (state: RootState) => state.quiz.tableName
  );
  const [questions, setLocalQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (!tableName) return;

    if (existingQuestions.length > 0 && existingTableName === tableName) {
      setLocalQuestions(existingQuestions);
      return;
    }

    fetch(`${API_URL}/questions?tableName=${tableName}`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = mapQuestion(data);
        dispatch(setQuestions(mapped));
        dispatch(setTableName(tableName));
        setLocalQuestions(mapped);
      });
  }, [tableName, dispatch, existingQuestions, existingTableName]);

  if (!tableName) {
    return (
      <p className="p-4 text-center text-red-500">tableName 쿼리가 없습니다.</p>
    );
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
          onClick={() =>
            navigate(`/quiz/play?tableName=${tableName}&q=${q.questionNumber}`)
          }
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
      >
        {Row}
      </List>
    </main>
  );
}
