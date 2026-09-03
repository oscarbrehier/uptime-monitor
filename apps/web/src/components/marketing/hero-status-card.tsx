import { Sparkline } from "@/components/dashboard/sparkline";
import { StatusDot } from "@/components/dashboard/status-badge";
import { monitors } from "@/lib/mock-data";

export function HeroStatusCard() {
  const preview = monitors.slice(0, 4);

  return (
    <div className="glass w-full max-w-md rounded-2xl border border-border/80 shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-border/80 px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs text-muted-foreground">pulse — production</span>
      </div>
      <div className="flex flex-col divide-y divide-border/70">
        {preview.map((m) => (
          <div key={m.id} className="flex items-center gap-3 px-4 py-3">
            <StatusDot status={m.status} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{m.name}</p>
              <p className="truncate font-mono text-[11px] text-muted-foreground">{m.url}</p>
            </div>
            <div className="w-20 shrink-0">
              <Sparkline data={m.sparkline} status={m.status} height={28} />
            </div>
            <span className="w-12 shrink-0 text-right font-mono text-xs text-muted-foreground">
              {m.avgLatencyMs}ms
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
