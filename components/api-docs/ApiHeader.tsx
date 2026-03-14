import { getSwaggerInfo } from "@/lib/swagger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ApiHeader() {
	const info = getSwaggerInfo();

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<div className="flex items-center justify-between flex-wrap gap-4">
					<div className="flex items-center gap-3 flex-wrap">
						<h1 className="text-3xl font-bold tracking-tight">{info.title}</h1>
						<Badge variant="secondary" className="font-mono text-xs">
							v{info.version}
						</Badge>
					</div>
					<Button variant="outline" size="sm" asChild>
						<a href="/api.aos3.yml" download>
							<Download className="mr-2 h-4 w-4" />
							OpenAPI spec
						</a>
					</Button>
				</div>
			</div>
		</div>
	);
}
