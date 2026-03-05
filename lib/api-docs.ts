import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const API_DOCS_DIR = path.join(process.cwd(), "api-docs");

export type EndpointDoc = {
	content: string;
	frontmatter: Record<string, unknown>;
};

export type GroupDoc = {
	content: string;
	/** Override group name in sidebar/pages */
	title?: string;
	frontmatter: Record<string, unknown>;
};

/**
 * Read an endpoint-specific MDX file: /api-docs/{METHOD}-{operationId}.mdx
 */
export function getEndpointDoc(
	method: string,
	operationId: string,
): EndpointDoc | null {
	const filename = `${method.toUpperCase()}-${operationId}.mdx`;
	const filepath = path.join(API_DOCS_DIR, filename);

	if (!fs.existsSync(filepath)) return null;

	const raw = fs.readFileSync(filepath, "utf-8");
	const { content, data } = matter(raw);

	return {
		content: content.trim(),
		frontmatter: data,
	};
}

/**
 * Read a group-level MDX file: /api-docs/{tag}.mdx
 */
export function getGroupDoc(tag: string): GroupDoc | null {
	const filename = `${tag.toLowerCase()}.mdx`;
	const filepath = path.join(API_DOCS_DIR, filename);

	if (!fs.existsSync(filepath)) return null;

	const raw = fs.readFileSync(filepath, "utf-8");
	const { content, data } = matter(raw);

	return {
		content: content.trim(),
		title: typeof data.title === "string" ? data.title : undefined,
		frontmatter: data,
	};
}

/**
 * Get all tags that have group docs
 */
export function getAvailableGroupDocs(): string[] {
	if (!fs.existsSync(API_DOCS_DIR)) return [];

	return fs
		.readdirSync(API_DOCS_DIR)
		.filter((f) => f.endsWith(".mdx") && !f.includes("-"))
		.map((f) => f.replace(".mdx", ""));
}

// ─── Config ──────────────────────────────────────────────────────────────────

const configPath = path.join(API_DOCS_DIR, "config.json");
const config: { groupTitles?: Record<string, string> } = fs.existsSync(
	configPath,
)
	? JSON.parse(fs.readFileSync(configPath, "utf-8"))
	: {};

/**
 * Get the display title for a tag group, using config.json groupTitles
 */
export function getGroupTitle(tag: string, fallback?: string): string {
	const configTitle =
		config.groupTitles?.[tag.toLowerCase()] ?? config.groupTitles?.[tag];
	return configTitle || fallback || tag;
}

/**
 * Read the overview MDX file: /api-docs/overview.mdx
 */
export function getOverviewDoc(): EndpointDoc | null {
	const filepath = path.join(API_DOCS_DIR, "overview.mdx");
	if (!fs.existsSync(filepath)) return null;

	const raw = fs.readFileSync(filepath, "utf-8");
	const { content, data } = matter(raw);

	return {
		content: content.trim(),
		frontmatter: data,
	};
}
