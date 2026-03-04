import { Badge } from "@/components/ui/badge";
import type { SwaggerResponse } from "@/lib/swagger";
import { resolveSchema, getDefinitionName } from "@/lib/swagger";
import { SchemaViewer } from "./SchemaViewer";

const statusColors: Record<string, string> = {
	"2": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
	"3": "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/25",
	"4": "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25",
	"5": "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/25",
};

function getStatusColor(code: string): string {
	if (code === "default") return statusColors["2"];
	return statusColors[code[0]] || "";
}

export function ResponseSection({
	responses,
}: {
	responses: Record<string, SwaggerResponse>;
}) {
	return (
		<div className="space-y-3">
			{Object.entries(responses).map(([code, response]) => {
				const schema = response.schema ? resolveSchema(response.schema) : null;
				const refName = response.schema?.$ref
					? getDefinitionName(response.schema.$ref)
					: null;

				return (
					<div key={code} className="rounded-lg border bg-card p-4 space-y-3">
						<div className="flex items-center gap-3">
							<Badge
								variant="outline"
								className={`font-mono text-xs font-bold ${getStatusColor(code)}`}
							>
								{code}
							</Badge>
							<span className="text-sm text-muted-foreground">
								{response.description}
							</span>
						</div>
						{schema && (
							<div className="pl-2 border-l-2 border-muted">
								{refName && (
									<p className="text-xs text-muted-foreground mb-2 font-mono">
										Schema: {refName}
									</p>
								)}
								<SchemaViewer schema={schema} />
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
