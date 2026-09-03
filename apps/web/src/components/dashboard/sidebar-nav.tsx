"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/components/dashboard/nav-items";
import { cn } from "@/lib/utils";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5">
      {navItems.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors",
              "hover:bg-accent hover:text-foreground",
              active && "bg-secondary text-foreground",
            )}
          >
            <item.icon
              className={cn(
                "size-4 shrink-0 text-muted-foreground group-hover:text-foreground",
                active && "text-primary",
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
