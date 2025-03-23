export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold mb-4 text-red-500">404</h1>
      <p className="text-lg mb-4">페이지를 찾을 수 없습니다.</p>
      <a href="/home" className="text-blue-500 underline">
        홈으로 돌아가기
      </a>
    </div>
  );
}
