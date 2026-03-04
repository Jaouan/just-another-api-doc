import { getTags, getOperationsByTag } from "@/lib/swagger";
import { getGroupDoc, getGroupTitle } from "@/lib/api-docs";
import { MdxContent } from "@/components/api-docs/MdxContent";
import { MethodBadge } from "@/components/api-docs/MethodBadge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
	return getTags().map((tag) => ({
		tag: tag.name.toLowerCase(),
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ tag: string }>;
}): Promise<Metadata> {
	const { tag } = await params;
	const title = getGroupTitle(tag, tag);
	return {
		title: `${title} — API Reference`,
		description: `API documentation for the ${title} endpoints.`,
	};
}

export default async function TagGroupPage({
	params,
}: {
	params: Promise<{ tag: string }>;
}) {
	const { tag } = await params;
	const tags = getTags();
	const tagInfo = tags.find((t) => t.name.toLowerCase() === tag.toLowerCase());
	if (!tagInfo) return notFound();

	const operationsByTag = getOperationsByTag();
	const ops = operationsByTag[tagInfo.name] || [];
	const groupDoc = getGroupDoc(tag);
	const displayTitle = groupDoc?.title || tagInfo.name;

	return (
		<div className="space-y-8">
			{/* Breadcrumb */}
			<nav className="flex items-center gap-2 text-sm text-muted-foreground">
				<Link
					href="/docs/api"
					className="hover:text-foreground transition-colors flex items-center gap-1"
				>
					<ArrowLeft className="size-3.5" />
					API Reference
				</Link>
				<span>/</span>
				<span className="text-foreground font-medium">{displayTitle}</span>
			</nav>

			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight capitalize">
					{displayTitle}
				</h1>
				{tagInfo.description && (
					<p className="text-lg text-muted-foreground">{tagInfo.description}</p>
				)}
			</div>

			{/* MDX content if available */}
			{groupDoc && <MdxContent source={groupDoc.content} />}

			{/* Endpoints list */}
			<div className="space-y-3">
				<h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
					Endpoints
				</h2>
				<div className="space-y-2">
					{ops.map((op) => (
						<Link
							key={op.operationId}
							href={`/docs/api/${op.operationId}`}
							className="flex items-center gap-3 rounded-lg border p-3 transition-all hover:border-primary/30 hover:bg-accent/50 group"
						>
							<MethodBadge method={op.method} />
							<code className="text-sm font-mono font-medium text-foreground/80 group-hover:text-foreground transition-colors">
								{op.path}
							</code>
							{op.summary && (
								<span className="text-sm text-muted-foreground ml-auto hidden sm:block truncate max-w-[200px]">
									{op.summary}
								</span>
							)}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
