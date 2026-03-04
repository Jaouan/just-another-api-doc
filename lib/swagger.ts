import swaggerSpec from "@/api-docs/swagger.json";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SwaggerParameter {
	name: string;
	in: "path" | "query" | "body" | "header" | "formData";
	description?: string;
	required?: boolean;
	type?: string;
	format?: string;
	schema?: SwaggerSchema;
	enum?: string[];
	items?: SwaggerSchema;
	minimum?: number;
	maximum?: number;
	default?: unknown;
	collectionFormat?: string;
}

export interface SwaggerSchema {
	type?: string;
	format?: string;
	description?: string;
	properties?: Record<string, SwaggerSchema>;
	required?: string[];
	items?: SwaggerSchema;
	$ref?: string;
	enum?: string[];
	example?: unknown;
	additionalProperties?: SwaggerSchema | boolean;
	xml?: { name?: string; wrapped?: boolean };
}

export interface SwaggerResponse {
	description: string;
	schema?: SwaggerSchema;
	headers?: Record<
		string,
		{ type: string; format?: string; description?: string }
	>;
}

export interface SwaggerOperation {
	operationId: string;
	method: string;
	path: string;
	summary: string;
	description: string;
	tags: string[];
	parameters: SwaggerParameter[];
	responses: Record<string, SwaggerResponse>;
	security?: Record<string, string[]>[];
	consumes?: string[];
	produces?: string[];
	deprecated?: boolean;
}

export interface SwaggerTag {
	name: string;
	description: string;
	externalDocs?: { description: string; url: string };
}

export interface SwaggerInfo {
	title: string;
	version: string;
	description: string;
	contact?: { email: string };
	license?: { name: string; url: string };
}

// ─── Spec access ─────────────────────────────────────────────────────────────

const spec = swaggerSpec as Record<string, unknown>;

export function getSwaggerInfo(): SwaggerInfo {
	const info = spec.info as Record<string, unknown>;
	return {
		title: (info.title as string) || "",
		version: (info.version as string) || "",
		description: (info.description as string) || "",
		contact: info.contact as SwaggerInfo["contact"],
		license: info.license as SwaggerInfo["license"],
	};
}

export function getBasePath(): string {
	return (spec.basePath as string) || "";
}

export function getHost(): string {
	return (spec.host as string) || "";
}

export function getSchemes(): string[] {
	return (spec.schemes as string[]) || ["https"];
}

export function getTags(): SwaggerTag[] {
	return (spec.tags as SwaggerTag[]) || [];
}

// ─── $ref resolution ─────────────────────────────────────────────────────────

export function resolveRef(ref: string): SwaggerSchema {
	// "#/definitions/Pet" → definitions.Pet
	const parts = ref.replace("#/", "").split("/");
	let current: unknown = spec;
	for (const part of parts) {
		current = (current as Record<string, unknown>)[part];
	}
	return current as SwaggerSchema;
}

export function resolveSchema(schema: SwaggerSchema): SwaggerSchema {
	if (schema.$ref) {
		return resolveRef(schema.$ref);
	}
	return schema;
}

export function getDefinitionName(ref: string): string {
	return ref.split("/").pop() || "";
}

// ─── Operations ──────────────────────────────────────────────────────────────

export function getAllOperations(): SwaggerOperation[] {
	const paths = spec.paths as Record<
		string,
		Record<string, Record<string, unknown>>
	>;
	const operations: SwaggerOperation[] = [];

	for (const [path, methods] of Object.entries(paths)) {
		for (const [method, op] of Object.entries(methods)) {
			if (["get", "post", "put", "delete", "patch"].includes(method)) {
				operations.push({
					operationId: (op.operationId as string) || `${method}_${path}`,
					method: method.toUpperCase(),
					path,
					summary: (op.summary as string) || "",
					description: (op.description as string) || "",
					tags: (op.tags as string[]) || [],
					parameters: (op.parameters as SwaggerParameter[]) || [],
					responses: (op.responses as Record<string, SwaggerResponse>) || {},
					security: op.security as Record<string, string[]>[],
					consumes: op.consumes as string[],
					produces: op.produces as string[],
					deprecated: (op.deprecated as boolean) || false,
				});
			}
		}
	}

	return operations;
}

export function getOperationBySlug(slug: string): SwaggerOperation | undefined {
	return getAllOperations().find((op) => op.operationId === slug);
}

export function getOperationsByTag(): Record<string, SwaggerOperation[]> {
	const ops = getAllOperations();
	const grouped: Record<string, SwaggerOperation[]> = {};
	for (const op of ops) {
		for (const tag of op.tags) {
			if (!grouped[tag]) grouped[tag] = [];
			grouped[tag].push(op);
		}
	}
	return grouped;
}

// ─── Code examples ───────────────────────────────────────────────────────────

export function generateCodeExamples(op: SwaggerOperation): {
	curl: string;
	javascript: string;
	python: string;
} {
	const baseUrl = `${getSchemes()[0]}://${getHost()}${getBasePath()}`;
	const fullPath = `${baseUrl}${op.path}`;

	// Build query params
	const queryParams = op.parameters
		.filter((p) => p.in === "query")
		.map((p) => `${p.name}={${p.name}}`)
		.join("&");
	const urlWithQuery = queryParams ? `${fullPath}?${queryParams}` : fullPath;

	// Body param
	const bodyParam = op.parameters.find((p) => p.in === "body");
	const bodySchema = bodyParam?.schema ? resolveSchema(bodyParam.schema) : null;
	const bodyJson = bodySchema
		? JSON.stringify(buildExampleFromSchema(bodySchema), null, 2)
		: null;

	// Headers
	const headerParams = op.parameters.filter((p) => p.in === "header");

	// ─ curl ─
	let curl = `curl -X ${op.method} "${urlWithQuery}"`;
	if (bodyJson) {
		curl += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${bodyJson}'`;
	}
	for (const h of headerParams) {
		curl += ` \\\n  -H "${h.name}: {${h.name}}"`;
	}

	// ─ JavaScript ─
	const fetchOptions: string[] = [`  method: "${op.method}"`];
	if (bodyJson) {
		fetchOptions.push('  headers: { "Content-Type": "application/json" }');
		fetchOptions.push(`  body: JSON.stringify(${bodyJson})`);
	}
	const javascript = `const response = await fetch("${urlWithQuery}", {\n${fetchOptions.join(",\n")}\n});\nconst data = await response.json();`;

	// ─ Python ─
	let python = `import requests\n\n`;
	if (bodyJson) {
		python += `payload = ${bodyJson}\n\n`;
		python += `response = requests.${op.method.toLowerCase()}(\n  "${urlWithQuery}",\n  json=payload\n)`;
	} else {
		python += `response = requests.${op.method.toLowerCase()}("${urlWithQuery}")`;
	}
	python += `\ndata = response.json()`;

	return { curl, javascript, python };
}

function buildExampleFromSchema(schema: SwaggerSchema): unknown {
	const resolved = schema.$ref ? resolveRef(schema.$ref) : schema;

	if (resolved.example !== undefined) return resolved.example;

	if (resolved.type === "object" || resolved.properties) {
		const obj: Record<string, unknown> = {};
		for (const [key, prop] of Object.entries(resolved.properties || {})) {
			obj[key] = buildExampleFromSchema(prop);
		}
		return obj;
	}

	if (resolved.type === "array" && resolved.items) {
		return [buildExampleFromSchema(resolved.items)];
	}

	if (resolved.enum) return resolved.enum[0];

	switch (resolved.type) {
		case "string":
			return resolved.format === "date-time"
				? "2024-01-01T00:00:00Z"
				: "string";
		case "integer":
		case "number":
			return 0;
		case "boolean":
			return true;
		default:
			return null;
	}
}
