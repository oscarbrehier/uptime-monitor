"use client";

import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";

import type { MonitorStatus } from "@/lib/monitorUtils";

const STROKE: Record<MonitorStatus, string> = {
  operational: "#10b981",
  degraded: "#f59e0b",
  incident: "#ff453a",
  paused: "#6b7280",
};

export function Sparkline({
  data,
  status,
  height = 40,
}: {
  data: number[];
  status: MonitorStatus;
  height?: number;
}) {
  const points = data.map((value, i) => ({ i, value }));
  const color = STROKE[status];
  const gradientId = `spark-${status}-${data.length}-${data[0] ?? 0}`;

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.75}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
