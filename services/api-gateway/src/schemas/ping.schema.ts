import z from "zod";

export const pingResultSchema = z.object({
	monitor_id: z.uuid(),
	status_code: z.number().int(),
	latency_ms: z.number().int().nonnegative()
});

export const pingBatchSchema = z.array(pingResultSchema);

export type PingResult = z.infer<typeof pingResultSchema>;