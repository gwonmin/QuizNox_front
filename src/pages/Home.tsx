export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <p className="text-md text-gray-600 leading-relaxed">
          이 서비스는 덤프 퀴즈 플랫폼이에요.
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
        <h1 className="text-2xl font-bold text-gray-800">
          🛠️ 기술 스택
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 프론트엔드 섹션 */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            🎨 프론트엔드
          </h2>
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-1">프레임워크</h4>
              <p className="text-blue-600 text-sm">React 19+ Vite 6</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-1">언어</h4>
              <p className="text-blue-600 text-sm">TypeScript 5</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-1">상태 관리</h4>
              <p className="text-blue-600 text-sm">Redux Toolkit</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-1">스타일링</h4>
              <p className="text-blue-600 text-sm">Tailwind CSS</p>
            </div>
          </div>
        </div>

        {/* 백엔드 섹션 */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            ⚙️ 백엔드
          </h2>
          <div className="space-y-3">
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-1">서버 프레임워크</h4>
              <p className="text-green-600 text-sm">Fastify</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-1">데이터베이스</h4>
              <p className="text-green-600 text-sm">DynamoDB</p>
            </div>
          </div>
        </div>

        {/* 인프라/배포 섹션 */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            🚀 인프라 & 배포
          </h2>
          <div className="space-y-3">
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
          </div>
        </div>
      </div>

      {/* 아키텍처 설명 */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          🏗️ 아키텍처 개요
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">프론트엔드</h4>
            <p className="text-gray-600 text-sm">
              React 19와 Vite를 기반으로 한 SPA로, Tailwind CSS로 스타일링됩니다. 
              Redux Toolkit으로 상태를 관리하며, react-window로 대용량 리스트를 최적화합니다.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">백엔드</h4>
            <p className="text-gray-600 text-sm">
              Fastify 기반의 서버리스 API로, DynamoDB를 데이터베이스로 사용합니다. 
              AWS Lambda에서 실행되며, API Gateway를 통해 HTTP 요청을 처리합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
