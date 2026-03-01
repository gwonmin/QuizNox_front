import { HomeFeatureCards } from "./HomeFeatureCards";
import ReviewsSection from "../../components/reviews/ReviewsSection";

export function HomeContent() {
  return (
    <article className="space-y-8 sm:space-y-10">
      <section id="features" className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          주요 기능
        </h2>
        <HomeFeatureCards />
      </section>

      <ReviewsSection />

      <p className="text-xs text-muted-foreground pt-3 border-t border-border/60">
        본 서비스의 모든 콘텐츠(핸드북, 기출문제, 모의고사 등)는 저작권법에 의해 보호되는
        지식재산권입니다. 무단 복제·배포·상업적 이용을 금지합니다.
      </p>
    </article>
  );
}
