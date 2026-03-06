import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useMockExamStart } from "../../hooks/mockExam/useMockExamStart";

export default function MockExamStart() {
  const {
    examInfo,
    examBasicInfo,
    invalid,
    goBack,
    handleStartExam,
  } = useMockExamStart();

  if (invalid) {
    return (
      <div className="text-center p-4">
        <p className="text-destructive">잘못된 시험 유형입니다.</p>
        <Button onClick={goBack} className="mt-4">
          모의고사 선택으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center p-4 max-w-2xl mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">모의고사 안내</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">{examInfo!.name}</h2>
            <p className="text-muted-foreground">
              실전과 동일한 환경에서 모의고사를 진행합니다
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">시험 정보</h3>
              <ul className="space-y-2 text-sm">
                <li>• 총 문제 수: {examBasicInfo.questionCount}문제</li>
                <li>• 시험 시간: {examBasicInfo.timeLimit}분</li>
                <li>• 합격 기준: {examBasicInfo.passThreshold}문제 이상 정답</li>
                <li>• 문제 유형: 객관식 (단일/복수 선택)</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-blue-800">주의사항</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• 시험 중 브라우저를 닫거나 새로고침하지 마세요</li>
                <li>• 시간이 만료되면 자동으로 제출됩니다</li>
                <li>• 답안은 자동으로 저장됩니다</li>
                <li>• 문제를 건너뛰고 나중에 다시 풀 수 있습니다</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={goBack} className="flex-1">
              돌아가기
            </Button>
            <Button
              onClick={handleStartExam}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              시험 시작
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
