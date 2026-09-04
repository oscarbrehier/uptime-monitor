"use client";

import Link from "next/link";
import { MoreHorizontal, Pause, Play, Trash2, ArrowUpRight } from "lucide-react";

import { Sparkline } from "@/components/dashboard/sparkline";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { monitorName, type MonitorWithStats } from "@/lib/monitorUtils";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function MonitorCard({
	initial,
	onTogglePause,
	onDelete,
}: {
	initial: MonitorWithStats;
	onTogglePause: (id: string) => void;
	onDelete: (id: string) => void;
}) {

	const [monitor, setMonitor] = useState(initial);

	useEffect(() => {

		const supabase = createClient();

		const channel = supabase
			.channel(`monitor-${initial.id}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "ping_logs",
					filter: `monitor_id=eq.${initial.id}`
				},
				(payload) => {

					const ping = payload.new as { latency_ms: number; status_code: number };
					setMonitor((prev) => {

						const sparkline = [...prev.sparkline.slice(-19), ping.latency_ms];
						const avgLatencyMs = Math.round(
							sparkline.reduce((sum, v) => sum + v, 0) / sparkline.length,
						);

						return { ...prev, sparkline, avgLatencyMs };

					});

				}
			)
			.subscribe((status, err) => {
				console.log("[RT] status", initial.id, status);
				if (err) console.error("[RT] err:", err.message);
			});

		return () => {
			supabase.removeChannel(channel);
		};

	}, [initial.id]);

	return (

		<Card className="flex flex-col gap-4 p-5 transition-colors hover:border-primary/30">
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<Link
						href={`/monitors/${monitor.id}`}
						className="group flex items-center gap-1.5 text-sm font-semibold"
					>
						<span className="truncate">{monitorName(monitor.url)}</span>
						<ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
					</Link>
					<p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
						{monitor.url}
					</p>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="size-7 shrink-0">
							<MoreHorizontal className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onSelect={() => onTogglePause(monitor.id)}>
							{monitor.status === "paused" ? <Play /> : <Pause />}
							{monitor.status === "paused" ? "Resume" : "Pause"}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive" onSelect={() => onDelete(monitor.id)}>
							<Trash2 />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<StatusBadge status={monitor.status} pulse className="self-start" />

			<Sparkline data={monitor.sparkline} status={monitor.status} />

			<div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs">
				<div>
					<p className="text-[10px] uppercase tracking-widest text-muted-foreground">Uptime 24h</p>
					<p className="mt-0.5 font-mono font-medium">{monitor.uptime24h}%</p>
				</div>
				<div>
					<p className="text-[10px] uppercase tracking-widest text-muted-foreground">Avg latency</p>
					<p className="mt-0.5 font-mono font-medium">{monitor.avgLatencyMs}ms</p>
				</div>
				<div>
					<p className="text-[10px] uppercase tracking-widest text-muted-foreground">Interval</p>
					<p className="mt-0.5 font-mono font-medium">{monitor.interval_seconds}s</p>
				</div>
			</div>
		</Card>

	);

};
