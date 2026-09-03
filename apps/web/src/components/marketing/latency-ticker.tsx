"use client";

import { useEffect, useState } from "react";

const REGIONS = [
  { code: "IAD", latency: 42 },
  { code: "SFO", latency: 58 },
  { code: "FRA", latency: 61 },
  { code: "SIN", latency: 89 },
  { code: "SYD", latency: 104 },
];

export function LatencyTicker() {
  const [ticks, setTicks] = useState(REGIONS);

  useEffect(() => {
    const id = setInterval(() => {
      setTicks((prev) =>
        prev.map((t) => ({
          ...t,
          latency: Math.max(18, Math.round(t.latency + (Math.random() - 0.5) * 14)),
        })),
      );
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {ticks.map((t) => (
        <div key={t.code} className="flex items-center gap-1.5 font-mono text-xs">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-[pulse-ring_2s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-full bg-status-operational opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-status-operational" />
          </span>
          <span className="text-muted-foreground">{t.code}</span>
          <span className="tabular-nums text-foreground">{t.latency}ms</span>
        </div>
      ))}
    </div>
  );
}
