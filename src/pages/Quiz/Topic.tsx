import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setScrollIndex } from "../../store/quizSlice";
const QUIZ_TOPICS = [
  { id: "AWS_DVA", name: "AWS Certified Developer - Associate(DVA-C02)" },
  {
    id: "AWS_SAA",
    name: "AWS Certified Solutions Architect - Associate(SAA-C03)",
  },
];

export default function QuizListPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setScrollIndex(0));
  }, [dispatch]);

  return (
    <main className="flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-bold mb-4 text-center">문제 유형 선택</h1>
      <ul className="space-y-2">
        {QUIZ_TOPICS.map((topic) => (
          <li key={topic.id}>
            <Link
              className="text-blue-600 underline"
              to={`/quiz/list?topicId=${topic.id}`}
            >
              {topic.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
