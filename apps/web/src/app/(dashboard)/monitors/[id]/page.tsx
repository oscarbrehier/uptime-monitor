import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, Timer } from "lucide-react";

import { LatencyChart } from "@/components/dashboard/latency-chart";
import { PingLogFeed } from "@/components/dashboard/ping-log-feed";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { UptimeTimeline } from "@/components/dashboard/uptime-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMonitors } from "@/lib/actions/monitors";
import { getLatestPings } from "@/lib/actions/pings";
import { buildMonitorStats, monitorName } from "@/lib/monitorUtils";

export async function generateMetadata(props: PageProps<"/monitors/[id]">) {
  const { id } = await props.params;
  const monitorsResult = await getMonitors();
  const monitor = monitorsResult.success ? monitorsResult.data.find((m) => m.id === id) : undefined;
  return { title: monitor ? monitorName(monitor.url) : "Monitor" };
}

export default async function MonitorDetailPage(props: PageProps<"/monitors/[id]">) {
  const { id } = await props.params;
  const monitorsResult = await getMonitors();
  const monitor = monitorsResult.success ? monitorsResult.data.find((m) => m.id === id) : undefined;
  if (!monitor) notFound();

  const pingsResult = await getLatestPings(monitor.id);
  const { pings, uptimePercentage } = pingsResult.success
    ? pingsResult.data
    : { pings: [], uptimePercentage: 0 };
  const stats = buildMonitorStats(monitor, pings, uptimePercentage);
  const recentPings = [...pings].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/monitors"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to monitors
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight">{monitorName(monitor.url)}</h1>
            <StatusBadge status={stats.status} pulse />
          </div>
          <p className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
            <Globe className="size-3.5" />
            {monitor.url}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Timer className="size-3.5" />
            Checked every {monitor.interval_seconds}s
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Uptime 24h", value: `${stats.uptime24h}%` },
          { label: "Avg latency", value: `${stats.avgLatencyMs}ms` },
          { label: "Checks (24h)", value: `${stats.pingCount}` },
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-1 font-mono text-2xl font-black tracking-tight">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-5">
          <LatencyChart pings={pings} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ping log</CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <PingLogFeed pings={recentPings} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>24h check history</CardTitle>
          </CardHeader>
          <CardContent>
            <UptimeTimeline pings={pings} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
