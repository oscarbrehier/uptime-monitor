import z from "zod";


// Load .env before reading process.env
try {
	process.loadEnvFile();
} catch (err) {};

const envSchema = z.object({
	SUPABASE_URL: z.url(),
	SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
	WORKER_API_KEY: z.string().min(1),
	PORT: z.coerce.number().int().positive().default(3000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {

	console.error("Invalid environment variables:");

	for (const issue of parsed.error.issues) {
		console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
	};

	process.exit(1);

};

export const env = parsed.data;
export type Env = typeof env;