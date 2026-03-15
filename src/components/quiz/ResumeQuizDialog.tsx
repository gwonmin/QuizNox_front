import { useEffect, useRef, useCallback } from "react";
import type { ProgressItem } from "../../services/api/progressApi";

interface ResumeQuizDialogProps {
  open: boolean;
  progress: ProgressItem;
  onResume: () => void;
  onDismiss: () => void;
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export function ResumeQuizDialog({
  open,
  progress,
  onResume,
  onDismiss,
}: ResumeQuizDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const resumeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      resumeRef.current?.focus();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onDismiss();
      }
    },
    [onDismiss],
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) onDismiss();
    },
    [onDismiss],
  );

  if (!open) return null;

  const topicLabel = progress.topic_name || progress.topic_id;
  const relativeTime = formatRelativeTime(progress.updated_at);

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-[min(400px,calc(100vw-2rem))] rounded-2xl border border-border bg-background p-0 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
    >
      <div className="px-6 pt-5 pb-5">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            이전에 풀던 문제가 있습니다
          </h3>
          <button
            type="button"
            onClick={onDismiss}
            className="-mr-1 -mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground transition-colors hover:bg-muted"
            aria-label="닫기"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-4 rounded-lg bg-muted/60 px-4 py-3">
          <p className="text-sm font-medium text-foreground">{topicLabel}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-2xl font-bold tabular-nums text-primary">
              #{progress.question_number}
            </span>
            <span className="text-xs text-muted-foreground">
              번 문제까지 풀이 완료
            </span>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">{relativeTime}</p>
        </div>
      </div>

      <div className="border-t border-border/60 px-6 py-4">
        <button
          ref={resumeRef}
          type="button"
          onClick={onResume}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
        >
          이어서 풀기
        </button>
      </div>
    </dialog>
  );
}
