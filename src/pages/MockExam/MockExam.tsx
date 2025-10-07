import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useQuizStore } from "../../store/quizStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { EXAM_TYPES } from "../../constants/examTypes";

// 공통 상수에서 UI용 데이터 생성
const MOCK_EXAM_TYPES = Object.values(EXAM_TYPES).map(exam => ({
  id: exam.id,
  name: `${exam.level}(${exam.id.replace('AWS_', '')}-C02) 모의고사`,
  shortName: exam.name,
  timeLimit: exam.timeLimit,
  description: `${exam.timeLimit}분, ${exam.id === 'AWS_DOP' ? '75' : '65'}문제`,
  passThreshold: exam.passThreshold,
  level: exam.level,
}));

export default function MockExam() {
  const { setScrollIndex } = useQuizStore();
  
  useEffect(() => {
    setScrollIndex(0);
  }, [setScrollIndex]);

  return (
    <main className="flex flex-col items-center justify-center p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-center text-foreground">
        모의고사 유형 선택
      </h1>
      <ul className="w-full space-y-3">
        {MOCK_EXAM_TYPES.map((examType) => (
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
