"use client";

import { useState, useEffect } from "react";
import type { SwaggerOperation } from "@/lib/swagger";
import { generateCodeExamples } from "@/lib/swagger";
import { useApiSettingsStore } from "@/stores/useApiSettingsStore";
import { CodeExample } from "./CodeExample";
import { codeToHtml } from "shiki";

const langMap = {
	curl: "bash",
	javascript: "javascript",
	python: "python",
} as const;

export function LiveCodeExamples({
	operation,
}: {
	operation: SwaggerOperation;
}) {
	const { baseUrl, authToken, hydrate } = useApiSettingsStore();
	const [highlighted, setHighlighted] = useState<{
		curl: string;
		javascript: string;
		python: string;
	} | null>(null);

	useEffect(() => {
		hydrate();
	}, [hydrate]);

	const examples = generateCodeExamples(operation, { baseUrl, authToken });

	// Highlight code with shiki whenever examples change
	useEffect(() => {
		let cancelled = false;

		async function highlight() {
			const [curl, javascript, python] = await Promise.all(
				(["curl", "javascript", "python"] as const).map((lang) =>
					codeToHtml(examples[lang], {
						lang: langMap[lang],
						theme: "dark-plus",
					}),
				),
			);
			if (!cancelled) {
				setHighlighted({ curl, javascript, python });
			}
		}

		highlight();
		return () => {
			cancelled = true;
		};
	}, [examples.curl, examples.javascript, examples.python]);

	const renderedExamples = highlighted
		? {
				curl: (
					<div
						className="[&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!border-0 [&_pre]:p-4 [&_pre]:pr-12 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:leading-relaxed"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output
						dangerouslySetInnerHTML={{ __html: highlighted.curl }}
					/>
				),
				javascript: (
					<div
						className="[&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!border-0 [&_pre]:p-4 [&_pre]:pr-12 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:leading-relaxed"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output
						dangerouslySetInnerHTML={{ __html: highlighted.javascript }}
					/>
				),
				python: (
					<div
						className="[&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!border-0 [&_pre]:p-4 [&_pre]:pr-12 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:leading-relaxed"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output
						dangerouslySetInnerHTML={{ __html: highlighted.python }}
					/>
				),
			}
		: undefined;

	return (
		<CodeExample examples={examples} renderedExamples={renderedExamples} />
	);
}
