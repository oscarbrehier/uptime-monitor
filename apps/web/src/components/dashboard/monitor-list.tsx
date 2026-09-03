"use client";

import { useMemo, useState } from "react";
import { Plus, Radar, Search } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { MonitorCard } from "@/components/dashboard/monitor-card";
import { MonitorFormDialog } from "@/components/dashboard/monitor-form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Monitor, MonitorStatus } from "@/lib/mock-data";

type Filter = "all" | MonitorStatus;

export function MonitorList({ monitors: initial }: { monitors: Monitor[] }) {
  const [monitors, setMonitors] = useState(initial);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    return monitors.filter((m) => {
      if (filter !== "all" && m.status !== filter) return false;
      if (query && !m.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [monitors, filter, query]);

  function togglePause(id: string) {
    setMonitors((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "paused" ? "operational" : "paused" }
          : m,
      ),
    );
  }

  function remove(id: string) {
    setMonitors((prev) => prev.filter((m) => m.id !== id));
  }

  if (monitors.length === 0) {
    return (
      <EmptyState
        icon={Radar}
        title="No monitors yet"
        description="Add your first endpoint and Pulse will start checking it around the clock."
        action={
          <MonitorFormDialog
            trigger={
              <Button variant="gradient">
                <Plus />
                Create your first monitor
              </Button>
            }
          />
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="operational">Up</TabsTrigger>
            <TabsTrigger value="degraded">Degraded</TabsTrigger>
            <TabsTrigger value="incident">Down</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search monitors…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <MonitorFormDialog
            trigger={
              <Button variant="gradient" size="sm" className="shrink-0">
                <Plus />
                <span className="hidden sm:inline">Create monitor</span>
              </Button>
            }
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No monitors match your filters"
          description="Try a different search term or clear the status filter."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((monitor) => (
            <MonitorCard
              key={monitor.id}
              monitor={monitor}
              onTogglePause={togglePause}
              onDelete={remove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
