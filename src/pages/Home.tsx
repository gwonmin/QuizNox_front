import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <p className="text-md text-muted-foreground leading-relaxed">
          이 서비스는 덤프 퀴즈 플랫폼이에요.
          <br />
          (모의고사 기능은 PC, 테블릿 환경에서만 사용 가능합니다.)
          <br />
          <br />
          문제에 오류가 있는 경우 알려주세요.
          <br />
          최대한 빠른 시일 내로 개선할께요.
          <br />
          <br />
          공유해주시면 신규 문제 추가 가능합니다.
          <br />
        </p>
      </div>

      {/* 기술 스택 대제목 */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          🛠️ 기술 스택
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 프론트엔드 섹션 */}
        <Card className="border-l-4 border-primary">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              🎨 프론트엔드
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
              <h4 className="font-semibold text-primary mb-1">프레임워크</h4>
              <p className="text-primary text-sm">React 19+ Vite 6</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
              <h4 className="font-semibold text-primary mb-1">언어</h4>
              <p className="text-primary text-sm">TypeScript 5</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
              <h4 className="font-semibold text-primary mb-1">상태 관리</h4>
              <p className="text-primary text-sm">Redux Toolkit</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
              <h4 className="font-semibold text-primary mb-1">스타일링</h4>
              <p className="text-primary text-sm">Tailwind CSS</p>
            </div>
          </CardContent>
        </Card>

        {/* 백엔드 섹션 */}
        <Card className="border-l-4 border-green-500">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              ⚙️ 백엔드
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-1">서버 프레임워크</h4>
              <p className="text-green-600 text-sm">Fastify</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-1">데이터베이스</h4>
              <p className="text-green-600 text-sm">DynamoDB</p>
            </div>
          </CardContent>
        </Card>

        {/* 인프라/배포 섹션 */}
        <Card className="border-l-4 border-purple-500">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              🚀 인프라 & 배포
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-1">서버리스 인프라</h4>
              <p className="text-purple-600 text-sm">AWS Lambda + API Gateway</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-1">정적 호스팅</h4>
              <p className="text-purple-600 text-sm">AWS S3 + CloudFront</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-1">데이터베이스</h4>
              <p className="text-purple-600 text-sm">DynamoDB (NoSQL)</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-1">CDN</h4>
              <p className="text-purple-600 text-sm">CloudFront</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 아키텍처 설명 */}
      <div className="mt-8 bg-gradient-to-r from-primary/10 to-purple-50 rounded-lg p-6 border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
          🏗️ 아키텍처 개요
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-2">프론트엔드</h4>
            <p className="text-muted-foreground text-sm">
              React 19와 Vite를 기반으로 한 SPA로, Tailwind CSS로 스타일링됩니다. 
              Redux Toolkit으로 상태를 관리하며, react-window로 대용량 리스트를 최적화합니다.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">백엔드</h4>
            <p className="text-muted-foreground text-sm">
              Fastify 기반의 서버리스 API로, DynamoDB를 데이터베이스로 사용합니다. 
              AWS Lambda에서 실행되며, API Gateway를 통해 HTTP 요청을 처리합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
