import { Link } from "react-router-dom";
import { useMockExamList } from "../../hooks/quiz/useMockExamList";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export default function MockExam() {
  const { mockExamTypes } = useMockExamList();

  return (
    <main className="flex flex-col items-center justify-center p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-center text-foreground">
        모의고사 유형 선택
      </h1>
      <ul className="w-full space-y-3">
        {mockExamTypes.map((examType) => (
          <li key={examType.id}>
            <Link to={`/mock-exam/start?type=${examType.id}`}>
              <Card className="hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-foreground">
                    {examType.shortName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-2">{examType.name}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>⏱️ {examType.description}</span>
                    <span>🎯 합격: {examType.passThreshold}문제 이상</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
