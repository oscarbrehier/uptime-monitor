import { Activity, CheckCircle2, Clock, XCircle } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { pingStatus, type Ping } from "@/lib/monitorUtils";
import { cn } from "@/lib/utils";

const ICON = {
  success: CheckCircle2,
  error: XCircle,
  timeout: Clock,
} as const;

const ICON_COLOR = {
  success: "text-status-operational",
  error: "text-status-incident",
  timeout: "text-status-degraded",
} as const;

export function PingLogFeed({ pings }: { pings: Ping[] }) {
  if (pings.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No checks yet"
        description="Pulse will start logging checks once this monitor runs."
      />
    );
  }

  return (
    <div className="flex flex-col">
      {pings.map((ping) => {
        const status = pingStatus(ping.status_code);
        const Icon = ICON[status];
        return (
          <div
            key={ping.id}
            className="flex items-center gap-3 border-b border-border py-2.5 last:border-0"
          >
            <Icon className={cn("size-4 shrink-0", ICON_COLOR[status])} />
            <span className="w-20 shrink-0 font-mono text-xs">
              {status === "timeout" ? "Timeout" : ping.status_code}
            </span>
            <span
              className={cn(
                "w-16 shrink-0 font-mono text-xs",
                ping.latency_ms > 800 && "text-status-degraded",
              )}
            >
              {ping.latency_ms}ms
            </span>
            <span className="ml-auto shrink-0 text-xs text-muted-foreground">
              {new Date(ping.created_at).toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
