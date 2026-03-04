import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const methodColors: Record<string, string> = {
	GET: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
	POST: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/25",
	PUT: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25",
	DELETE: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/25",
	PATCH:
		"bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/25",
};

export function MethodBadge({
	method,
	className,
}: {
	method: string;
	className?: string;
}) {
	return (
		<Badge
			variant="outline"
			className={cn(
				"font-mono font-bold text-[11px] tracking-wider uppercase px-2.5 py-0.5",
				methodColors[method] || "",
				className,
			)}
		>
			{method}
		</Badge>
	);
}
