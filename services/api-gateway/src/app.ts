import Fastify, { FastifyError } from 'fastify';
import { monitorRoutes } from './routes/monitors';
import { AppError } from './lib/errors';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

export function buildApp() {

	const app = Fastify({ logger: true });

	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	app.register(monitorRoutes, { prefix: '/api/monitors' });

	app.setErrorHandler((error: FastifyError, request, reply) => {

		request.log.error({ err: error });

		if (error instanceof AppError) {
			return reply.code(error.statusCode).send({ error: error.message });
		};

		if (error.validation) {
			return reply.code(400).send({ error: 'Invalid request', details: error.validation })
		};

		if (error.statusCode && error.statusCode < 500) {
			return reply.code(error.statusCode).send({ error: error.message })
		};

		return reply.code(500).send({ error: 'Internal Server Error' });

	});

	return app;

};