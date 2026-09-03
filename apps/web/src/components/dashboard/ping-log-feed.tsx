import { CheckCircle2, Clock, XCircle } from "lucide-react";

import type { PingLog } from "@/lib/mock-data";
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

export function PingLogFeed({ pings }: { pings: PingLog[] }) {
  return (
    <div className="flex flex-col">
      {pings.map((ping) => {
        const Icon = ICON[ping.status];
        return (
          <div
            key={ping.id}
            className="flex items-center gap-3 border-b border-border py-2.5 last:border-0"
          >
            <Icon className={cn("size-4 shrink-0", ICON_COLOR[ping.status])} />
            <span className="w-20 shrink-0 font-mono text-xs text-muted-foreground uppercase">
              {ping.region}
            </span>
            <span className="w-24 shrink-0 font-mono text-xs">
              {ping.status === "timeout" ? "Timeout" : ping.statusCode}
            </span>
            <span
              className={cn(
                "w-16 shrink-0 font-mono text-xs",
                ping.latencyMs > 800 && "text-status-degraded",
              )}
            >
              {ping.latencyMs}ms
            </span>
            <span className="ml-auto shrink-0 text-xs text-muted-foreground">
              {new Date(ping.timestamp).toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
