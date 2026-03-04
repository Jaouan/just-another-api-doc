import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { SwaggerParameter } from "@/lib/swagger";

const locationColors: Record<string, string> = {
	path: "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/25",
	query: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/25",
	header:
		"bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/25",
	body: "bg-pink-500/15 text-pink-700 dark:text-pink-400 border-pink-500/25",
	formData:
		"bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/25",
};

export function ParameterTable({
	parameters,
}: {
	parameters: SwaggerParameter[];
}) {
	if (!parameters.length) return null;

	return (
		<div className="rounded-lg border overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow className="bg-muted/50 hover:bg-muted/50">
						<TableHead className="font-semibold text-xs uppercase tracking-wider">
							Name
						</TableHead>
						<TableHead className="font-semibold text-xs uppercase tracking-wider">
							Location
						</TableHead>
						<TableHead className="font-semibold text-xs uppercase tracking-wider">
							Type
						</TableHead>
						<TableHead className="font-semibold text-xs uppercase tracking-wider">
							Required
						</TableHead>
						<TableHead className="font-semibold text-xs uppercase tracking-wider">
							Description
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{parameters.map((param) => (
						<TableRow key={`${param.in}-${param.name}`}>
							<TableCell className="font-mono text-sm font-medium">
								{param.name}
							</TableCell>
							<TableCell>
								<Badge
									variant="outline"
									className={`text-[10px] ${locationColors[param.in] || ""}`}
								>
									{param.in}
								</Badge>
							</TableCell>
							<TableCell className="font-mono text-sm text-muted-foreground">
								{param.type ||
									(param.schema?.$ref
										? param.schema.$ref.split("/").pop()
										: "object")}
								{param.format ? (
									<span className="text-xs text-muted-foreground/60 ml-1">
										({param.format})
									</span>
								) : null}
							</TableCell>
							<TableCell>
								{param.required ? (
									<span className="text-red-500 dark:text-red-400 font-medium text-xs">
										required
									</span>
								) : (
									<span className="text-muted-foreground/50 text-xs">
										optional
									</span>
								)}
							</TableCell>
							<TableCell className="text-sm text-muted-foreground max-w-xs">
								{param.description || "—"}
								{param.enum ? (
									<div className="mt-1 flex flex-wrap gap-1">
										{param.enum.map((v) => (
											<Badge
												key={v}
												variant="secondary"
												className="text-[10px]"
											>
												{v}
											</Badge>
										))}
									</div>
								) : null}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
