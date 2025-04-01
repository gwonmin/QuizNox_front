import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setScrollIndex } from "../../store/quizSlice";

export default function QuizPlayPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = Number(searchParams.get("q"));
  const tableName = searchParams.get("tableName");

  const dispatch = useDispatch();
  const questions = useSelector((state: RootState) => state.quiz.questions);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (!q || !questions.length) return;
    const index = questions.findIndex((qz) => qz.questionNumber === q);
    if (index >= 0) {
      setCurrentIndex(index);
    }
  }, [q, questions]);

  if (!questions.length)
    return <p className="text-center p-4">문제 데이터가 없습니다.</p>;

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return <p className="text-center p-4">문제 데이터를 찾을 수 없습니다.</p>;
  }

  const handleAnswerToggle = (choice: string) => {
    setSelectedAnswers((prev) =>
      prev.includes(choice)
        ? prev.filter((ans) => ans !== choice)
        : [...prev, choice]
    );
  };

  const checkAnswer = () => {
    const isCorrect =
      selectedAnswers.length > 0 &&
      selectedAnswers.every((answer) =>
        currentQuestion.mostVotedAnswer.includes(answer)
      ) &&
      currentQuestion.mostVotedAnswer.length === selectedAnswers.length;

    setIsCorrect(isCorrect);
    setShowAnswer(true);
  };

  return (
    <div className="mx-auto p-4 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-2">
        {/* ← 버튼 */}
        <button
          onClick={() => {
            setCurrentIndex((prev) => Math.max(prev - 1, 0));
            dispatch(setScrollIndex(currentIndex - 1)); // 현재 인덱스 저장
            setShowAnswer(false);
            setIsCorrect(null);
            setSelectedAnswers([]);
          }}
          disabled={currentIndex === 0}
          className="text-xl disabled:opacity-30 border rounded-md p-1 bg-gray-300"
        >
          ←
        </button>

        {/* 문제 목록으로 */}
        <button
          onClick={() => navigate(`/quiz/list?tableName=${tableName}`)}
          className="text-blue-600 underline"
        >
          문제 목록으로 돌아가기
        </button>

        {/* → 버튼 */}
        <button
          onClick={() => {
            if (currentIndex < questions.length - 1) {
              setCurrentIndex((prev) => prev + 1);
              dispatch(setScrollIndex(currentIndex + 1)); // 현재 인덱스 저장
              setShowAnswer(false);
              setIsCorrect(null);
              setSelectedAnswers([]);
            }
          }}
          disabled={currentIndex === questions.length - 1}
          className="text-xl disabled:opacity-30 border rounded-md p-1 bg-gray-300"
        >
          →
        </button>
      </div>

      <h1 className="text-base md:text-lg font-semibold leading-relaxed mb-4">
        {currentQuestion.questionNumber}. {currentQuestion.questionText}
      </h1>

      <div className="flex flex-col gap-2">
        {currentQuestion.choices.map((choice, index) => {
          const answer = choice.substring(0, 1);
          const text = choice.substring(2).replace(/\s*Most Voted$/, "");
          return (
            <button
              key={index}
              onClick={() => handleAnswerToggle(answer)}
              className={`flex items-center p-2 border rounded-md text-left ${
                selectedAnswers.includes(answer)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              <span className="font-semibold mr-2">{answer}</span>
              <span className="flex-1">{text}</span>
            </button>
          );
        })}
      </div>

      {showAnswer && (
        <div
          className={`mt-4 p-3 rounded-md text-center font-semibold shadow ${
            isCorrect
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isCorrect
            ? "정답입니다! 🎉"
            : `틀렸습니다. 정답: ${currentQuestion.mostVotedAnswer}`}
        </div>
      )}

      <div className="mt-3 flex justify-center">
        <button
          onClick={checkAnswer}
          className="p-3 bg-yellow-500 text-white rounded-md disabled:opacity-40"
          disabled={selectedAnswers.length === 0}
        >
          정답 확인
        </button>
      </div>
    </div>
  );
}
