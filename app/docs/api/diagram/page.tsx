import { MermaidDiagram } from "@/components/api-docs/MermaidDiagram";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
	title: "Architecture Diagram — API Reference",
	description: "Visual architecture diagram of the API.",
};

const architectureDiagram = `graph TB
    Client["Client Application"]
    API["API Gateway<br/>petstore.swagger.io/v2"]

    subgraph Services
        PetService["Pet Service"]
        StoreService["Store Service"]
        UserService["User Service"]
    end

    subgraph Data
        PetDB[("Pet Database")]
        OrderDB[("Order Database")]
        UserDB[("User Database")]
        FileStore[("File Storage")]
    end

    Client -->|"HTTP/HTTPS"| API
    API --> PetService
    API --> StoreService
    API --> UserService

    PetService --> PetDB
    PetService --> FileStore
    StoreService --> OrderDB
    UserService --> UserDB
`;

export default function DiagramPage() {
	return (
		<div className="space-y-8">
			<nav className="flex items-center gap-2 text-sm text-muted-foreground">
				<Link
					href="/docs/api"
					className="hover:text-foreground transition-colors flex items-center gap-1"
				>
					<ArrowLeft className="size-3.5" />
					API Reference
				</Link>
				<span>/</span>
				<span className="text-foreground font-medium">Architecture</span>
			</nav>

			<div className="space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">
					Architecture Diagram
				</h1>
				<p className="text-muted-foreground">
					High-level overview of the API architecture and service dependencies.
				</p>
			</div>

			<div className="rounded-lg border bg-card p-6 overflow-x-auto">
				<MermaidDiagram
					chart={architectureDiagram}
					className="flex justify-center [&_svg]:max-w-full"
				/>
			</div>
		</div>
	);
}
