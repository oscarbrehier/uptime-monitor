"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { pingStatus, type Ping, type PingStatus } from "@/lib/monitorUtils";
import { cn } from "@/lib/utils";

const BAR_COLOR: Record<PingStatus, string> = {
  success: "bg-status-operational",
  error: "bg-status-incident",
  timeout: "bg-status-degraded",
};

export function UptimeTimeline({ pings }: { pings: Ping[] }) {
  const upCount = pings.filter((p) => pingStatus(p.status_code) === "success").length;
  const uptimePercent = pings.length ? (upCount / pings.length) * 100 : 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>24h ago</span>
        <span className="font-medium text-foreground">{uptimePercent.toFixed(2)}% uptime</span>
        <span>Now</span>
      </div>
      <div className="flex h-8 w-full gap-[2px]">
        {pings.length === 0 ? (
          <div className="h-full w-full rounded-[2px] bg-secondary/40" />
        ) : (
          pings.map((ping) => {
            const status = pingStatus(ping.status_code);
            return (
              <Tooltip key={ping.id}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "h-full flex-1 rounded-[2px] transition-transform hover:scale-y-110",
                      BAR_COLOR[status],
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{new Date(ping.created_at).toLocaleString()}</p>
                  <p className="text-muted-foreground">
                    {status === "timeout" ? "Timeout" : `${ping.status_code} · ${ping.latency_ms}ms`}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })
        )}
      </div>
    </div>
  );
}
