import Link from "next/link";
import { Activity } from "lucide-react";

import { Card } from "@/components/ui/card";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      <div className="relative flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center justify-center gap-2 text-sm font-semibold">
          <div className="flex size-7 items-center justify-center rounded-md border border-violet-accent/30 bg-violet-accent/15">
            <Activity className="size-4 text-violet-accent" />
          </div>
          Pulse
        </Link>

        <Card className="glass border-border/80 p-6">
          <div className="mb-5 flex flex-col gap-1 text-center">
            <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </Card>

        <p className="text-center text-sm text-muted-foreground">{footer}</p>
      </div>
    </div>
  );
}
