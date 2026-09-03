"use client";

import { useState, type ReactNode } from "react";

import { MonitorForm } from "@/components/dashboard/monitor-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function MonitorFormDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create monitor</DialogTitle>
          <DialogDescription>Add a new endpoint for Pulse to watch.</DialogDescription>
        </DialogHeader>
        <MonitorForm onSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
