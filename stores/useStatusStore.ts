import { create } from "zustand";

export type ServiceStatus = "operational" | "degraded" | "down";

export interface Service {
	name: string;
	description: string;
	status: ServiceStatus;
	uptime: number;
	iconName: "Wifi" | "Shield" | "Bell" | "Globe" | "Activity";
	history: boolean[];
}

export interface Incident {
	id: string;
	title: string;
	status: "resolved" | "monitoring" | "investigating";
	severity: "minor" | "major" | "critical";
	date: string;
	updates: { time: string; message: string }[];
}

function generateHistory(downtimeDays: number[] = []): boolean[] {
	return Array.from({ length: 30 }, (_, i) => !downtimeDays.includes(i));
}

type StatusStoreState = {
	services: Service[];
	incidents: Incident[];
};

export const useStatusStore = create<StatusStoreState>((_set) => ({
	services: [
		{
			name: "REST API",
			description: "Core API endpoints for pet, store, and user operations",
			status: "operational",
			uptime: 99.98,
			iconName: "Wifi",
			history: generateHistory(),
		},
		{
			name: "Authentication",
			description: "OAuth 2.0, API key validation, and token management",
			status: "operational",
			uptime: 99.99,
			iconName: "Shield",
			history: generateHistory(),
		},
		{
			name: "Webhooks",
			description: "Event notifications and callback delivery system",
			status: "degraded",
			uptime: 99.42,
			iconName: "Bell",
			history: generateHistory([3, 4, 18]),
		},
		{
			name: "CDN & Assets",
			description: "Static assets, pet images, and media delivery",
			status: "operational",
			uptime: 99.95,
			iconName: "Globe",
			history: generateHistory([12]),
		},
	],
	incidents: [
		{
			id: "inc-3",
			title: "Webhook delivery delays",
			status: "monitoring",
			severity: "minor",
			date: "2026-03-04",
			updates: [
				{
					time: "14:32 UTC",
					message:
						"We deployed a fix to the webhook queue processor. Delivery latency is back to normal. Monitoring for stability.",
				},
				{
					time: "13:10 UTC",
					message:
						"Identified a bottleneck in the webhook queue processor causing delayed event deliveries. Working on a fix.",
				},
			],
		},
		{
			id: "inc-2",
			title: "Elevated API latency",
			status: "resolved",
			severity: "major",
			date: "2026-02-18",
			updates: [
				{
					time: "09:45 UTC",
					message:
						"Issue fully resolved. Root cause was a misconfigured database connection pool after scaling event.",
				},
				{
					time: "08:20 UTC",
					message:
						"API response times have returned to normal. Continuing to monitor.",
				},
				{
					time: "07:15 UTC",
					message:
						"Investigating elevated p99 latency on GET endpoints. Some requests taking >2s.",
				},
			],
		},
		{
			id: "inc-1",
			title: "Scheduled maintenance — Database migration",
			status: "resolved",
			severity: "minor",
			date: "2026-02-10",
			updates: [
				{
					time: "06:00 UTC",
					message: "Maintenance complete. All services are operational.",
				},
				{
					time: "04:00 UTC",
					message:
						"Starting scheduled database maintenance. Expect brief read-only mode for ~30 minutes.",
				},
			],
		},
	],
}));
