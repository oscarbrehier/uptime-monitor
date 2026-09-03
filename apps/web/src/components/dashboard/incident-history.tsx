import { AlertOctagon } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Badge } from "@/components/ui/badge";
import type { Incident } from "@/lib/mock-data";

function formatDuration(minutes: number | null) {
  if (minutes === null) return "Ongoing";
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export function IncidentHistory({ incidents }: { incidents: Incident[] }) {
  if (incidents.length === 0) {
    return (
      <EmptyState
        icon={AlertOctagon}
        title="No incidents recorded"
        description="This monitor has had a clean history so far."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {incidents.map((incident) => (
        <div
          key={incident.id}
          className="flex flex-col gap-2 rounded-xl border border-border bg-secondary/20 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant={incident.status === "ongoing" ? "incident" : "outline"}>
                {incident.status === "ongoing" ? "Ongoing" : "Resolved"}
              </Badge>
              <p className="text-sm font-medium">{incident.cause}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Started {new Date(incident.startedAt).toLocaleString()}
              {incident.resolvedAt &&
                ` · Recovered ${new Date(incident.resolvedAt).toLocaleString()}`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Downtime</p>
            <p className="font-mono text-sm font-medium">
              {formatDuration(incident.durationMinutes)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
