import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen w-full overflow-hidden bg-background">
			<Sidebar />
			<div className="flex min-h-0 min-w-0 flex-1 flex-col">
				<Topbar />
				<main className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-grid p-8">
					<div className="mx-auto w-full max-w-6xl">{children}</div>
				</main>
			</div>
		</div>
	);
}
