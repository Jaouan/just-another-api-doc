import { PrivateLayout } from "@/components/layout/PrivateLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Roadmap",
	description:
		"Stay up to date with our latest releases and what's coming next.",
};

export default function RoadmapLayout({
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
