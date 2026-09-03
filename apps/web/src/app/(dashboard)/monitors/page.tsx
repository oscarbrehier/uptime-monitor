import { MonitorList } from "@/components/dashboard/monitor-list";
import { monitors } from "@/lib/mock-data";

export const metadata = { title: "Monitors" };

export default function MonitorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Monitors</h1>
        <p className="text-sm text-muted-foreground">
          {monitors.length} endpoints being watched across your workspace.
        </p>
      </div>
      <MonitorList monitors={monitors} />
    </div>
  );
}
