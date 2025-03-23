import { Link } from "react-router-dom";

const QUIZ_TOPICS = [
  { id: "DvaDumps", name: "AWS Certified Developer - Associate" },
];

export default function QuizListPage() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">문제 유형 선택</h1>
      <ul className="space-y-2">
        {QUIZ_TOPICS.map((topic) => (
          <li key={topic.id}>
            <Link
              className="text-blue-600 underline"
              to={`/quiz/list?tableName=${topic.id}`}
            >
              {topic.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
