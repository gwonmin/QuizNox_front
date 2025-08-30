import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setScrollIndex } from "../../store/quizSlice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

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
  {
    id: "AWS_SOA",
    name: "Associate(SOA-C02)",
    shortName: "AWS Certified SysOps Administrator",
  },
  {
    id: "AWS_DOP",
    name: "Professional(DOP-C02)",
    shortName: "AWS Certified DevOps Engineer",
  },
];

export default function QuizListPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setScrollIndex(0));
  }, [dispatch]);

  return (
    <main className="flex flex-col items-center justify-center p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-center text-foreground">
        문제 유형 선택
      </h1>
      <ul className="w-full space-y-3">
        {QUIZ_TOPICS.map((topic) => (
          <li key={topic.id}>
            <Link to={`/quiz/list?topicId=${topic.id}`}>
              <Card className="hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-foreground">
                    {topic.shortName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{topic.name}</p>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
