"use client";

import { Search } from "lucide-react";

export function CommandMenuTrigger() {
  return (
    <button
      type="button"
      className="flex h-9 w-full max-w-sm items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 text-sm text-muted-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40"
      onClick={() => {
        // Prototype only — no command palette is wired up yet.
      }}
    >
      <Search className="size-4 shrink-0" />
      <span className="flex-1 text-left">Search monitors, incidents…</span>
      <kbd className="inline-flex items-center gap-0.5 rounded border border-border bg-background/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  );
}
