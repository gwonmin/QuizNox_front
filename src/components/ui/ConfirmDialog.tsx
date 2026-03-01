import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      confirmRef.current?.focus();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    },
    [onCancel],
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) onCancel();
    },
    [onCancel],
  );

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-[min(360px,calc(100vw-2rem))] rounded-xl border border-border bg-background p-0 shadow-lg backdrop:bg-black/40 backdrop:backdrop-blur-sm"
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
    >
      <div className="px-5 pt-5 pb-4">
        {title && (
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
        )}
        <p
          className={cn(
            "text-sm leading-relaxed text-muted-foreground",
            title && "mt-1.5",
          )}
        >
          {description}
        </p>
      </div>
      <div className="flex justify-end gap-2 border-t border-border/60 px-5 py-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-input px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
        >
          {cancelLabel}
        </button>
        <button
          ref={confirmRef}
          type="button"
          onClick={onConfirm}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium text-white",
            variant === "danger"
              ? "bg-destructive hover:bg-destructive/90"
              : "bg-primary hover:bg-primary/90",
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
