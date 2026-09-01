import { FastifyReply, FastifyRequest } from "fastify";
import { PingResult } from "../schemas/ping.schema";
import * as ingestService from "../services/ingest.service";

export async function ingestPings(
	request: FastifyRequest<{ Body: PingResult[]; }>,
	reply: FastifyReply
) {

	const results = request.body;
	await ingestService.recordPings(results);

	return reply.code(200).send({ inserted: results.length });

};