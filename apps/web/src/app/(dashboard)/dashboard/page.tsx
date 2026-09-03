import Link from "next/link";
import { ArrowUpRight, Radar } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { MetricsBar } from "@/components/dashboard/metrics-bar";
import { PingsTable } from "@/components/dashboard/pings-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { buildMetricsSummary, getMonitorsWithPings, monitorName } from "@/lib/monitorUtils";

export const metadata = { title: "Overview" };

const STATUS_RANK = { incident: 0, degraded: 1, operational: 2, paused: 3 } as const;

export default async function DashboardOverviewPage() {
  const { monitors, pingsByMonitor } = await getMonitorsWithPings();
  const metrics = buildMetricsSummary(monitors);

  const allPings = Object.values(pingsByMonitor)
    .flat()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 20);
  const monitorNames = Object.fromEntries(monitors.map((m) => [m.id, monitorName(m.url)]));

  const sortedMonitors = [...monitors].sort(
    (a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status],
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Everything you monitor, at a glance.
        </p>
      </div>

      <MetricsBar metrics={metrics} />

      <Card>
        <CardHeader>
          <CardTitle>Monitor status</CardTitle>
          <CardDescription>24-hour uptime across your workspace</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedMonitors.length === 0 ? (
            <EmptyState
              icon={Radar}
              title="No monitors yet"
              description="Add your first endpoint from the Monitors page to start tracking uptime."
            />
          ) : (
            <div className="flex flex-col">
              {sortedMonitors.map((monitor) => (
                <Link
                  key={monitor.id}
                  href={`/monitors/${monitor.id}`}
                  className="group flex items-center gap-3 border-b border-border py-2.5 last:border-0"
                >
                  <StatusBadge status={monitor.status} pulse />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {monitorName(monitor.url)}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {monitor.uptime24h}%
                  </span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {monitor.avgLatencyMs}ms
                  </span>
                  <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent pings</CardTitle>
          <CardDescription>Latest checks across your workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <PingsTable pings={allPings} monitorNames={monitorNames} />
        </CardContent>
      </Card>
    </div>
  );
}
