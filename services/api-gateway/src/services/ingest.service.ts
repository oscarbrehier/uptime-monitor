import { AppError } from "../lib/errors";
import { supabaseAdmin } from "../lib/supabase";
import { PingResult } from "../schemas/ping.schema";

export async function recordPings(results: PingResult[]) {

	const { error } = await supabaseAdmin.from("ping_logs").insert(results);

	if (error) {
		throw new AppError("Failed to record ping logs", 500, { cause: error });
	};

	for (const ping of results) {

		if (ping.status_code === 0 || ping.status_code >= 400) {

			const reason = ping.status_code === 0
				? 'network/DNS failure or timeout'
				: `HTTP ${ping.status_code}`

			console.warn(`[DOWN] monitor=${ping.monitor_id} ${reason} latency=${ping.latency_ms}ms`);

		};

	};

};