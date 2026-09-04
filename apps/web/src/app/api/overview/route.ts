import { getOverview } from "@/app/(dashboard)/dashboard/overview";
import { NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json(await getOverview());
};