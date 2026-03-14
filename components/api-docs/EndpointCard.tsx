import type { SwaggerOperation } from "@/lib/swagger";
import { resolveSchema } from "@/lib/swagger";
import { MethodBadge } from "./MethodBadge";
import { ParameterTable } from "./ParameterTable";
import { ResponseSection } from "./ResponseSection";
import { LiveCodeExamples } from "./LiveCodeExamples";
import { SchemaViewer } from "./SchemaViewer";
import { TryItOut } from "./TryItOut";

import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export function EndpointCard({
	operation,
	customDoc,
}: {
	operation: SwaggerOperation;
	customDoc?: React.ReactNode;
}) {
	const nonBodyParams = operation.parameters.filter((p) => p.in !== "body");
	const bodyParam = operation.parameters.find((p) => p.in === "body");
	const bodySchema = bodyParam?.schema ? resolveSchema(bodyParam.schema) : null;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
			<div className="space-y-8">
				{/* Header */}
				<div className="space-y-3">
					<div className="flex items-center gap-3 flex-wrap">
						<MethodBadge method={operation.method} />
						<code className="text-lg font-mono font-semibold break-all">
							{operation.path}
						</code>
						{operation.deprecated && (
							<Badge
								variant="outline"
								className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25 gap-1"
							>
								<AlertTriangle className="size-3" />
								Deprecated
							</Badge>
						)}
					</div>
					{operation.summary && (
						<h2 className="text-xl font-semibold">{operation.summary}</h2>
					)}
					{!customDoc && operation.description && (
						<p className="text-muted-foreground leading-relaxed">
							{operation.description}
						</p>
					)}
				</div>

				{/* Custom documentation from MDX */}
				{customDoc}

				{/* Security */}
				{/*operation.security && operation.security.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Authorization
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {operation.security.map((sec) =>
                            Object.entries(sec).map(([key, scopes]) => (
                                <div
                                    key={key}
                                    className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2"
                                >
                                    <span className="font-mono text-sm font-medium">
                                        {key}
                                    </span>
                                    {scopes.length > 0 && (
                                        <div className="flex gap-1">
                                            {scopes.map((s) => (
                                                <Badge
                                                    key={s}
                                                    variant="secondary"
                                                    className="text-[10px]"
                                                >
                                                    {s}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )),
                        )}
                    </div>
                </div>
            )*/}

				{/* Parameters */}
				{nonBodyParams.length > 0 && (
					<div className="space-y-3">
						<h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
							Parameters
						</h3>
						<ParameterTable parameters={nonBodyParams} />
					</div>
				)}

				{/* Request Body */}
				{bodyParam && bodySchema && (
					<div className="space-y-3">
						<h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
							Request Body
						</h3>
						{bodyParam.description && (
							<p className="text-sm text-muted-foreground">
								{bodyParam.description}
							</p>
						)}
						<div className="rounded-lg border bg-card p-4">
							<SchemaViewer schema={bodySchema} />
						</div>
					</div>
				)}

				{/* Responses */}
				<div className="space-y-3">
					<h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
						Responses
					</h3>
					<ResponseSection responses={operation.responses} />
				</div>
			</div>

			<div className="space-y-8 lg:sticky lg:top-20 h-fit">
				{/* Code Examples */}
				<div className="space-y-3">
					<h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
						Code Examples
					</h3>
					<LiveCodeExamples operation={operation} />
				</div>

				{/* Try it out */}
				<TryItOut operation={operation} />
			</div>
		</div>
	);
}
