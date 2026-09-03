import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-secondary/20 px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7c5cff_0%,#38bdf8_100%)] shadow-[0_8px_24px_-8px_rgba(124,92,255,0.55)]">
        <Icon className="size-6 text-white" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
