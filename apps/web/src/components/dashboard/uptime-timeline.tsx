"use client";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { pingStatus, type Ping, type PingStatus } from "@/lib/monitorUtils";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const BUCKETS = 48;
const WINDOW_MS = 24 * 60 * 60 * 1000;

const BAR_COLOR: Record<PingStatus, string> = {
	success: "bg-status-operational",
	error: "bg-status-incident",
	timeout: "bg-status-degraded",
};

export function UptimeTimeline({ pings }: { pings: Ping[] }) {


	const [now, setNow] = useState<number | null>(null);

	console.log("timeline pings:", pings.length, pings[0]?.created_at, "now:", now);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setNow(Date.now());
		const id = setInterval(() => setNow(Date.now()), 60_000);
		return () => clearInterval(id);
	}, []);

	if (now === null) {
		return (
			<div className="flex h-8 w-full gap-0.5">
				<div className="h-full w-full rounded-[2px] bg-secondary/40" />
			</div>
		);
	};

	const windowStart = now - WINDOW_MS;

	const recent = pings.filter((p) => new Date(p.created_at).getTime() >= windowStart);
	console.log("recent in window:", recent.length);

	const bucketMs = WINDOW_MS / BUCKETS;
	const buckets: Ping[][] = Array.from({ length: BUCKETS }, () => []);
	for (const ping of recent) {
		const age = now - new Date(ping.created_at).getTime();
		const idx = BUCKETS - 1 - Math.floor(age / bucketMs);
		if (idx >= 0 && idx < BUCKETS) buckets[idx].push(ping);
	}

	const upCount = recent.filter((p) => pingStatus(p.status_code) === "success").length;
	const uptimePercent = recent.length ? (upCount / recent.length) * 100 : 100;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between text-xs text-muted-foreground">
				<span>24h ago</span>
				<span className="font-medium text-foreground">{uptimePercent.toFixed(2)}% uptime</span>
				<span>Now</span>
			</div>
			<div className="flex h-8 w-full gap-0.5">
				{buckets.map((bucket, i) => {
					if (bucket.length === 0) {
						return <div key={i} className="h-full flex-1 rounded-[2px] bg-secondary/40" />;
					}

					const hasError = bucket.some((p) => pingStatus(p.status_code) === "error");
					const hasTimeout = bucket.some((p) => pingStatus(p.status_code) === "timeout");
					const status: PingStatus = hasError ? "error" : hasTimeout ? "timeout" : "success";
					const failed = bucket.filter((p) => pingStatus(p.status_code) !== "success").length;

					return (
						<Tooltip key={i}>
							<TooltipTrigger asChild>
								<div
									className={cn(
										"h-full flex-1 rounded-[2px] transition-transform hover:scale-y-110",
										BAR_COLOR[status],
									)}
								/>
							</TooltipTrigger>
							<TooltipContent>
								<p className="font-medium">{bucket.length} checks</p>
								<p className="text-muted-foreground">
									{failed === 0 ? "All operational" : `${failed} failed`}
								</p>
							</TooltipContent>
						</Tooltip>
					);
				})}
			</div>
		</div>
	);
	
};