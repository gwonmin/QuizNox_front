import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CalloutVariant = "info" | "warning" | "success";

const VARIANT_CLASS: Record<CalloutVariant, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
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
        "my-3 rounded-lg border px-3 py-2 text-sm",
        VARIANT_CLASS[variant],
        className
      )}
    >
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

