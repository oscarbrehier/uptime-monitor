// Deterministic mock data for UI prototyping only. No network or database access.

export type MonitorStatus = "operational" | "degraded" | "incident" | "paused";
export type CheckInterval = 10 | 30 | 60;
export type NotificationChannel = "email" | "slack" | "webhook";
export type HttpMethod = "GET" | "POST" | "HEAD";

export interface Monitor {
	id: string;
	name: string;
	url: string;
	method: HttpMethod;
	status: MonitorStatus;
	region: string;
	checkInterval: CheckInterval;
	timeoutMs: number;
	createdAt: string;
	lastCheckedAt: string;
	uptime24h: number;
	uptime7d: number;
	uptime30d: number;
	uptime90d: number;
	avgLatencyMs: number;
	p95LatencyMs: number;
	sparkline: number[];
	notifications: NotificationChannel[];
	tags: string[];
}

export interface PingLog {
	id: string;
	monitorId: string;
	timestamp: string;
	statusCode: number;
	status: "success" | "error" | "timeout";
	latencyMs: number;
	region: string;
}

export interface Incident {
	id: string;
	monitorId: string;
	startedAt: string;
	resolvedAt: string | null;
	durationMinutes: number | null;
	cause: string;
	status: "ongoing" | "resolved";
}

export interface UptimeDay {
	date: string;
	uptimePercent: number;
	status: MonitorStatus;
}

// mulberry32 seeded PRNG so server + client renders match exactly.
function createRng(seed: number) {
	let a = seed;
	return function rng() {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const REGIONS = ["iad1", "sfo1", "fra1", "syd1", "sin1"];

function pick<T>(arr: T[], r: number) {
	return arr[Math.floor(r * arr.length)];
}

export const monitors: Monitor[] = [
	{
		id: "mon_api_gateway",
		name: "API Gateway",
		url: "https://api.pulse.dev/health",
		method: "GET",
		status: "operational",
		region: "iad1",
		checkInterval: 30,
		timeoutMs: 5000,
		createdAt: "2025-11-02T09:12:00Z",
		lastCheckedAt: "2026-09-02T14:58:12Z",
		uptime24h: 100,
		uptime7d: 99.98,
		uptime30d: 99.95,
		uptime90d: 99.91,
		avgLatencyMs: 142,
		p95LatencyMs: 268,
		sparkline: [],
		notifications: ["email", "slack"],
		tags: ["core", "production"],
	},
	{
		id: "mon_checkout",
		name: "Checkout Service",
		url: "https://checkout.pulse.dev/v2/status",
		method: "GET",
		status: "operational",
		region: "iad1",
		checkInterval: 10,
		timeoutMs: 3000,
		createdAt: "2025-10-18T16:40:00Z",
		lastCheckedAt: "2026-09-02T14:58:20Z",
		uptime24h: 100,
		uptime7d: 100,
		uptime30d: 99.99,
		uptime90d: 99.97,
		avgLatencyMs: 88,
		p95LatencyMs: 154,
		sparkline: [],
		notifications: ["email", "slack", "webhook"],
		tags: ["core", "payments"],
	},
	{
		id: "mon_auth",
		name: "Auth Service",
		url: "https://auth.pulse.dev/.well-known/health",
		method: "GET",
		status: "degraded",
		region: "fra1",
		checkInterval: 30,
		timeoutMs: 4000,
		createdAt: "2025-09-30T11:00:00Z",
		lastCheckedAt: "2026-09-02T14:57:55Z",
		uptime24h: 98.42,
		uptime7d: 99.61,
		uptime30d: 99.72,
		uptime90d: 99.8,
		avgLatencyMs: 410,
		p95LatencyMs: 940,
		sparkline: [],
		notifications: ["email"],
		tags: ["core", "identity"],
	},
	{
		id: "mon_marketing",
		name: "Marketing Site",
		url: "https://pulse.dev",
		method: "GET",
		status: "operational",
		region: "sfo1",
		checkInterval: 60,
		timeoutMs: 8000,
		createdAt: "2025-08-11T08:00:00Z",
		lastCheckedAt: "2026-09-02T14:57:40Z",
		uptime24h: 100,
		uptime7d: 100,
		uptime30d: 100,
		uptime90d: 99.99,
		avgLatencyMs: 61,
		p95LatencyMs: 98,
		sparkline: [],
		notifications: ["slack"],
		tags: ["public"],
	},
	{
		id: "mon_webhooks",
		name: "Webhooks Dispatcher",
		url: "https://hooks.pulse.dev/ping",
		method: "POST",
		status: "incident",
		region: "iad1",
		checkInterval: 10,
		timeoutMs: 2000,
		createdAt: "2026-01-05T13:20:00Z",
		lastCheckedAt: "2026-09-02T14:58:02Z",
		uptime24h: 91.2,
		uptime7d: 97.85,
		uptime30d: 99.1,
		uptime90d: 99.4,
		avgLatencyMs: 890,
		p95LatencyMs: 2400,
		sparkline: [],
		notifications: ["email", "slack", "webhook"],
		tags: ["integrations"],
	},
	{
		id: "mon_search",
		name: "Search Index",
		url: "https://search.pulse.dev/health",
		method: "GET",
		status: "operational",
		region: "sin1",
		checkInterval: 60,
		timeoutMs: 5000,
		createdAt: "2025-12-14T10:30:00Z",
		lastCheckedAt: "2026-09-02T14:56:31Z",
		uptime24h: 100,
		uptime7d: 99.95,
		uptime30d: 99.9,
		uptime90d: 99.88,
		avgLatencyMs: 204,
		p95LatencyMs: 380,
		sparkline: [],
		notifications: ["email"],
		tags: ["internal"],
	},
	{
		id: "mon_billing",
		name: "Billing Cron",
		url: "https://billing.pulse.dev/cron/heartbeat",
		method: "HEAD",
		status: "paused",
		region: "syd1",
		checkInterval: 60,
		timeoutMs: 5000,
		createdAt: "2025-07-22T07:15:00Z",
		lastCheckedAt: "2026-08-29T02:00:00Z",
		uptime24h: 100,
		uptime7d: 100,
		uptime30d: 100,
		uptime90d: 99.96,
		avgLatencyMs: 132,
		p95LatencyMs: 210,
		sparkline: [],
		notifications: [],
		tags: ["internal", "billing"],
	},
	{
		id: "mon_cdn",
		name: "Edge CDN",
		url: "https://cdn.pulse.dev/status.json",
		method: "GET",
		status: "operational",
		region: "fra1",
		checkInterval: 30,
		timeoutMs: 3000,
		createdAt: "2025-06-02T12:00:00Z",
		lastCheckedAt: "2026-09-02T14:58:05Z",
		uptime24h: 100,
		uptime7d: 100,
		uptime30d: 99.99,
		uptime90d: 99.98,
		avgLatencyMs: 34,
		p95LatencyMs: 52,
		sparkline: [],
		notifications: ["slack"],
		tags: ["core", "public"],
	},
];

// backfill sparklines deterministically per-monitor (24 points ~ hourly)
monitors.forEach((m, mi) => {
	const base = m.avgLatencyMs;
	const jitter = m.status === "incident" ? 0.9 : m.status === "degraded" ? 0.5 : 0.2;
	const r = createRng(mi * 97 + 11);
	m.sparkline = Array.from({ length: 24 }, () => {
		const spike = m.status !== "operational" && r() > 0.8 ? base * (1 + r() * 2) : 0;
		return Math.round(base * (1 + (r() - 0.5) * jitter) + spike);
	});
});

export function getMonitor(id: string) {
	return monitors.find((m) => m.id === id);
}

export function generatePingLogs(monitorId: string, count = 40): PingLog[] {
	const monitor = getMonitor(monitorId);
	const r = createRng(monitorId.length * 733 + count);
	const now = new Date("2026-09-02T15:00:00Z").getTime();
	const intervalMs = (monitor?.checkInterval ?? 30) * 1000;

	return Array.from({ length: count }, (_, i) => {
		const isIncidentMonitor = monitor?.status === "incident";
		const isDegraded = monitor?.status === "degraded";
		const roll = r();
		let status: PingLog["status"] = "success";
		let statusCode = 200;
		if (isIncidentMonitor && roll > 0.55) {
			status = roll > 0.8 ? "timeout" : "error";
			statusCode = status === "timeout" ? 0 : pick([500, 502, 503, 504], r());
		} else if (isDegraded && roll > 0.82) {
			status = "error";
			statusCode = pick([500, 502, 429], r());
		}
		const baseLatency = monitor?.avgLatencyMs ?? 120;
		const latencyMs =
			status === "timeout"
				? monitor?.timeoutMs ?? 5000
				: Math.round(baseLatency * (0.6 + r() * (status === "error" ? 2.2 : 0.8)));

		return {
			id: `${monitorId}_ping_${i}`,
			monitorId,
			timestamp: new Date(now - i * intervalMs).toISOString(),
			statusCode,
			status,
			latencyMs,
			region: pick(REGIONS, r()),
		};
	});
}

export function generateLatencySeries(
	monitorId: string,
	range: "24h" | "7d" | "30d",
) {
	const monitor = getMonitor(monitorId);
	const points = range === "24h" ? 48 : range === "7d" ? 7 * 24 : 30;
	const stepMs =
		range === "24h" ? 30 * 60 * 1000 : range === "7d" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
	const r = createRng(monitorId.length * 51 + points);
	const now = new Date("2026-09-02T15:00:00Z").getTime();
	const base = monitor?.avgLatencyMs ?? 120;
	const volatility = monitor?.status === "incident" ? 1.4 : monitor?.status === "degraded" ? 0.7 : 0.25;

	return Array.from({ length: points }, (_, i) => {
		const idx = points - i - 1;
		const spike =
			monitor?.status !== "operational" && r() > 0.88 ? base * (1.5 + r() * 2.5) : 0;
		return {
			timestamp: new Date(now - idx * stepMs).toISOString(),
			latencyMs: Math.max(8, Math.round(base * (1 + (r() - 0.4) * volatility) + spike)),
		};
	});
}

export const incidents: Incident[] = [
	{
		id: "inc_001",
		monitorId: "mon_webhooks",
		startedAt: "2026-09-02T13:04:00Z",
		resolvedAt: null,
		durationMinutes: null,
		cause: "Elevated 503s from downstream queue consumer",
		status: "ongoing",
	},
	{
		id: "inc_002",
		monitorId: "mon_auth",
		startedAt: "2026-08-30T04:12:00Z",
		resolvedAt: "2026-08-30T04:47:00Z",
		durationMinutes: 35,
		cause: "Database connection pool exhaustion",
		status: "resolved",
	},
	{
		id: "inc_003",
		monitorId: "mon_webhooks",
		startedAt: "2026-08-21T19:30:00Z",
		resolvedAt: "2026-08-21T20:02:00Z",
		durationMinutes: 32,
		cause: "Upstream provider rate limiting",
		status: "resolved",
	},
	{
		id: "inc_004",
		monitorId: "mon_search",
		startedAt: "2026-08-11T02:15:00Z",
		resolvedAt: "2026-08-11T02:24:00Z",
		durationMinutes: 9,
		cause: "Index shard rebalance timeout",
		status: "resolved",
	},
	{
		id: "inc_005",
		monitorId: "mon_api_gateway",
		startedAt: "2026-07-28T08:00:00Z",
		resolvedAt: "2026-07-28T08:06:00Z",
		durationMinutes: 6,
		cause: "Deploy rollout health check flap",
		status: "resolved",
	},
];

export function getIncidentsForMonitor(monitorId: string) {
	return incidents.filter((i) => i.monitorId === monitorId);
}

export function generateUptimeTimeline(days = 90): UptimeDay[] {
	const r = createRng(4242);
	const now = new Date("2026-09-02T00:00:00Z").getTime();
	return Array.from({ length: days }, (_, i) => {
		const idx = days - i - 1;
		const roll = r();
		let status: MonitorStatus = "operational";
		let uptimePercent = 100;
		if (roll > 0.97) {
			status = "incident";
			uptimePercent = 92 + r() * 5;
		} else if (roll > 0.9) {
			status = "degraded";
			uptimePercent = 98 + r() * 1.8;
		} else {
			uptimePercent = 99.9 + r() * 0.1;
		}
		return {
			date: new Date(now - idx * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
			uptimePercent: Math.min(100, Number(uptimePercent.toFixed(2))),
			status,
		};
	});
}

export interface MetricsSummary {
	overallHealthPercent: number;
	activeMonitors: number;
	totalMonitors: number;
	avgLatency24hMs: number;
	openIncidents: number;
}

export const metricsSummary: MetricsSummary = {
	overallHealthPercent: 99.4,
	activeMonitors: monitors.filter((m) => m.status !== "paused").length,
	totalMonitors: monitors.length,
	avgLatency24hMs: Math.round(
		monitors.reduce((sum, m) => sum + m.avgLatencyMs, 0) / monitors.length,
	),
	openIncidents: incidents.filter((i) => i.status === "ongoing").length,
};

export interface UserProfile {
	id: string;
	name: string;
	email: string;
	avatarUrl?: string;
	role: "owner" | "admin" | "member";
}

export interface Workspace {
	id: string;
	name: string;
	slug: string;
	plan: "Free" | "Pro" | "Enterprise";
}

export const currentUser: UserProfile = {
	id: "usr_01",
	name: "Oscar Bréhier",
	email: "epicrafter10@gmail.com",
	role: "owner",
};

export const workspaces: Workspace[] = [
	{ id: "ws_01", name: "Oscar's Workspace", slug: "oscar", plan: "Pro" },
	{ id: "ws_02", name: "Acme Corp", slug: "acme", plan: "Enterprise" },
];

export const teamMembers = [
	{ id: "usr_01", name: "Oscar Bréhier", email: "epicrafter10@gmail.com", role: "owner" as const, status: "active" as const },
	{ id: "usr_02", name: "Mireille Dubois", email: "mireille@pulse.dev", role: "admin" as const, status: "active" as const },
	{ id: "usr_03", name: "Kenji Watanabe", email: "kenji@pulse.dev", role: "member" as const, status: "active" as const },
	{ id: "usr_04", name: "Priya Natarajan", email: "priya@pulse.dev", role: "member" as const, status: "invited" as const },
];

export interface ApiKey {
	id: string;
	label: string;
	keyPreview: string;
	createdAt: string;
	lastUsedAt: string | null;
}

export const apiKeys: ApiKey[] = [
	{
		id: "key_01",
		label: "Production ingest",
		keyPreview: "pk_live_7f3d…c92a",
		createdAt: "2026-01-14T10:00:00Z",
		lastUsedAt: "2026-09-02T14:58:12Z",
	},
	{
		id: "key_02",
		label: "CI status checks",
		keyPreview: "pk_live_2b91…44e0",
		createdAt: "2026-04-02T09:30:00Z",
		lastUsedAt: "2026-08-29T11:12:00Z",
	},
	{
		id: "key_03",
		label: "Local development",
		keyPreview: "pk_test_9a04…11cd",
		createdAt: "2026-06-19T17:45:00Z",
		lastUsedAt: null,
	},
];

export const pricingTiers = [
	{
		name: "Free",
		price: 0,
		description: "For side projects and personal sites.",
		features: [
			"5 monitors",
			"5 minute check interval",
			"Email alerts",
			"3-day log retention",
		],
		cta: "Start for free",
	},
	{
		name: "Pro",
		price: 29,
		description: "For growing teams that can't afford downtime.",
		features: [
			"50 monitors",
			"10 second check interval",
			"Slack + webhook alerts",
			"90-day log retention",
			"Status pages",
		],
		cta: "Start free trial",
		highlighted: true,
	},
	{
		name: "Enterprise",
		price: null,
		description: "For platforms with global scale and compliance needs.",
		features: [
			"Unlimited monitors",
			"Sub-second checks",
			"SAML SSO & audit logs",
			"1-year log retention",
			"Dedicated support",
		],
		cta: "Contact sales",
	},
];
