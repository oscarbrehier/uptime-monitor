import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/auth";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { pingBatchSchema } from "../schemas/ping.schema";
import { ingestPings } from "../controllers/ingest.controller";

export async function ingestRoutes(app: FastifyInstance) {

	app.addHook('onRequest', authenticate);

	app.withTypeProvider<ZodTypeProvider>().post(
		"/",
		{ schema: { body: pingBatchSchema } },
		ingestPings
	);

};