import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setScrollIndex } from "../../store/quizSlice";

const QUIZ_TOPICS = [
  {
    id: "AWS_DVA",
    name: "Associate(DVA-C02)",
    shortName: "AWS Certified Developer",
  },
  {
    id: "AWS_SAA",
    name: "Associate(SAA-C03)",
    shortName: "AWS Certified Solutions Architect",
  },
];

export default function QuizListPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setScrollIndex(0));
  }, [dispatch]);

  return (
    <main className="flex flex-col items-center justify-center p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-center">문제 유형 선택</h1>
      <ul className="w-full space-y-3">
        {QUIZ_TOPICS.map((topic) => (
          <li key={topic.id}>
            <Link
              className="block p-4 bg-white shadow-md rounded-md hover:shadow-lg transition active:scale-[0.98]"
              to={`/quiz/list?topicId=${topic.id}`}
            >
              <h2 className="text-base font-semibold text-gray-800">
                {topic.shortName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{topic.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
