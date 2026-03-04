import { getSwaggerInfo } from "@/lib/swagger";
import { Badge } from "@/components/ui/badge";

export function ApiHeader() {
	const info = getSwaggerInfo();

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<div className="flex items-center gap-3 flex-wrap">
					<h1 className="text-3xl font-bold tracking-tight">{info.title}</h1>
					<Badge variant="secondary" className="font-mono text-xs">
						v{info.version}
					</Badge>
				</div>
			</div>
		</div>
	);
}
