export class AppError extends Error {
	constructor(message: string, public statusCode = 500, options?: { cause?: unknown }) {
		super (message, options);
		this.name = "AppError";
	};
};