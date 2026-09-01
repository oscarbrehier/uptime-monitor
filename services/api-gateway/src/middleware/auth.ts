import { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../types/env";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {

	try {

		const authHeader = request.headers.authorization;
		const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

		if (!token || token !== env.WORKER_API_KEY) {
			return reply.code(401).send({ error: "Unauthorized" });
		};

	} catch (err) {

		return reply.code(401).send({ error: "Unauthorized" });

	};

};