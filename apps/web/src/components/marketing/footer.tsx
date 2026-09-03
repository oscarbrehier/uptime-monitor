import Link from "next/link";
import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:justify-between md:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <div className="flex size-6 items-center justify-center rounded-md border border-violet-accent/30 bg-violet-accent/15">
            <Activity className="size-3.5 text-violet-accent" />
          </div>
          Pulse
        </Link>
        <p>© 2026 Pulse, Inc. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-foreground">Privacy</Link>
          <Link href="#" className="hover:text-foreground">Terms</Link>
          <Link href="#" className="hover:text-foreground">Status</Link>
        </div>
      </div>
    </footer>
  );
}
