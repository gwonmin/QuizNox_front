import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function MockExam() {
  return (
    <div className="text-center max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">모의고사</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">실전처럼 모의고사를 풀어보세요.</p>
        </CardContent>
      </Card>
    </div>
  );
}
