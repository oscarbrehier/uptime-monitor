import { getOverview } from "./overview";
import { OverviewLive } from "./OverviewLive";

export const metadata = { title: "Overview" };

export default async function DashboardOverviewPage() {

	const data = await getOverview();
	return <OverviewLive initial={data} />;

};
