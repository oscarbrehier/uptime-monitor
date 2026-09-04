import { buildMetricsSummary, getMonitorsWithPings, MetricsSummary, monitorName, MonitorWithStats } from "@/lib/monitorUtils";

export const STATUS_RANK = { incident: 0, degraded: 1, operational: 2, paused: 3 } as const;

export type OverviewData = {
	monitors: MonitorWithStats[];
	metrics: MetricsSummary;
	allPings: { created_at: string; id: number; latency_ms: number; monitor_id: string; status_code: number }[];
	monitorNames: Record<string, string>;
};

export async function getOverview(): Promise<OverviewData> {

	const { monitors, pingsByMonitor } = await getMonitorsWithPings();
	const metrics = buildMetricsSummary(monitors);
	const allPings = Object.values(pingsByMonitor)
		.flat()
		.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
		.slice(0, 20);
	const monitorNames = Object.fromEntries(monitors.map((m) => [m.id, monitorName(m.url)]));
	const sortedMonitors = [...monitors].sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status]);

	return { 
		monitors: sortedMonitors, 
		metrics, 
		allPings, 
		monitorNames 
	};

};