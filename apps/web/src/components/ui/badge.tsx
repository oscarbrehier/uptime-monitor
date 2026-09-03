import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-border bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        operational:
          "border-status-operational/20 bg-status-operational/10 text-status-operational",
        degraded:
          "border-status-degraded/20 bg-status-degraded/10 text-status-degraded",
        incident:
          "border-status-incident/20 bg-status-incident/10 text-status-incident",
        paused:
          "border-status-paused/20 bg-status-paused/10 text-status-paused",
        brand: "border-primary/20 bg-primary/10 text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
