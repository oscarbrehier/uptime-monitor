import { Bell, Gauge, Globe2, Layers3 } from "lucide-react";

const FEATURES = [
  {
    icon: Layers3,
    title: "Massive concurrency",
    description:
      "Run thousands of checks in parallel without any lag in detection or alerting.",
    glow: "from-violet-500/20",
  },
  {
    icon: Globe2,
    title: "Global edge monitoring",
    description:
      "Probe your endpoints from regions around the world to catch regional outages fast.",
    glow: "from-sky-500/20",
  },
  {
    icon: Bell,
    title: "Real-time alerts",
    description:
      "Get paged over Slack, webhook, or email the moment something looks off.",
    glow: "from-amber-500/20",
  },
  {
    icon: Gauge,
    title: "Instant analytics",
    description:
      "Latency percentiles, uptime history, and incident timelines — always up to date.",
    glow: "from-emerald-500/20",
  },
];

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
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6"
            >
              <div
                className={`pointer-events-none absolute -top-8 -right-8 size-28 rounded-full bg-gradient-to-br ${feature.glow} to-transparent blur-2xl transition-opacity group-hover:opacity-150`}
              />
              <div className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-secondary/50">
                <feature.icon className="size-5 text-primary" />
              </div>
              <h3 className="relative mt-4 text-sm font-semibold">{feature.title}</h3>
              <p className="relative mt-1.5 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
