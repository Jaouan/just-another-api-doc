"use client";

import { cn } from "@/lib/utils";
import type { SwaggerSchema } from "@/lib/swagger";
import { resolveRef, getDefinitionName } from "@/lib/swagger";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

function SchemaProperty({
	name,
	schema,
	required,
	depth = 0,
}: {
	name: string;
	schema: SwaggerSchema;
	required?: boolean;
	depth?: number;
}) {
	const [isOpen, setIsOpen] = useState(depth < 2);
	const resolved = schema.$ref ? resolveRef(schema.$ref) : schema;
	const refName = schema.$ref ? getDefinitionName(schema.$ref) : null;
	const hasChildren =
		resolved.properties || (resolved.type === "array" && resolved.items);

	const typeDisplay = refName
		? refName
		: resolved.type === "array"
			? `array<${resolved.items?.$ref ? getDefinitionName(resolved.items.$ref) : resolved.items?.type || "any"}>`
			: resolved.type || "any";

	return (
		<div
			className={cn(
				"group",
				depth > 0 && "ml-4 border-l border-border/50 pl-3",
			)}
		>
			<button
				type="button"
				onClick={() => hasChildren && setIsOpen(!isOpen)}
				className={cn(
					"flex items-center gap-2 py-1.5 w-full text-left",
					hasChildren &&
						"cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded-md transition-colors",
				)}
			>
				{hasChildren ? (
					<ChevronRight
						className={cn(
							"size-3.5 text-muted-foreground shrink-0 transition-transform",
							isOpen && "rotate-90",
						)}
					/>
				) : (
					<span className="w-3.5 shrink-0" />
				)}
				<span className="font-mono text-sm font-medium">{name}</span>
				<span className="font-mono text-xs text-muted-foreground/70">
					{typeDisplay}
				</span>
				{required && (
					<span className="text-[10px] text-red-500 dark:text-red-400 font-medium">
						required
					</span>
				)}
				{resolved.enum && (
					<span className="text-[10px] text-muted-foreground">enum</span>
				)}
			</button>

			{resolved.description && (
				<p className="text-xs text-muted-foreground ml-[22px] -mt-0.5 mb-1">
					{resolved.description}
				</p>
			)}

			{resolved.enum && isOpen && (
				<div className="ml-[22px] mb-1 flex flex-wrap gap-1">
					{resolved.enum.map((v) => (
						<span
							key={v}
							className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded"
						>
							{v}
						</span>
					))}
				</div>
			)}

			{isOpen && hasChildren && (
				<div className="mt-0.5">
					{resolved.properties &&
						Object.entries(resolved.properties).map(([key, prop]) => (
							<SchemaProperty
								key={key}
								name={key}
								schema={prop}
								required={resolved.required?.includes(key)}
								depth={depth + 1}
							/>
						))}
					{resolved.type === "array" && resolved.items && (
						<SchemaProperty
							name="items"
							schema={resolved.items}
							depth={depth + 1}
						/>
					)}
				</div>
			)}
		</div>
	);
}

export function SchemaViewer({ schema }: { schema: SwaggerSchema }) {
	const resolved = schema.$ref ? resolveRef(schema.$ref) : schema;

	if (!resolved.properties && resolved.type !== "array") {
		return (
			<span className="font-mono text-sm text-muted-foreground">
				{resolved.type || "any"}
				{resolved.format && (
					<span className="text-xs ml-1">({resolved.format})</span>
				)}
			</span>
		);
	}

	return (
		<div className="space-y-0.5">
			{resolved.properties &&
				Object.entries(resolved.properties).map(([key, prop]) => (
					<SchemaProperty
						key={key}
						name={key}
						schema={prop}
						required={resolved.required?.includes(key)}
					/>
				))}
			{resolved.type === "array" && resolved.items && (
				<SchemaProperty name="items" schema={resolved.items} />
			)}
		</div>
	);
}
