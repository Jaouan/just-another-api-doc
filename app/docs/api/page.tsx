import { ApiHeader } from "@/components/api-docs/ApiHeader";
import { MethodBadge } from "@/components/api-docs/MethodBadge";
import { getTags, getOperationsByTag } from "@/lib/swagger";
import { getOverviewDoc } from "@/lib/api-docs";
import { MdxContent } from "@/components/api-docs/MdxContent";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ApiOverviewPage() {
	const tags = getTags();
	const operationsByTag = getOperationsByTag();
	const overviewDoc = getOverviewDoc();

	return (
		<div className="space-y-10">
			<ApiHeader />

			{/* Custom overview documentation */}
			{overviewDoc && <MdxContent source={overviewDoc.content} />}

			{/* Separator */}
			<div className="border-t" />

			{/* Endpoints by tag */}
			{tags.map((tag) => {
				const ops = operationsByTag[tag.name] || [];
				return (
					<section key={tag.name} className="space-y-4">
						<div className="space-y-1">
							<h2 className="text-xl font-semibold capitalize">{tag.name}</h2>
							{tag.description && (
								<p className="text-sm text-muted-foreground">
									{tag.description}
								</p>
							)}
						</div>

						<div className="grid gap-2">
							{ops.map((op) => (
								<Link
									key={op.operationId}
									href={`/docs/api/${op.operationId}`}
									className="group flex items-center gap-3 rounded-lg border bg-card p-4 transition-all hover:border-primary/30 hover:bg-accent/50 hover:shadow-sm"
								>
									<MethodBadge method={op.method} />
									<code className="font-mono text-sm font-medium flex-shrink-0">
										{op.path}
									</code>
									<span className="text-sm text-muted-foreground truncate flex-1">
										{op.summary}
									</span>
									{op.deprecated && (
										<Badge
											variant="outline"
											className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25 gap-1 text-[10px] shrink-0"
										>
											<AlertTriangle className="size-2.5" />
											Deprecated
										</Badge>
									)}
									<ArrowRight className="size-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
								</Link>
							))}
						</div>
					</section>
				);
			})}
		</div>
	);
}
