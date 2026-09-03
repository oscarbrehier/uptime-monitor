import { Activity, Gauge, Layers, TriangleAlert } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { MetricsSummary } from "@/lib/monitorUtils";
import { cn } from "@/lib/utils";

export function MetricsBar({ metrics }: { metrics: MetricsSummary }) {
  const items = [
    {
      label: "System health",
      value: `${metrics.overallHealthPercent}%`,
      icon: Activity,
      accent: "text-emerald-glow",
    },
    {
      label: "Active monitors",
      value: `${metrics.activeMonitors}/${metrics.totalMonitors}`,
      icon: Layers,
      accent: "text-violet-accent",
    },
    {
      label: "24h avg latency",
      value: `${metrics.avgLatency24hMs}ms`,
      icon: Gauge,
      accent: "text-violet-accent",
    },
    {
      label: "Monitors down",
      value: metrics.monitorsDown,
      icon: TriangleAlert,
      accent: metrics.monitorsDown > 0 ? "text-rose-glow" : "text-emerald-glow",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {item.label}
            </p>
            <item.icon className={cn("size-4", item.accent)} />
          </div>
          <p className="mt-3 font-mono text-4xl font-black tracking-tight">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
