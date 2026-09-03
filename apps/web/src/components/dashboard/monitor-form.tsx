"use client";

import { useState, type SubmitEvent } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Monitor, NotificationChannel } from "@/lib/mock-data";

const INTERVALS = [10, 30, 60] as const;
const CHANNELS: { id: NotificationChannel; label: string }[] = [
  { id: "email", label: "Email" },
  { id: "slack", label: "Slack" },
  { id: "webhook", label: "Webhook" },
];

export function MonitorForm({
  monitor,
  onSubmit,
  submitLabel = "Create monitor",
}: {
  monitor?: Monitor;
  onSubmit?: () => void;
  submitLabel?: string;
}) {
  const [channels, setChannels] = useState<Set<NotificationChannel>>(
    new Set(monitor?.notifications ?? ["email"]),
  );
  const [interval, setIntervalValue] = useState<string>(
    String(monitor?.checkInterval ?? 30),
  );
  const [submitting, setSubmitting] = useState(false);

  function toggleChannel(id: NotificationChannel) {
    setChannels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Prototype only: simulate a network round trip, no data is persisted.
    setTimeout(() => {
      setSubmitting(false);
      onSubmit?.();
    }, 900);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="name">Friendly name</Label>
          <Input
            id="name"
            placeholder="Checkout Service"
            defaultValue={monitor?.name}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="url">Target URL</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://api.example.com/health"
            defaultValue={monitor?.url}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Check interval</Label>
          <Select value={interval} onValueChange={setIntervalValue}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INTERVALS.map((i) => (
                <SelectItem key={i} value={String(i)}>
                  Every {i} seconds
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="timeout">Timeout (ms)</Label>
          <Input
            id="timeout"
            type="number"
            min={1000}
            step={500}
            defaultValue={monitor?.timeoutMs ?? 5000}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Notification channels</Label>
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-secondary/30 p-3">
          {CHANNELS.map((channel) => (
            <label
              key={channel.id}
              className="flex items-center gap-2.5 text-sm"
            >
              <Checkbox
                checked={channels.has(channel.id)}
                onCheckedChange={() => toggleChannel(channel.id)}
              />
              {channel.label}
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" variant="gradient" disabled={submitting} className="self-start">
        {submitting && <Loader2 className="size-4 animate-spin" />}
        {submitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
