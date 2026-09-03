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
import type { Monitor } from "@/lib/mock-data";

export function MonitorFormDialog({
  trigger,
  monitor,
}: {
  trigger: ReactNode;
  monitor?: Monitor;
}) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(monitor);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit monitor" : "Create monitor"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update how this endpoint is checked and who gets notified."
              : "Add a new endpoint for Pulse to watch."}
          </DialogDescription>
        </DialogHeader>
        <MonitorForm
          monitor={monitor}
          submitLabel={isEdit ? "Save changes" : "Create monitor"}
          onSubmit={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
