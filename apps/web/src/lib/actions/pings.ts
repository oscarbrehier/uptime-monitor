"use server"

import { ActionResponse } from "@/types/actions";
import { Database } from "@/types/database.types";
import { createClient } from "../supabase/server";

type Ping = Database["public"]["Tables"]["ping_logs"]["Row"];
type PingSummary = {
	pings: Ping[];
	uptimePercentage: number;
	sparkline: { timestamp: string; latency: number; up: boolean; }[];
};

export async function getLatestPings(monitorId: string): Promise<ActionResponse<PingSummary>> {

	const supabase = await createClient();

	const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

	const { data, error } = await supabase
		.from("ping_logs")
		.select("*")
		.eq("monitor_id", monitorId)
		.gte("created_at", twentyFourHoursAgo)
		.order("created_at", { ascending: true });

	if (error) {
		return {
			success: false,
			error: `Failed to fetch ping results: ${error.message}`
		};
	};

	if (data.length === 0) {
		return {
			success: true,
			data: { pings: data, uptimePercentage: 0, sparkline: [] },
		};
	};

	const upCount = data.filter(
		(ping) => ping.status_code >= 200 && ping.status_code < 300
	).length;

	const uptimePercentage = (upCount / data.length) * 100;

	const sparkline = data.map((ping) => ({
		timestamp: ping.created_at,
		latency: ping.latency_ms,
		up: ping.status_code >= 200 && ping.status_code < 300
	}));

	return {
		success: true,
		data: { pings: data, uptimePercentage, sparkline },
	};

};