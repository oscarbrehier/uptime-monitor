"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { MonitorForm } from "@/components/dashboard/monitor-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewMonitorPage() {
  const router = useRouter();

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <Link
        href="/monitors"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to monitors
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create monitor</CardTitle>
          <CardDescription>Add a new endpoint for Pulse to watch.</CardDescription>
        </CardHeader>
        <CardContent>
          <MonitorForm onSubmit={() => router.push("/monitors")} />
        </CardContent>
      </Card>
    </div>
  );
}
