import { AppError } from "../lib/errors";
import { supabaseAdmin } from "../lib/supabase";

export async function listAllActive() {

	const { data, error } = await supabaseAdmin
	.from("monitors")
	.select("id, url")
	.eq("is_active", true);

	if (error) {
		throw new AppError("Failed to fetch monitors", 500, { cause: error });
	};

	return data ?? [];

};