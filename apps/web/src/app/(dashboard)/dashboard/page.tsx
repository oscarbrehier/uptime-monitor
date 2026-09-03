import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IncidentHistory } from "@/components/dashboard/incident-history";
import { MetricsBar } from "@/components/dashboard/metrics-bar";
import { PingsTable } from "@/components/dashboard/pings-table";
import { StatusDot } from "@/components/dashboard/status-badge";
import { UptimeTimeline } from "@/components/dashboard/uptime-timeline";
import type { Monitor, MonitorStatus } from "@/lib/mock-data";
import {
  generatePingLogs,
  generateUptimeTimeline,
  incidents,
  metricsSummary,
  monitors,
} from "@/lib/mock-data";

export const metadata = { title: "Overview" };

function worstStatus(statuses: MonitorStatus[]): MonitorStatus {
  if (statuses.includes("incident")) return "incident";
  if (statuses.includes("degraded")) return "degraded";
  if (statuses.every((s) => s === "paused")) return "paused";
  return "operational";
}

function regionHealthBreakdown(list: Monitor[]) {
  const byRegion = new Map<string, Monitor[]>();
  for (const monitor of list) {
    byRegion.set(monitor.region, [...(byRegion.get(monitor.region) ?? []), monitor]);
  }
  return [...byRegion.entries()]
    .map(([region, regionMonitors]) => ({
      region,
      status: worstStatus(regionMonitors.map((m) => m.status)),
      avgUptime: regionMonitors.reduce((sum, m) => sum + m.uptime24h, 0) / regionMonitors.length,
      avgLatencyMs: Math.round(
        regionMonitors.reduce((sum, m) => sum + m.avgLatencyMs, 0) / regionMonitors.length,
      ),
    }))
    .sort((a, b) => a.region.localeCompare(b.region));
}

export default function DashboardOverviewPage() {
  const timeline = generateUptimeTimeline(90);
  const allPings = monitors
    .flatMap((m) => generatePingLogs(m.id, 12))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const recentIncidents = [...incidents]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 4);
  const regionHealth = regionHealthBreakdown(monitors);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Everything you monitor, at a glance.
        </p>
      </div>

      <MetricsBar metrics={metricsSummary} />

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <Card className="h-fit lg:col-span-2">
          <CardHeader>
            <CardTitle>Global uptime</CardTitle>
            <CardDescription>90-day availability across every active monitor</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <UptimeTimeline days={timeline} />

            <div className="border-t border-border pt-4">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Region health
              </p>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {regionHealth.map((r) => (
                  <div
                    key={r.region}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <StatusDot status={r.status} />
                      <span className="font-mono text-xs uppercase text-foreground">
                        {r.region}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                      <span>{r.avgUptime.toFixed(2)}%</span>
                      <span>{r.avgLatencyMs}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Incident stream</CardTitle>
            <CardDescription>Latest across your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <IncidentHistory incidents={recentIncidents} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent pings</CardTitle>
          <CardDescription>Latest checks across your workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <PingsTable pings={allPings} />
        </CardContent>
      </Card>
    </div>
  );
}
