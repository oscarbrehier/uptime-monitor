"use server"

import { Database } from "@/types/database.types";
import { createClient } from "../supabase/server"
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/types/actions";

type Monitor = Database["public"]["Tables"]["monitors"]["Row"];

export async function getMonitors(): Promise<ActionResponse<Monitor[]>> {

	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	if (!user) {
		return {
			success: false,
			error: "Unauthorized: Please login to view monitors."
		};
	};

	const { error, data } = await supabase
		.from("monitors")
		.select("*")
		.eq("user_id", user.id)
		.order("created_at", { ascending: false });

	if (error || !data) {
		return {
			success: false,
			error: `Failed to fetch monitors: ${error.message}`
		};
	};

	return {
		success: true,
		data: data ?? []
	};

};

export async function createMonitor(data: {
	interval_seconds: number;
	is_active: boolean;
	url: string;
}): Promise<ActionResponse<Monitor>> {

	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	if (!user) {
		return {
			success: false,
			error: "Unauthorized: Please login to create monitors."
		};
	};

	if (data.interval_seconds <= 0) {
		return {
			success: false,
			error: "Interval must be above 0 seconds."
		};
	};

	const { error, data: monitor } = await supabase
		.from("monitors")
		.insert({
			...data,
			user_id: user.id
		})
		.select()
		.single();

	if (error) {
		return {
			success: false,
			error: `Failed to create monitor: ${error.message}`
		};
	};

	revalidatePath("/monitors");
	revalidatePath("/dashboard");

	return {
		success: true,
		data: monitor
	}

};

export async function deleteMonitor(id: string): Promise<ActionResponse<null>> {

	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	if (!user) {
		return {
			success: false,
			error: "Unauthorized."
		};
	};

	const { error } = await supabase
		.from("monitors")
		.delete()
		.eq("id", id)
		.eq("user_id", user.id);

	if (error) {
		return { success: false, error: `Failed to delete monitor: ${error.message}` };
	};

	revalidatePath("/monitors");
	revalidatePath("/dashboard");

	return {
		success: true,
		data: null
	};

};

export async function toggleMonitor(id: string, currentState: boolean): Promise<ActionResponse<null>> {

	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	if (!user) {
		return {
			success: false,
			error: "Unauthorized."
		};
	};

	const { error } = await supabase
		.from("monitors")
		.update({ "is_active": !currentState })
		.eq("id", id)
		.eq("user_id", user.id);

	if (error) {
		return {
			success: false,
			error: `Failed to update status: ${error.message}`
		};
	};

	return {
		success: true,
		data: null
	};

};