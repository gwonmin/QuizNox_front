import { Link } from "react-router-dom";

const FEATURES = [
  {
    title: "핸드북",
    description:
      "Systems Fundamentals, AWS 공통, SAA, DVA, SOA 자료로 개념을 정리하세요.",
    to: "/handbook",
  },
  {
    title: "기출문제",
    description:
      "토픽별 기출문제를 풀고 틀린 문제를 복습하며 실력을 다져보세요.",
    to: "/quiz/topic",
  },
  {
    title: "모의고사",
    description:
      "랜덤 추출 문항으로 실전 감각을 익히세요. (모바일 미지원)",
    to: "/mock-exam",
  },
] as const;

const MOCK_EXAM_PATH = "/mock-exam";

export function HomeFeatureCards() {
  return (
    <div className="grid gap-4 sm:gap-5 sm:grid-cols-3">
      {FEATURES.map(({ title, description, to }) => (
        <Link
          key={to}
          to={to}
          className={`group relative flex flex-col rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${to === MOCK_EXAM_PATH ? "hidden sm:flex" : ""}`}
        >
          <h3 className="text-lg font-semibold text-card-foreground mb-2 transition-colors group-hover:text-primary">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            {description}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
            이동하기
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  );
}
