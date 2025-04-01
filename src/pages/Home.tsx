export default function Home() {
  return (
    <div className="text-center">
      <p className="text-gray-600 mt-2">
        이 서비스는 덤프 퀴즈 플랫폼이에요.
        <br />
        <br />
        문제에 오류가 있으면 알려주세요.
        <br />
        최대한 빠른 시일 내로 개선할께요.
        <br />
        <br />
        신규 문제 추가도 가능합니다.
        <br />
        덤프 데이터 있으신 분들은 연락주세요.
        <br />
      </p>
      <p className="text-gray-600 mt-2">
        <br />
        유익했다면 작은 후원으로 응원해주세요! 🙌
      </p>

      <div className="mt-6 flex justify-center">
        <a
          href="https://www.buymeacoffee.com/gwonmin"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="hover:scale-105 transition-transform"
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            style={{ height: "40px", width: "150px" }}
          />
        </a>
      </div>
    </div>
  );
}
