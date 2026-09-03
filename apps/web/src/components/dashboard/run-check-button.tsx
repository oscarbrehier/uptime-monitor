"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export function RunCheckButton() {
  const [checking, setChecking] = useState(false);
  const [lastRan, setLastRan] = useState<string | null>(null);

  function run() {
    setChecking(true);
    // Prototype only: simulates an on-demand check with no real network call.
    setTimeout(() => {
      setChecking(false);
      setLastRan(new Date().toLocaleTimeString());
    }, 1200);
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={run} disabled={checking}>
        <RefreshCw className={checking ? "size-3.5 animate-spin" : "size-3.5"} />
        {checking ? "Checking…" : "Run check"}
      </Button>
      {lastRan && !checking && (
        <span className="text-xs text-muted-foreground">Ran at {lastRan}</span>
      )}
    </div>
  );
}
