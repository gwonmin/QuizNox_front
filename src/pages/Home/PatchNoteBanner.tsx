import { useState } from "react";
import { LATEST_PATCH_NOTE, PATCH_NOTES } from "@/constants/patchNotes";

const DISMISSED_KEY = "patchnote-dismissed";
const VISIBLE_HISTORY = 3;

function readDismissed(): string | null {
  try {
    return localStorage.getItem(DISMISSED_KEY);
  } catch {
    return null;
  }
}

function formatDate(date: string): string {
  const [, month, day] = date.split("-");
  return `${Number(month)}.${Number(day)}`;
}

export function PatchNoteBanner() {
  const [dismissed, setDismissed] = useState(
    () => readDismissed() === LATEST_PATCH_NOTE?.date
  );
  const [expanded, setExpanded] = useState(false);

  if (!LATEST_PATCH_NOTE || dismissed) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, LATEST_PATCH_NOTE.date);
    } catch {
      // 저장 실패 시 이번 세션에서만 닫힌다
    }
    setDismissed(true);
  };

  return (
    <section
      aria-label="업데이트 소식"
      className="rounded-lg border border-blue-200 bg-blue-50 text-blue-900 text-sm"
    >
      <div className="flex items-start gap-2 px-3 py-2">
        <span className="shrink-0 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          New
        </span>
        <p className="min-w-0 flex-1 leading-snug">
          <span className="text-blue-700/70 tabular-nums mr-1.5">
            {formatDate(LATEST_PATCH_NOTE.date)}
          </span>
          {LATEST_PATCH_NOTE.title}
        </p>
        <div className="flex shrink-0 items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="rounded px-1.5 py-0.5 text-blue-700 hover:bg-blue-100"
          >
            {expanded ? "접기" : "자세히"}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="업데이트 소식 닫기"
            className="rounded px-1.5 py-0.5 text-blue-700 hover:bg-blue-100"
          >
            닫기
          </button>
        </div>
      </div>

      {expanded && (
        <ol className="space-y-2 border-t border-blue-200/70 px-3 py-2.5 text-xs">
          {PATCH_NOTES.slice(0, VISIBLE_HISTORY).map((note) => (
            <li key={note.date} className="flex gap-2">
              <span className="shrink-0 tabular-nums text-blue-700/70">
                {formatDate(note.date)}
              </span>
              <div className="min-w-0 space-y-0.5">
                <p className="font-medium">{note.title}</p>
                {note.items?.map((item) => (
                  <p key={item} className="text-blue-900/80">
                    · {item}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
