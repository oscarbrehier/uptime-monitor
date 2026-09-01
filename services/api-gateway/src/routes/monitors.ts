import { FastifyInstance } from "fastify";
import { authenticate } from "../middleware/auth";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { monitorsResponseSchema } from "../schemas/monitors.schema";
import { listAllActiveMonitors } from "../controllers/monitors.controller";

export async function monitorRoutes(app: FastifyInstance) {

	app.addHook("onRequest", authenticate);
	
	app.withTypeProvider<ZodTypeProvider>().get(
		'/active',
		{ schema: { response: { 200: monitorsResponseSchema } } },
		listAllActiveMonitors, 
	);

};