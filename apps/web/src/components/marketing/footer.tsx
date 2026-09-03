import Link from "next/link";
import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:justify-between md:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <div className="flex size-6 items-center justify-center rounded-md bg-[linear-gradient(135deg,#7c5cff_0%,#38bdf8_100%)]">
            <Activity className="size-3.5 text-white" />
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
