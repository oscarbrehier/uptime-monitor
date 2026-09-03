import { ZodError } from "zod";

export function formatZodErrors(error: ZodError): Record<string, string[]> {

	const fieldErrors: Record<string, string[]> = {}

	for (const issue of error.issues) {

		const fieldName = issue.path[0] as string;
		
		if (fieldName) {

			if (!fieldErrors[fieldName]) {
				fieldErrors[fieldName] = [];
			};

			fieldErrors[fieldName].push(issue.message);

		}

	}

	return fieldErrors;

};