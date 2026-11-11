import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CalloutVariant = "info" | "warning" | "success";

const VARIANT_CLASS: Record<CalloutVariant, string> = {
  info: "border-primary/25 bg-primary/5 text-foreground",
  warning: "border-amber-500/30 bg-amber-500/10 text-foreground",
  success: "border-emerald-500/30 bg-emerald-500/10 text-foreground",
};

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Callout({
  variant = "info",
  title,
  children,
  className,
}: CalloutProps) {
  return (
    <div
      className={cn(
        "my-4 rounded-xl border px-3.5 py-3 text-sm leading-relaxed sm:px-4",
        VARIANT_CLASS[variant],
        className,
      )}
    >
      {title && <p className="mb-1.5 font-semibold text-foreground">{title}</p>}
      <div className="space-y-1.5 text-foreground/85">{children}</div>
    </div>
  );
}
