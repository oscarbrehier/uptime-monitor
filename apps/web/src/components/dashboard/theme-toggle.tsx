"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  function toggle() {
    const next = !document.documentElement.classList.contains("light");
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("pulse-theme", next ? "light" : "dark");
    } catch {
      // ignore storage failures (private browsing, disabled storage)
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      <Sun className="size-4 [html.light_&]:hidden" />
      <Moon className="hidden size-4 [html.light_&]:block" />
    </Button>
  );
}
