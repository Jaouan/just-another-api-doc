import { getAllOperations, getOperationBySlug } from "@/lib/swagger";
import { getEndpointDoc, getGroupTitle } from "@/lib/api-docs";
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
	const tagId = operation.tags[0] || "";
	const tagLabel = getGroupTitle(tagId, tagId);

	// Navigation
	const allOps = getAllOperations();
	const currentIndex = allOps.findIndex((op) => op.operationId === operationId);
	const prevOp = currentIndex > 0 ? allOps[currentIndex - 1] : null;
	const nextOp =
		currentIndex < allOps.length - 1 ? allOps[currentIndex + 1] : null;

	return (
		<div className="space-y-10">
			{/* Breadcrumb */}
			<nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mr-6">
				<Link
					href="/docs/api"
					className="hover:text-foreground transition-colors shrink-0"
				>
					API Reference
				</Link>
				<span className="shrink-0">/</span>
				<Link
					href={`/docs/api/tags/${tagId.toLowerCase()}`}
					className="hover:text-foreground transition-colors shrink-0"
				>
					{tagLabel}
				</Link>
				<span className="shrink-0">/</span>
				<span className="text-foreground font-medium font-mono break-all">
					{operation.method} {operation.path}
				</span>
			</nav>

			<EndpointCard
				operation={operation}
				customDoc={
					endpointDoc ? <MdxContent source={endpointDoc.content} /> : undefined
				}
			/>

			{/* Prev/Next navigation */}
			<div className="border-t pt-6 flex flex-col sm:flex-row items-stretch gap-4">
				{prevOp ? (
					<Link
						href={`/docs/api/${prevOp.operationId}`}
						className="flex-1 group flex items-center gap-3 rounded-lg border p-4 transition-all hover:border-primary/30 hover:bg-accent/50 w-full sm:w-auto"
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
					<div className="hidden sm:block flex-1" />
				)}
				{nextOp ? (
					<Link
						href={`/docs/api/${nextOp.operationId}`}
						className="flex-1 group flex items-center justify-end gap-3 rounded-lg border p-4 transition-all hover:border-primary/30 hover:bg-accent/50 text-right w-full sm:w-auto"
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
					<div className="hidden sm:block flex-1" />
				)}
			</div>
		</div>
	);
}
