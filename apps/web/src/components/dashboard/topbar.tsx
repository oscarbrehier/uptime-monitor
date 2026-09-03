"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Plus } from "lucide-react";

import { brand } from "@/components/dashboard/nav-items";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";
import { CommandMenuTrigger } from "@/components/dashboard/command-menu-trigger";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { UserMenu } from "@/components/dashboard/user-menu";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

export function Topbar() {
	const [open, setOpen] = useState(false);

	return (
		<header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon" className="md:hidden">
						<Menu className="size-4" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-72">
					<SheetHeader>
						<SheetTitle className="flex items-center gap-2">
							<div className="flex size-6 items-center justify-center rounded-md border border-violet-accent/30 bg-violet-accent/15">
								<brand.icon className="size-3.5 text-violet-accent" />
							</div>
							{brand.name}
						</SheetTitle>
					</SheetHeader>
					<WorkspaceSwitcher />
					<Button variant="gradient" size="sm" className="w-full" asChild>
						<Link href="/monitors/new" onClick={() => setOpen(false)}>
							<Plus />
							New monitor
						</Link>
					</Button>
					<SidebarNav onNavigate={() => setOpen(false)} />
				</SheetContent>
			</Sheet>

			<div className="hidden flex-1 md:flex">
				<CommandMenuTrigger />
			</div>
			<div className="flex flex-1 items-center gap-2 md:hidden">
				<Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold">
					<div className="flex size-6 items-center justify-center rounded-md border border-violet-accent/30 bg-violet-accent/15">
						<brand.icon className="size-3.5 text-violet-accent" />
					</div>
					{brand.name}
				</Link>
			</div>

			<div className="flex items-center gap-1.5">
				<ThemeToggle />
				<UserMenu />
			</div>
		</header>

	);

};
