import { notFound } from "next/navigation";

import { getMonitors } from "@/lib/actions/monitors";
import { getLatestPings } from "@/lib/actions/pings";
import { monitorName } from "@/lib/monitorUtils";
import { MonitorDetailLive } from "./MonitorDetailLive";

export async function generateMetadata(props: PageProps<"/monitors/[id]">) {

	const { id } = await props.params;
	const monitorsResult = await getMonitors();
	const monitor = monitorsResult.success ? monitorsResult.data.find((m) => m.id === id) : undefined;

	return { title: monitor ? monitorName(monitor.url) : "Monitor" };

};

export default async function MonitorDetailPage(props: PageProps<"/monitors/[id]">) {

	const { id } = await props.params;
	const monitorsResult = await getMonitors();
	const monitor = monitorsResult.success ? monitorsResult.data.find((m) => m.id === id) : undefined;

	if (!monitor) notFound();

	const pingsResult = await getLatestPings(monitor.id);
	const { pings, uptimePercentage } = pingsResult.success
		? pingsResult.data
		: { pings: [], uptimePercentage: 0 };

	return (
		<MonitorDetailLive monitor={monitor} initialPings={pings} initialUptime={uptimePercentage} />
	);

};