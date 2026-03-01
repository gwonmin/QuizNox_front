import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import type { Review } from "../../types/api";
import { formatReviewDate } from "./reviewUtils";

const AUTO_SCROLL_SPEED = 0.5;
const PAUSE_AFTER_INTERACTION_MS = 3000;

export type AutoScrollReviewsProps = {
  list: Review[];
  currentUserId: string | null;
  editingReviewId: string | null;
  editingContent: string;
  onEditingContentChange: (v: string) => void;
  onEdit: (r: Review) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onDelete: (r: Review) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  updateError: boolean;
  deleteError: boolean;
};

function displayName(r: Review): string {
  if (r.username) return r.username;
  return r.user_id.length > 8
    ? r.user_id.slice(0, 8) + "…"
    : r.user_id;
}

function ReviewCard({
  review,
  isMine,
  isEditing,
  editingContent,
  onEditingContentChange,
  onEdit,
  onEditSave,
  onEditCancel,
  onDelete,
  isUpdating,
  isDeleting,
  updateError,
  deleteError,
}: {
  review: Review;
  isMine: boolean;
  isEditing: boolean;
  editingContent: string;
  onEditingContentChange: (v: string) => void;
  onEdit: (r: Review) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onDelete: (r: Review) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  updateError: boolean;
  deleteError: boolean;
}) {
  return (
    <div
      className={`border-b border-border/40 px-3 py-2 last:border-b-0 ${isMine ? "bg-primary/5" : ""}`}
    >
      {isEditing ? (
        <div className="space-y-1.5">
          <textarea
            value={editingContent}
            onChange={(e) => onEditingContentChange(e.target.value)}
            rows={2}
            maxLength={500}
            className="w-full rounded border border-input bg-background px-2 py-1.5 text-sm"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] tabular-nums text-muted-foreground">
              {editingContent.length}/500
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={onEditSave}
                disabled={isUpdating || !editingContent.trim()}
                className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isUpdating ? "저장 중..." : "저장"}
              </button>
              <button
                type="button"
                onClick={onEditCancel}
                disabled={isUpdating}
                className="rounded border border-input px-2 py-1 text-xs hover:bg-muted"
              >
                취소
              </button>
            </div>
          </div>
          {updateError && (
            <p className="text-xs text-red-600 dark:text-destructive">
              수정에 실패했습니다.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-foreground">
              {displayName(review)}
            </span>
            {isMine && (
              <span className="rounded bg-primary/15 px-1 py-px text-[10px] font-medium text-primary">
                나
              </span>
            )}
            <span className="text-[11px] text-muted-foreground">
              · {formatReviewDate(review.created_at)}
            </span>
          </div>
          <p className="mt-0.5 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {review.content}
          </p>
          {isMine && (
            <div className="mt-0.5 flex gap-1.5">
              <button
                type="button"
                onClick={() => onEdit(review)}
                className="text-[11px] text-muted-foreground hover:text-foreground"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => onDelete(review)}
                disabled={isDeleting}
                className="text-[11px] text-muted-foreground hover:text-destructive disabled:opacity-50"
              >
                삭제
              </button>
            </div>
          )}
          {deleteError && isMine && (
            <p className="mt-0.5 text-xs text-red-600 dark:text-destructive">
              삭제에 실패했습니다.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export function AutoScrollReviews({
  list,
  currentUserId,
  editingReviewId,
  editingContent,
  onEditingContentChange,
  onEdit,
  onEditSave,
  onEditCancel,
  onDelete,
  isUpdating,
  isDeleting,
  updateError,
  deleteError,
}: AutoScrollReviewsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const firstBlockRef = useRef<HTMLDivElement>(null);
  const scrollOffsetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const pausedUntilRef = useRef(0);
  const isEditingAny = editingReviewId !== null;

  const { myReviews, otherReviews } = useMemo(() => {
    const mine: Review[] = [];
    const others: Review[] = [];
    const sortByDate = (a: Review, b: Review) =>
      b.created_at.localeCompare(a.created_at);
    for (const r of list) {
      if (currentUserId && r.user_id === currentUserId) mine.push(r);
      else others.push(r);
    }
    return {
      myReviews: mine.sort(sortByDate),
      otherReviews: others.sort(sortByDate),
    };
  }, [list, currentUserId]);

  const [needsClone, setNeedsClone] = useState(false);

  useEffect(() => {
    const el = scrollContainerRef.current;
    const block = firstBlockRef.current;
    if (!el || !block) {
      setNeedsClone(false);
      return;
    }
    const check = () => setNeedsClone(block.offsetHeight > el.clientHeight);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    observer.observe(block);
    return () => observer.disconnect();
  }, [otherReviews]);

  const pauseAutoScroll = useCallback(() => {
    pausedUntilRef.current = performance.now() + PAUSE_AFTER_INTERACTION_MS;
  }, []);

  const [userScrolling, setUserScrolling] = useState(false);

  useEffect(() => {
    const el = scrollContainerRef.current;
    const block = firstBlockRef.current;
    if (!el || !block || otherReviews.length === 0) return;

    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      if (!isEditingAny && now > pausedUntilRef.current) {
        const blockH = block.offsetHeight;

        if (needsClone && blockH > 0) {
          scrollOffsetRef.current += AUTO_SCROLL_SPEED * (dt / 16);
          if (scrollOffsetRef.current >= blockH) {
            scrollOffsetRef.current -= blockH;
          }
          el.scrollTop = scrollOffsetRef.current;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [otherReviews.length, isEditingAny, needsClone]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.stopPropagation();
      pauseAutoScroll();
      setUserScrolling(true);
    },
    [pauseAutoScroll],
  );

  const handleTouchStart = useCallback(() => {
    pauseAutoScroll();
    setUserScrolling(true);
  }, [pauseAutoScroll]);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    const block = firstBlockRef.current;
    if (!el || !block) return;

    if (needsClone) {
      const blockH = block.offsetHeight;
      if (blockH > 0 && el.scrollTop >= blockH) {
        el.scrollTop -= blockH;
      }
    }
    scrollOffsetRef.current = el.scrollTop;
  }, [needsClone]);

  useEffect(() => {
    if (!userScrolling) return;
    const timer = setTimeout(
      () => setUserScrolling(false),
      PAUSE_AFTER_INTERACTION_MS,
    );
    return () => clearTimeout(timer);
  }, [userScrolling]);

  const cardProps = {
    editingContent,
    onEditingContentChange,
    onEdit,
    onEditSave,
    onEditCancel,
    onDelete,
    isUpdating,
    isDeleting,
    updateError,
    deleteError,
  };

  return (
    <div className="flex h-full flex-col">
      {myReviews.length > 0 && (
        <div className="shrink-0 overflow-y-auto border-b border-border/60 bg-primary/[0.03]" style={{ maxHeight: "40%" }}>
          {myReviews.map((r) => (
            <ReviewCard
              key={r.review_id}
              review={r}
              isMine
              isEditing={editingReviewId === r.review_id}
              {...cardProps}
            />
          ))}
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="min-h-0 flex-1 overflow-y-auto scrollbar-none"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onScroll={handleScroll}
      >
        <div ref={firstBlockRef}>
          {otherReviews.map((r) => (
            <ReviewCard
              key={r.review_id}
              review={r}
              isMine={false}
              isEditing={false}
              {...cardProps}
            />
          ))}
        </div>
        {needsClone && (
          <div aria-hidden="true">
            {otherReviews.map((r) => (
              <ReviewCard
                key={`clone-${r.review_id}`}
                review={r}
                isMine={false}
                isEditing={false}
                {...cardProps}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
