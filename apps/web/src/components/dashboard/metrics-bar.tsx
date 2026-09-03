import { Activity, Gauge, Layers, TriangleAlert } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { MetricsSummary } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function MetricsBar({ metrics }: { metrics: MetricsSummary }) {
  const items = [
    {
      label: "System health",
      value: `${metrics.overallHealthPercent}%`,
      icon: Activity,
      accent: "text-status-operational",
      glow: "from-emerald-500/15",
    },
    {
      label: "Active monitors",
      value: `${metrics.activeMonitors}/${metrics.totalMonitors}`,
      icon: Layers,
      accent: "text-primary",
      glow: "from-violet-500/15",
    },
    {
      label: "24h avg latency",
      value: `${metrics.avgLatency24hMs}ms`,
      icon: Gauge,
      accent: "text-sky-400",
      glow: "from-sky-500/15",
    },
    {
      label: "Open incidents",
      value: metrics.openIncidents,
      icon: TriangleAlert,
      accent: metrics.openIncidents > 0 ? "text-status-incident" : "text-status-operational",
      glow: metrics.openIncidents > 0 ? "from-rose-500/15" : "from-emerald-500/15",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="relative overflow-hidden p-5">
          <div
            className={cn(
              "pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br to-transparent blur-2xl",
              item.glow,
            )}
          />
          <div className="relative flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
            <item.icon className={cn("size-4", item.accent)} />
          </div>
          <p className="relative mt-3 text-2xl font-semibold tracking-tight">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
