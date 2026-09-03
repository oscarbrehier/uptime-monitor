"use client";

import { useState } from "react";
import { Check, Copy, KeyRound, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiKeys as initialKeys, type ApiKey } from "@/lib/mock-data";

export function ApiKeysTab() {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function copy(key: ApiKey) {
    navigator.clipboard?.writeText(key.keyPreview).catch(() => {});
    setCopiedId(key.id);
    setTimeout(() => setCopiedId((id) => (id === key.id ? null : id)), 1500);
  }

  function revoke(id: string) {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  }

  function createKey() {
    setKeys((prev) => [
      {
        id: `key_${prev.length + 1}`,
        label: "New API key",
        keyPreview: "pk_live_" + Math.random().toString(16).slice(2, 6) + "…" + Math.random().toString(16).slice(2, 6),
        createdAt: new Date().toISOString(),
        lastUsedAt: null,
      },
      ...prev,
    ]);
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>API keys</CardTitle>
          <CardDescription>Used to authenticate requests to the Pulse ingest API.</CardDescription>
        </div>
        <Button variant="gradient" size="sm" onClick={createKey}>
          <Plus />
          New key
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="flex items-center gap-2 font-medium">
                    <KeyRound className="size-3.5 text-muted-foreground" />
                    {key.label}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {key.keyPreview}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(key.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => copy(key)}>
                        {copiedId === key.id ? (
                          <Check className="size-3.5 text-status-operational" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:text-destructive"
                        onClick={() => revoke(key.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
