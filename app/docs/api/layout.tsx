import { PrivateLayout } from "@/components/layout/PrivateLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "API Reference — Swagger Petstore",
	description:
		"Interactive API documentation for the Swagger Petstore API. Explore endpoints, view schemas, and try code examples.",
};

export default function ApiDocsLayout({
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
