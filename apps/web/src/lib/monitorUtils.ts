import { getMonitors } from "@/lib/actions/monitors";
import { getLatestPings } from "@/lib/actions/pings";
import type { Database } from "@/types/database.types";

export type Monitor = Database["public"]["Tables"]["monitors"]["Row"];
export type Ping = Database["public"]["Tables"]["ping_logs"]["Row"];

export type MonitorStatus = "operational" | "degraded" | "incident" | "paused";
export type PingStatus = "success" | "error" | "timeout";

export interface MonitorStats {
	status: MonitorStatus;
	uptime24h: number;
	avgLatencyMs: number;
	sparkline: number[];
	pingCount: number;
};

export type MonitorWithStats = Monitor & MonitorStats;

export function monitorName(url: string): string {

	try {
		return new URL(url).hostname;
	} catch {
		return url;
	};

};

export function pingStatus(statusCode: number): PingStatus {

	if (statusCode === 0) return "timeout";
	if (statusCode >= 200 && statusCode < 300) return "success";

	return "error";

};

export function deriveStatus(isActive: boolean, uptime24h: number, pingCount: number): MonitorStatus {

	if (!isActive) return "paused";
	if (pingCount === 0) return "operational";
	if (uptime24h >= 99) return "operational";
	if (uptime24h >= 90) return "degraded";

	return "incident";

};

export interface MetricsSummary {
	overallHealthPercent: number;
	activeMonitors: number;
	totalMonitors: number;
	avgLatency24hMs: number;
	monitorsDown: number;
};

export function buildMetricsSummary(monitors: MonitorWithStats[]): MetricsSummary {

	const withPings = monitors.filter((m) => m.pingCount > 0);
	const overallHealthPercent = withPings.length
		? Math.round(
				(withPings.reduce((sum, m) => sum + m.uptime24h, 0) / withPings.length) * 100,
			) / 100
		: 100;

	const avgLatency24hMs = withPings.length
		? Math.round(withPings.reduce((sum, m) => sum + m.avgLatencyMs, 0) / withPings.length)
		: 0;

	return {
		overallHealthPercent,
		activeMonitors: monitors.filter((m) => m.is_active).length,
		totalMonitors: monitors.length,
		avgLatency24hMs,
		monitorsDown: monitors.filter((m) => m.status === "incident").length,
	};

};

export function buildMonitorStats(
	monitor: Monitor,
	pings: Ping[],
	uptimePercentage: number,
): MonitorStats {

	const avgLatencyMs = pings.length
		? Math.round(pings.reduce((sum, p) => sum + p.latency_ms, 0) / pings.length)
		: 0;

	return {
		status: deriveStatus(monitor.is_active, uptimePercentage, pings.length),
		uptime24h: Math.round(uptimePercentage * 100) / 100,
		avgLatencyMs,
		sparkline: pings.map((p) => p.latency_ms),
		pingCount: pings.length,
	};

};

export interface MonitorsWithPings {
	monitors: MonitorWithStats[];
	pingsByMonitor: Record<string, Ping[]>;
};

export async function getMonitorsWithPings(): Promise<MonitorsWithPings> {

	const monitorsResult = await getMonitors();
	if (!monitorsResult.success) return { monitors: [], pingsByMonitor: {} };

	const pingsByMonitor: Record<string, Ping[]> = {};

	const monitors = await Promise.all(
		monitorsResult.data.map(async (monitor) => {
			const pingsResult = await getLatestPings(monitor.id);
			const { pings, uptimePercentage } = pingsResult.success
				? pingsResult.data
				: { pings: [], uptimePercentage: 0 };
			pingsByMonitor[monitor.id] = pings;
			return { ...monitor, ...buildMonitorStats(monitor, pings, uptimePercentage) };
		}),
	);

	return { monitors, pingsByMonitor };

};

export async function getMonitorsWithStats(): Promise<MonitorWithStats[]> {

	const { monitors } = await getMonitorsWithPings();
	return monitors;

};
