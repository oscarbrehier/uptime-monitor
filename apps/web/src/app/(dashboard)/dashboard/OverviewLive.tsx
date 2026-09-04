"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { monitorName } from "@/lib/monitorUtils";
import { useEffect, useState } from "react";
import { OverviewData } from "./overview";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ArrowUpRight, Radar } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { createClient } from "@/lib/supabase/client";
import { MetricsBar } from "@/components/dashboard/metrics-bar";
import { PingsTable } from "@/components/dashboard/pings-table";


export function OverviewLive({
	initial
}: {
	initial: OverviewData;
}) {

	const [data, setData] = useState<OverviewData>(initial);

	useEffect(() => {

		const supabase = createClient();

		const refetch = async () => {
			const res = await fetch("/api/overview", { cache: "no-store" });
			if (res.ok) setData(await res.json());
		};

		const channel = supabase
			.channel("overview")
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "ping_logs" },
				() => { refetch() },
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};

	}, []);



	return (

		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-xl font-semibold tracking-tight">Overview</h1>
				<p className="text-sm text-muted-foreground">
					Everything you monitor, at a glance.
				</p>
			</div>

			<MetricsBar metrics={data.metrics} />

			<Card>
				<CardHeader>
					<CardTitle>Monitor status</CardTitle>
					<CardDescription>24-hour uptime across your workspace</CardDescription>
				</CardHeader>
				<CardContent>
					{data.monitors.length === 0 ? (
						<EmptyState
							icon={Radar}
							title="No monitors yet"
							description="Add your first endpoint from the Monitors page to start tracking uptime."
						/>
					) : (
						<div className="flex flex-col">
							{data.monitors.map((monitor) => (
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
					<PingsTable pings={data.allPings} monitorNames={data.monitorNames} />
				</CardContent>
			</Card>
		</div>

	);

};