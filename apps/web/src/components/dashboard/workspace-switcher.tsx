"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { workspaces } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function WorkspaceSwitcher() {
  const [activeId, setActiveId] = useState(workspaces[0].id);
  const active = workspaces.find((w) => w.id === activeId) ?? workspaces[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-lg border border-border bg-secondary/40 px-2.5 py-2 text-left outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/40">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-violet-accent/30 bg-violet-accent/15 text-[11px] font-semibold text-violet-accent">
          {active.name.charAt(0)}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-xs font-medium">{active.name}</span>
          <span className="text-[10px] text-muted-foreground">{active.plan} plan</span>
        </div>
        <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        {workspaces.map((w) => (
          <DropdownMenuItem
            key={w.id}
            onSelect={() => setActiveId(w.id)}
            className="justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="flex size-5 shrink-0 items-center justify-center rounded-md border border-violet-accent/30 bg-violet-accent/15 text-[10px] font-semibold text-violet-accent">
                {w.name.charAt(0)}
              </div>
              <span>{w.name}</span>
            </div>
            {w.id === activeId && <Check className="size-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className={cn("text-muted-foreground")}>
          <Plus className="size-4" />
          Create workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
