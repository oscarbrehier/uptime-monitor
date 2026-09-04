import { z } from 'zod'

export const monitorsResponseSchema = z.array(
	z.object({
		id: z.uuid(),
		url: z.url(),
		interval_seconds: z.number(),
	}),
);