import { cn } from "@/lib/utils";

const methodColors: Record<string, string> = {
	GET: "text-emerald-700 dark:text-emerald-400",
	POST: "text-blue-700 dark:text-blue-400",
	PUT: "text-amber-700 dark:text-amber-400",
	DELETE: "text-red-700 dark:text-red-400",
	PATCH: "text-purple-700 dark:text-purple-400",
};

export function MethodBadge({
	method,
	className,
}: {
	method: string;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"font-mono font-bold text-[11px] tracking-wider uppercase",
				methodColors[method] || "text-foreground",
				className,
			)}
		>
			{method}
		</span>
	);
}
