import { Bell, Gauge, Globe2, Layers3 } from "lucide-react";

import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Layers3,
    title: "Massive concurrency",
    description:
      "Run thousands of checks in parallel without any lag in detection or alerting.",
    accent: "violet-accent",
  },
  {
    icon: Globe2,
    title: "Global edge monitoring",
    description:
      "Probe your endpoints from regions around the world to catch regional outages fast.",
    accent: "emerald-glow",
  },
  {
    icon: Bell,
    title: "Real-time alerts",
    description:
      "Get paged over Slack, webhook, or email the moment something looks off.",
    accent: "amber-glow",
  },
  {
    icon: Gauge,
    title: "Instant analytics",
    description:
      "Latency percentiles, uptime history, and incident timelines — always up to date.",
    accent: "violet-accent",
  },
] as const;

const ACCENT_CLASSES = {
  "violet-accent": "border-violet-accent/30 bg-violet-accent/15 text-violet-accent",
  "emerald-glow": "border-emerald-glow/30 bg-emerald-glow/15 text-emerald-glow",
  "amber-glow": "border-amber-glow/30 bg-amber-glow/15 text-amber-glow",
} as const;

export function FeatureGrid() {
  return (
    <section id="features" className="border-b border-border/60 py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Built for teams that can&apos;t afford downtime
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to know the moment something breaks — and exactly
            what to do about it.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md transition-colors hover:border-violet-accent/30"
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl border",
                  ACCENT_CLASSES[feature.accent],
                )}
              >
                <feature.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{feature.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
