import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, Pencil, Timer } from "lucide-react";

import { IncidentHistory } from "@/components/dashboard/incident-history";
import { LatencyChart } from "@/components/dashboard/latency-chart";
import { MonitorFormDialog } from "@/components/dashboard/monitor-form-dialog";
import { PingLogFeed } from "@/components/dashboard/ping-log-feed";
import { RunCheckButton } from "@/components/dashboard/run-check-button";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  generatePingLogs,
  getIncidentsForMonitor,
  getMonitor,
  monitors,
} from "@/lib/mock-data";

export function generateStaticParams() {
  return monitors.map((m) => ({ id: m.id }));
}

export async function generateMetadata(props: PageProps<"/monitors/[id]">) {
  const { id } = await props.params;
  const monitor = getMonitor(id);
  return { title: monitor ? monitor.name : "Monitor" };
}

export default async function MonitorDetailPage(props: PageProps<"/monitors/[id]">) {
  const { id } = await props.params;
  const monitor = getMonitor(id);
  if (!monitor) notFound();

  const pings = generatePingLogs(monitor.id, 30);
  const monitorIncidents = getIncidentsForMonitor(monitor.id);

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
            <h1 className="text-xl font-semibold tracking-tight">{monitor.name}</h1>
            <StatusBadge status={monitor.status} pulse />
          </div>
          <p className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
            <Globe className="size-3.5" />
            {monitor.method} {monitor.url}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Timer className="size-3.5" />
            Checked every {monitor.checkInterval}s from {monitor.region} · timeout{" "}
            {monitor.timeoutMs}ms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RunCheckButton />
          <MonitorFormDialog
            monitor={monitor}
            trigger={
              <Button variant="outline" size="sm">
                <Pencil className="size-3.5" />
                Edit
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Uptime 24h", value: `${monitor.uptime24h}%` },
          { label: "Uptime 30d", value: `${monitor.uptime30d}%` },
          { label: "Avg latency", value: `${monitor.avgLatencyMs}ms` },
          { label: "P95 latency", value: `${monitor.p95LatencyMs}ms` },
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-lg font-semibold">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-5">
          <LatencyChart monitorId={monitor.id} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ping log</CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <PingLogFeed pings={pings} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incident history</CardTitle>
          </CardHeader>
          <CardContent>
            <IncidentHistory incidents={monitorIncidents} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
