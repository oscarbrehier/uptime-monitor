"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMonitor, type PingLog } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Filter = "all" | "success" | "error" | "timeout";

function statusLabel(ping: PingLog) {
  if (ping.status === "timeout") return "Timeout";
  return `${ping.statusCode} ${ping.status === "success" ? "OK" : "Error"}`;
}

export function PingsTable({ pings }: { pings: PingLog[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    return pings.filter((ping) => {
      if (filter !== "all" && ping.status !== filter) return false;
      if (!query) return true;
      const monitor = getMonitor(ping.monitorId);
      return monitor?.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [pings, filter, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="success">Success</TabsTrigger>
            <TabsTrigger value="error">Errors</TabsTrigger>
            <TabsTrigger value="timeout">Timeouts</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by monitor…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Monitor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Latency</TableHead>
              <TableHead>Region</TableHead>
              <TableHead className="text-right">Checked</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No pings match this filter.
                </TableCell>
              </TableRow>
            )}
            {filtered.slice(0, 20).map((ping) => {
              const monitor = getMonitor(ping.monitorId);
              return (
                <TableRow key={ping.id}>
                  <TableCell className="font-medium">{monitor?.name ?? ping.monitorId}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ping.status === "success"
                          ? "operational"
                          : ping.status === "timeout"
                            ? "paused"
                            : "incident"
                      }
                      className="font-mono"
                    >
                      {statusLabel(ping)}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "font-mono text-xs",
                      ping.latencyMs > 800 && "text-status-degraded",
                    )}
                  >
                    {ping.latencyMs}ms
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground uppercase">
                    {ping.region}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {new Date(ping.timestamp).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
