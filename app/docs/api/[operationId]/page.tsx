import { getAllOperations, getOperationBySlug } from "@/lib/swagger";
import { getEndpointDoc } from "@/lib/api-docs";
import { EndpointCard } from "@/components/api-docs/EndpointCard";
import { MdxContent } from "@/components/api-docs/MdxContent";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export function generateStaticParams() {
	return getAllOperations().map((op) => ({
		operationId: op.operationId,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ operationId: string }>;
}): Promise<Metadata> {
	const { operationId } = await params;
	const operation = getOperationBySlug(operationId);
	if (!operation) return { title: "Not Found" };

	return {
		title: `${operation.method} ${operation.path} — API Reference`,
		description: operation.summary || operation.description,
	};
}

export default async function EndpointPage({
	params,
}: {
	params: Promise<{ operationId: string }>;
}) {
	const { operationId } = await params;
	const operation = getOperationBySlug(operationId);
	if (!operation) return notFound();

	// MDX manual doc
	const endpointDoc = getEndpointDoc(operation.method, operationId);

	// Navigation
	const allOps = getAllOperations();
	const currentIndex = allOps.findIndex((op) => op.operationId === operationId);
	const prevOp = currentIndex > 0 ? allOps[currentIndex - 1] : null;
	const nextOp =
		currentIndex < allOps.length - 1 ? allOps[currentIndex + 1] : null;

	return (
		<div className="space-y-10">
			{/* Breadcrumb */}
			<nav className="flex items-center gap-2 text-sm text-muted-foreground">
				<Link
					href="/docs/api"
					className="hover:text-foreground transition-colors"
				>
					API Reference
				</Link>
				<span>/</span>
				<Link
					href={`/docs/api/tags/${(operation.tags[0] || "").toLowerCase()}`}
					className="hover:text-foreground transition-colors capitalize"
				>
					{operation.tags[0] || "Endpoint"}
				</Link>
				<span>/</span>
				<span className="text-foreground font-medium font-mono">
					{operation.operationId}
				</span>
			</nav>

			<EndpointCard
				operation={operation}
				customDoc={
					endpointDoc ? <MdxContent source={endpointDoc.content} /> : undefined
				}
			/>

			{/* Prev/Next navigation */}
			<div className="border-t pt-6 flex items-stretch gap-4">
				{prevOp ? (
					<Link
						href={`/docs/api/${prevOp.operationId}`}
						className="flex-1 group flex items-center gap-3 rounded-lg border p-4 transition-all hover:border-primary/30 hover:bg-accent/50"
					>
						<ArrowLeft className="size-4 text-muted-foreground group-hover:text-foreground group-hover:-translate-x-0.5 transition-all shrink-0" />
						<div className="min-w-0">
							<p className="text-xs text-muted-foreground">Previous</p>
							<p className="text-sm font-medium font-mono truncate">
								{prevOp.summary || prevOp.path}
							</p>
						</div>
					</Link>
				) : (
					<div className="flex-1" />
				)}
				{nextOp ? (
					<Link
						href={`/docs/api/${nextOp.operationId}`}
						className="flex-1 group flex items-center justify-end gap-3 rounded-lg border p-4 transition-all hover:border-primary/30 hover:bg-accent/50 text-right"
					>
						<div className="min-w-0">
							<p className="text-xs text-muted-foreground">Next</p>
							<p className="text-sm font-medium font-mono truncate">
								{nextOp.summary || nextOp.path}
							</p>
						</div>
						<ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
					</Link>
				) : (
					<div className="flex-1" />
				)}
			</div>
		</div>
	);
}
