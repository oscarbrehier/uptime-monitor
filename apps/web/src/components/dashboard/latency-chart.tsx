"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { Button } from "@/components/ui/button";
import { generateLatencySeries } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Range = "24h" | "7d" | "30d";
const RANGES: Range[] = ["24h", "7d", "30d"];

function formatTick(iso: string, range: Range) {
  const d = new Date(iso);
  if (range === "24h") {
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function LatencyChart({ monitorId }: { monitorId: string }) {
  const [range, setRange] = useState<Range>("24h");
  const data = useMemo(() => generateLatencySeries(monitorId, range), [monitorId, range]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Latency</p>
          <p className="text-xs text-muted-foreground">Response time over the selected window</p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-secondary/40 p-1">
          {RANGES.map((r) => (
            <Button
              key={r}
              size="sm"
              variant="ghost"
              onClick={() => setRange(r)}
              className={cn(
                "h-7 rounded-md px-2.5 text-xs",
                range === r && "bg-foreground text-background hover:bg-foreground/90",
              )}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="latencyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5e5ce6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#5e5ce6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(v) => formatTick(v, range)}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              minTickGap={40}
            />
            <YAxis
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={(v) => `${v}ms`}
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                fontSize: 12,
              }}
              labelFormatter={(v) => new Date(v as string).toLocaleString()}
              formatter={(value) => [`${value}ms`, "Latency"]}
            />
            <Area
              type="monotone"
              dataKey="latencyMs"
              stroke="#5e5ce6"
              strokeWidth={2}
              fill="url(#latencyFill)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
