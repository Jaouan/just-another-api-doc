import { getTags, getOperationsByTag } from "@/lib/swagger";
import { getGroupDoc, getGroupTitle, getGroupIcon } from "@/lib/api-docs";
import { MdxContent } from "@/components/api-docs/MdxContent";
import { MethodBadge } from "@/components/api-docs/MethodBadge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
	const displayTitle = getGroupTitle(tag, tagInfo.name);
	const IconComponent = getGroupIcon(tag);

	return (
		<div className="space-y-8">
			{/* Breadcrumb */}
			<nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mr-6">
				<Link
					href="/docs/api"
					className="hover:text-foreground transition-colors shrink-0"
				>
					API Reference
				</Link>
				<span className="shrink-0">/</span>
				<span className="text-foreground font-medium shrink-0 break-words">
					{displayTitle}
				</span>
			</nav>

			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight capitalize flex items-center gap-3">
					{IconComponent && <IconComponent className="size-8" />}
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
							className="group flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border bg-card p-3 transition-all hover:border-primary/30 hover:bg-accent/50 hover:shadow-sm"
						>
							<div className="flex items-center gap-3 min-w-0">
								<MethodBadge method={op.method} />
								<code className="font-mono text-sm font-medium flex-shrink-0 truncate sm:break-all sm:truncate-none group-hover:text-foreground transition-colors">
									{op.path}
								</code>
							</div>
							{op.summary && (
								<span className="text-sm text-muted-foreground truncate w-full flex-1">
									{op.summary}
								</span>
							)}
							<div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 mt-3 sm:mt-0 w-full sm:w-auto">
								<div className="flex-1 sm:hidden"></div>
								<ArrowRight className="size-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
