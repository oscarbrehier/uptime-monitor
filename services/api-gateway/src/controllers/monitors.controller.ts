import { FastifyRequest } from "fastify";
import * as monitorService from "../services/monitors.service";

export async function listAllActiveMonitors(request: FastifyRequest) {
	return monitorService.listAllActive();
};