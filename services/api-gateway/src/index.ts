import { env } from "./types/env";
import { buildApp } from "./app";

const app = buildApp();

async function start() {

	try {

		await app.listen({ port: env.PORT, host: '0.0.0.0' });

	} catch (err) {
		app.log.error(err);
		process.exit(1);
	};

};

for (const signal of ["SIGINT", "SIGTERM"] as const) {

	process.on(signal, async () => {

		app.log.info(`${signal} received, shutting down`);
		await app.close();
		process.exit(0);

	});

};

start();