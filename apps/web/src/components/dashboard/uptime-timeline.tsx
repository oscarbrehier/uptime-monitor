"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { UptimeDay } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const BAR_COLOR: Record<UptimeDay["status"], string> = {
  operational: "bg-status-operational",
  degraded: "bg-status-degraded",
  incident: "bg-status-incident",
  paused: "bg-status-paused",
};

export function UptimeTimeline({ days }: { days: UptimeDay[] }) {
  const avg =
    days.reduce((sum, d) => sum + d.uptimePercent, 0) / (days.length || 1);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{days.length} days ago</span>
        <span className="font-medium text-foreground">{avg.toFixed(2)}% average uptime</span>
        <span>Today</span>
      </div>
      <div className="flex h-8 w-full gap-[2px]">
        {days.map((day) => (
          <Tooltip key={day.date}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "h-full flex-1 rounded-[2px] transition-transform hover:scale-y-110",
                  BAR_COLOR[day.status],
                )}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{day.date}</p>
              <p className="text-muted-foreground">{day.uptimePercent}% uptime</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
