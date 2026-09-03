import Link from "next/link";
import { Plus } from "lucide-react";

import { brand } from "@/components/dashboard/nav-items";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface/60 md:flex">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <div className="flex size-6 items-center justify-center rounded-md bg-[linear-gradient(135deg,#7c5cff_0%,#38bdf8_100%)]">
            <brand.icon className="size-3.5 text-white" />
          </div>
          {brand.name}
        </Link>
      </div>
      <div className="flex flex-col gap-3 p-3">
        <WorkspaceSwitcher />
        <Button variant="gradient" size="sm" className="w-full" asChild>
          <Link href="/monitors/new">
            <Plus />
            New monitor
          </Link>
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-3">
        <SidebarNav />
      </div>
      <div className="border-t border-border p-3">
        <div className="rounded-xl border border-border bg-secondary/30 p-3">
          <p className="text-xs font-medium">Pro plan</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            42 of 50 monitors used
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-[84%] rounded-full bg-[linear-gradient(90deg,#7c5cff_0%,#38bdf8_100%)]" />
          </div>
        </div>
      </div>
    </aside>
  );
}
