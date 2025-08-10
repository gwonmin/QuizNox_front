import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-4xl text-destructive">404</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4 text-foreground">페이지를 찾을 수 없습니다.</p>
          <Button asChild variant="link" className="text-primary">
            <a href="/home">홈으로 돌아가기</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
