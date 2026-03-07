import { PrivateLayout } from "@/components/layout/PrivateLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Service Status — Just Another API Doc",
	description:
		"Real-time operational status of the Petstore API services, uptime history, and incident reports.",
};

export default function StatusLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<PrivateLayout>
			<div className="max-w-4xl mx-auto w-full py-4">{children}</div>
		</PrivateLayout>
	);
}
