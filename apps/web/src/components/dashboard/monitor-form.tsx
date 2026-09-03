"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
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
import { createMonitor } from "@/lib/actions/monitors";

const INTERVALS = [10, 30, 60, 300, 900] as const;
const INTERVAL_LABELS: Record<(typeof INTERVALS)[number], string> = {
  10: "Every 10 seconds",
  30: "Every 30 seconds",
  60: "Every minute",
  300: "Every 5 minutes",
  900: "Every 15 minutes",
};

export function MonitorForm({
  onSubmit,
  submitLabel = "Create monitor",
}: {
  onSubmit?: () => void;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [interval, setIntervalValue] = useState<string>("60");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const url = formData.get("url") as string;

    const result = await createMonitor({
      url,
      interval_seconds: Number(interval),
      is_active: isActive,
    });

    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.refresh();
    onSubmit?.();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="url">Target URL</Label>
          <Input
            id="url"
            name="url"
            type="url"
            placeholder="https://api.example.com/health"
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
                  {INTERVAL_LABELS[i]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <label className="flex items-center gap-2.5 text-sm">
          <Checkbox checked={isActive} onCheckedChange={(v) => setIsActive(Boolean(v))} />
          Start monitoring immediately
        </label>
      </div>

      {error && <p className="text-xs text-status-incident">{error}</p>}

      <Button type="submit" variant="gradient" disabled={submitting} className="self-start">
        {submitting && <Loader2 className="size-4 animate-spin" />}
        {submitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
