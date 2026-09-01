import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";
import { env } from "../types/env";

export const supabaseAdmin = createClient<Database>(
	env.SUPABASE_URL,
	env.SUPABASE_SERVICE_ROLE_KEY
);