import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { pricingTiers } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function PricingTable() {
  return (
    <section id="pricing" className="border-b border-border/60 py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Simple, transparent pricing</h2>
          <p className="mt-3 text-muted-foreground">
            Start free. Upgrade when your monitoring needs grow.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative flex flex-col gap-6 rounded-2xl border p-6 backdrop-blur-md",
                tier.highlighted
                  ? "border-violet-accent/40 bg-violet-accent/[0.06]"
                  : "border-border bg-card/60",
              )}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-6 rounded-full border border-violet-accent/30 bg-card px-3 py-1 text-[11px] font-medium text-violet-accent">
                  Most popular
                </span>
              )}

              <div>
                <h3 className="text-sm font-semibold">{tier.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                {tier.price === null ? (
                  <span className="text-3xl font-semibold">Custom</span>
                ) : (
                  <>
                    <span className="text-3xl font-semibold">${tier.price}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </>
                )}
              </div>

              <Button variant={tier.highlighted ? "gradient" : "outline"} asChild>
                <Link href="/register">{tier.cta}</Link>
              </Button>

              <ul className="flex flex-col gap-2.5 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
