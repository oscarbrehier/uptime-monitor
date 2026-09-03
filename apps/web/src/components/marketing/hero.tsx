import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HeroStatusCard } from "@/components/marketing/hero-status-card";
import { LatencyTicker } from "@/components/marketing/latency-ticker";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-[-12rem] size-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_#7c5cff2e_0%,_transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute right-[-10rem] top-40 size-[30rem] rounded-full bg-[radial-gradient(circle,_#38bdf82e_0%,_transparent_70%)] blur-2xl" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-20 md:grid-cols-2 md:items-center md:px-8 md:py-28">
        <div className="flex flex-col gap-6">
          <div className="flex w-fit items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-[pulse-ring_2s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-full bg-status-operational opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-status-operational" />
            </span>
            All systems operational
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Uptime monitoring that{" "}
            <span className="text-gradient-brand">never blinks</span>.
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Global edge checks, real-time alerts, and instant analytics for every
            API your business depends on — down to the millisecond.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="gradient" size="lg" asChild>
              <Link href="/register">
                Start monitoring free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">View live demo</Link>
            </Button>
          </div>

          <div className="pt-2">
            <LatencyTicker />
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <HeroStatusCard />
        </div>
      </div>
    </section>
  );
}
