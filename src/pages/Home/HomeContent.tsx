import { HomeFeatureCards } from "./HomeFeatureCards";

export function HomeContent() {
  return (
    <article className="space-y-14 sm:space-y-16">
      {/* Primary: 기능 카드 */}
      <section id="features" className="space-y-5">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          주요 기능
        </h2>
        <HomeFeatureCards />
      </section>

      {/* Secondary: 이용 순서 */}
      <section
        id="quick-start"
        className="rounded-2xl border border-border/60 bg-muted/30 px-5 py-6 sm:px-6 sm:py-7"
      >
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3">
          이용 안내
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground font-medium">핸드북</strong>으로 개념을 정리한 뒤,{" "}
          <strong className="text-foreground font-medium">기출문제</strong>로 연습하고,{" "}
          <strong className="text-foreground font-medium">모의고사</strong>로 실전 감각을 익히면
          좋습니다.
        </p>
        <p className="mt-2 text-xs text-muted-foreground sm:hidden">
          모의고사는 PC 등 모바일 외 환경에서 이용할 수 있습니다.
        </p>
      </section>

      {/* 저작권 안내 */}
      <p className="text-xs text-muted-foreground pt-4 border-t border-border/60">
        본 서비스의 모든 콘텐츠(핸드북, 기출문제, 모의고사 등)는 저작권법에 의해 보호되는
        지식재산권입니다. 무단 복제·배포·상업적 이용을 금지합니다.
      </p>
    </article>
  );
}
