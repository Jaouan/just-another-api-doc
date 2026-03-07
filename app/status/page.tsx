"use client";

import { Badge } from "@/components/ui/badge";
import {
	Activity,
	CheckCircle2,
	AlertTriangle,
	XCircle,
	Clock,
	Wifi,
	Shield,
	Bell,
	Globe,
} from "lucide-react";
import { useStatusStore, ServiceStatus } from "@/stores/useStatusStore";

const iconMap = {
	Wifi,
	Shield,
	Bell,
	Globe,
	Activity,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusConfig: Record<
	ServiceStatus,
	{ label: string; color: string; dotColor: string; icon: typeof CheckCircle2 }
> = {
	operational: {
		label: "Operational",
		color:
			"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
		dotColor: "bg-emerald-500",
		icon: CheckCircle2,
	},
	degraded: {
		label: "Degraded",
		color:
			"bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
		dotColor: "bg-amber-500",
		icon: AlertTriangle,
	},
	down: {
		label: "Down",
		color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25",
		dotColor: "bg-red-500",
		icon: XCircle,
	},
};

const severityColors: Record<string, string> = {
	minor:
		"bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
	major:
		"bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25",
	critical: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25",
};

const incidentStatusColors: Record<string, string> = {
	resolved:
		"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
	monitoring:
		"bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
	investigating:
		"bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function StatusPage() {
	const { services, incidents } = useStatusStore();
	const allOperational = services.every((s) => s.status === "operational");

	return (
		<div className="space-y-10">
			{/* Header */}
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<Activity className="size-7 text-primary" />
					<h1 className="text-3xl font-bold tracking-tight">Service Status</h1>
				</div>

				{/* Global status banner */}
				<div
					className={`flex items-center gap-3 rounded-xl border p-4 ${
						allOperational
							? "border-emerald-500/20 bg-emerald-500/5"
							: "border-amber-500/20 bg-amber-500/5"
					}`}
				>
					<span className="relative flex size-3">
						<span
							className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
								allOperational ? "bg-emerald-400" : "bg-amber-400"
							}`}
						/>
						<span
							className={`relative inline-flex size-3 rounded-full ${
								allOperational ? "bg-emerald-500" : "bg-amber-500"
							}`}
						/>
					</span>
					<span className="text-sm font-medium">
						{allOperational
							? "All systems operational"
							: "Some systems are experiencing issues"}
					</span>
				</div>
			</div>

			{/* Services */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold">Services</h2>
				<div className="grid gap-3">
					{services.map((service) => {
						const cfg = statusConfig[service.status];
						const Icon = iconMap[service.iconName];
						return (
							<div
								key={service.name}
								className="group rounded-xl border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-sm"
							>
								<div className="flex flex-col sm:flex-row sm:items-center gap-4">
									{/* Icon + info */}
									<div className="flex items-start gap-3 flex-1 min-w-0">
										<div className="rounded-lg border bg-background p-2 shrink-0">
											<Icon className="size-4 text-muted-foreground" />
										</div>
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2 flex-wrap">
												<h3 className="font-medium text-sm">{service.name}</h3>
												<Badge
													variant="outline"
													className={`text-[10px] gap-1 ${cfg.color}`}
												>
													<cfg.icon className="size-2.5" />
													{cfg.label}
												</Badge>
											</div>
											<p className="text-xs text-muted-foreground mt-0.5">
												{service.description}
											</p>
										</div>
									</div>

									{/* Uptime + bar */}
									<div className="flex flex-col items-end gap-1.5 shrink-0">
										<span className="text-xs font-mono text-muted-foreground">
											{service.uptime}% uptime
										</span>
										{/* 30-day uptime bar with temporal markers */}
										<div className="flex items-center gap-1.5">
											<span className="text-[9px] text-muted-foreground/60 font-mono">
												30d
											</span>
											<div className="flex gap-px" title="Last 30 days">
												{service.history.map((ok, i) => (
													<div
														key={`${service.name}-${i}`}
														className={`w-1.5 h-5 rounded-[2px] transition-all ${
															ok
																? "bg-emerald-500/60 dark:bg-emerald-500/40"
																: "bg-amber-500/80 dark:bg-amber-500/60"
														} group-hover:scale-y-110`}
													/>
												))}
											</div>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</section>

			{/* Incidents */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold">Recent Incidents</h2>
				<div className="space-y-4">
					{incidents.map((incident) => (
						<div
							key={incident.id}
							className="rounded-xl border bg-card overflow-hidden"
						>
							{/* Incident header */}
							<div className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 border-b bg-muted/30">
								<div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
									<h3 className="font-medium text-sm">{incident.title}</h3>
									<Badge
										variant="outline"
										className={`text-[10px] ${
											severityColors[incident.severity]
										}`}
									>
										{incident.severity}
									</Badge>
									<Badge
										variant="outline"
										className={`text-[10px] capitalize ${
											incidentStatusColors[incident.status]
										}`}
									>
										{incident.status}
									</Badge>
								</div>
								<div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
									<Clock className="size-3" />
									{incident.date}
								</div>
							</div>

							{/* Updates timeline */}
							<div className="p-4 space-y-3">
								{incident.updates.map((update, i) => (
									<div key={`${incident.id}-${i}`} className="flex gap-3">
										<div className="flex flex-col items-center mt-[1.5px]">
											<div className="size-2 rounded-full bg-muted-foreground/30 shrink-0" />
											{i < incident.updates.length - 1 && (
												<div className="w-px flex-1 bg-border mt-1" />
											)}
										</div>
										<div className="pb-3 min-w-0">
											<div className="text-[10px] font-mono text-muted-foreground leading-none mb-1">
												{update.time}
											</div>
											<p className="text-sm text-foreground/80">
												{update.message}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Footer note */}
			<p className="text-xs text-muted-foreground text-center pb-4">
				Status is updated in real-time. For urgent issues, contact the support.
			</p>
		</div>
	);
}
