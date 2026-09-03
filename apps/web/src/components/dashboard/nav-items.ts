import { Activity, LayoutDashboard, Radar, Settings } from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/monitors", label: "Monitors", icon: Radar },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export const brand = {
  name: "Pulse",
  icon: Activity,
};
