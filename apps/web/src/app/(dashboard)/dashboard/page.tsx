import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MetricsBar } from "@/components/dashboard/metrics-bar";
import { PingsTable } from "@/components/dashboard/pings-table";
import { UptimeTimeline } from "@/components/dashboard/uptime-timeline";
import {
  generatePingLogs,
  generateUptimeTimeline,
  metricsSummary,
  monitors,
} from "@/lib/mock-data";

export const metadata = { title: "Overview" };

export default function DashboardOverviewPage() {
  const timeline = generateUptimeTimeline(90);
  const allPings = monitors
    .flatMap((m) => generatePingLogs(m.id, 12))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Everything you monitor, at a glance.
        </p>
      </div>

      <MetricsBar metrics={metricsSummary} />

      <Card>
        <CardHeader>
          <CardTitle>Global uptime</CardTitle>
          <CardDescription>90-day availability across every active monitor</CardDescription>
        </CardHeader>
        <CardContent>
          <UptimeTimeline days={timeline} />
        </CardContent>
      </Card>

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
