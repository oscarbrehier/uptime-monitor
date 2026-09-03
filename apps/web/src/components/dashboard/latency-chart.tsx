"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import type { Ping } from "@/lib/monitorUtils";

function formatTick(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export function LatencyChart({ pings }: { pings: Ping[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold">Latency</p>
        <p className="text-xs text-muted-foreground">Response time over the last 24 hours</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={pings} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="latencyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5e5ce6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#5e5ce6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="created_at"
              tickFormatter={formatTick}
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
              dataKey="latency_ms"
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
