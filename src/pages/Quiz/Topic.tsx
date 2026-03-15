import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuizTopic } from "../../hooks/quiz/useQuizTopic";
import { useProgress } from "../../hooks/queries/useQuizQueries";
import { ResumeQuizDialog } from "../../components/quiz/ResumeQuizDialog";
import type { ProgressItem } from "../../services/api/progressApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export default function QuizListPage() {
  const navigate = useNavigate();
  const { topics } = useQuizTopic();
  const { data: progressList } = useProgress();

  const progressMap = useMemo(() => {
    const map = new Map<string, ProgressItem>();
    progressList?.forEach((p) => map.set(p.topic_id, p));
    return map;
  }, [progressList]);

  const latestProgress = useMemo(() => {
    if (!progressList?.length) return null;
    return [...progressList].sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )[0];
  }, [progressList]);

  const [dismissed, setDismissed] = useState(false);
  const showResumeDialog = !!latestProgress && !dismissed;

  const handleResume = () => {
    if (!latestProgress) return;
    setDismissed(true);
    navigate(
      `/quiz/play?topicId=${latestProgress.topic_id}&q=${latestProgress.question_number + 1}`,
    );
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <main className="flex flex-col items-center justify-center p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-center text-foreground">
        문제 유형 선택
      </h1>
      <ul className="w-full space-y-3">
        {topics.map((topic) => {
          const prog = progressMap.get(topic.id);
          return (
            <li key={topic.id}>
              <Link to={`/quiz/list?topicId=${topic.id}`}>
                <Card className="hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base text-foreground">
                        {topic.shortName}
                      </CardTitle>
                      {prog && (
                        <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
                          #{prog.question_number} 풀이 완료
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      {topic.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>

      {latestProgress && (
        <ResumeQuizDialog
          open={showResumeDialog}
          progress={latestProgress}
          onResume={handleResume}
          onDismiss={handleDismiss}
        />
      )}
    </main>
  );
}
