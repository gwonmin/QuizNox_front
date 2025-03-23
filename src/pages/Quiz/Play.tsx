import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export default function QuizPlayPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = Number(searchParams.get("q"));
  const tableName = searchParams.get("tableName");

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
    <div className="max-w-sm mx-auto p-4 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-semibold text-gray-600">
          문제 {currentQuestion.questionNumber}
        </p>
        <button
          onClick={() => navigate(`/quiz/list?tableName=${tableName}`)}
          className="text-blue-600 underline text-sm"
        >
          목록으로
        </button>
      </div>

      <h1 className="text-base md:text-lg font-semibold leading-relaxed mb-4">
        {currentQuestion.questionText}
      </h1>

      <div className="flex flex-col gap-2">
        {currentQuestion.choices.map((choice, index) => {
          const [answer, text] = choice.split(".");
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

      <div className="flex justify-between mt-4">
        <button
          onClick={() => {
            setCurrentIndex((prev) => Math.max(prev - 1, 0));
            setShowAnswer(false);
            setIsCorrect(null);
            setSelectedAnswers([]);
          }}
          className="p-2 bg-gray-500 text-white rounded-md disabled:opacity-50"
          disabled={currentIndex === 0}
        >
          이전 문제
        </button>
        <button
          onClick={checkAnswer}
          className="p-2 bg-yellow-500 text-white rounded-md"
        >
          정답 확인
        </button>
        <button
          onClick={() => {
            if (currentIndex < questions.length - 1) {
              setCurrentIndex((prev) => prev + 1);
              setShowAnswer(false);
              setIsCorrect(null);
              setSelectedAnswers([]);
            }
          }}
          className="p-2 bg-green-500 text-white rounded-md disabled:opacity-50"
          disabled={!selectedAnswers.length}
        >
          다음 문제
        </button>
      </div>

      {showAnswer && (
        <p
          className={`mt-4 p-2 text-center rounded-md ${
            isCorrect ? "bg-green-200" : "bg-red-200"
          }`}
        >
          {isCorrect
            ? "정답입니다! 🎉"
            : `틀렸습니다. 정답: ${currentQuestion.mostVotedAnswer}`}
        </p>
      )}
    </div>
  );
}
