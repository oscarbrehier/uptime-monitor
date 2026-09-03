import { Badge } from "@/components/ui/badge";
import type { MonitorStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  MonitorStatus,
  { label: string; variant: "operational" | "degraded" | "incident" | "paused" }
> = {
  operational: { label: "Operational", variant: "operational" },
  degraded: { label: "Degraded", variant: "degraded" },
  incident: { label: "Incident", variant: "incident" },
  paused: { label: "Paused", variant: "paused" },
};

export function StatusBadge({
  status,
  className,
  pulse = false,
}: {
  status: MonitorStatus;
  className?: string;
  pulse?: boolean;
}) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant={config.variant} className={cn(className)}>
      <span className="relative flex size-1.5">
        {pulse && status !== "paused" && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75 animate-[pulse-ring_2s_cubic-bezier(0.4,0,0.6,1)_infinite]",
              status === "operational" && "bg-status-operational",
              status === "degraded" && "bg-status-degraded",
              status === "incident" && "bg-status-incident",
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex size-1.5 rounded-full",
            status === "operational" && "bg-status-operational",
            status === "degraded" && "bg-status-degraded",
            status === "incident" && "bg-status-incident",
            status === "paused" && "bg-status-paused",
          )}
        />
      </span>
      {config.label}
    </Badge>
  );
}

export function StatusDot({ status }: { status: MonitorStatus }) {
  return (
    <span
      className={cn(
        "inline-block size-2 rounded-full",
        status === "operational" && "bg-status-operational",
        status === "degraded" && "bg-status-degraded",
        status === "incident" && "bg-status-incident",
        status === "paused" && "bg-status-paused",
      )}
    />
  );
}
