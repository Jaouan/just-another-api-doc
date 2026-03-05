"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy } from "lucide-react";

const _langMap = {
	curl: "bash",
	javascript: "javascript",
	python: "python",
} as const;

export function CodeExample({
	examples,
	renderedExamples,
}: {
	examples: { curl: string; javascript: string; python: string };
	renderedExamples?: {
		curl: React.ReactNode;
		javascript: React.ReactNode;
		python: React.ReactNode;
	};
}) {
	const [copied, setCopied] = useState<string | null>(null);
	const [selectedLang, setSelectedLang] = useState(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("dev-portal-code-lang") || "curl";
		}
		return "curl";
	});

	const copyToClipboard = (text: string, lang: string) => {
		navigator.clipboard.writeText(text);
		setCopied(lang);
		setTimeout(() => setCopied(null), 2000);
	};

	return (
		<Tabs
			value={selectedLang}
			onValueChange={(v) => {
				setSelectedLang(v);
				localStorage.setItem("dev-portal-code-lang", v);
			}}
			className="w-full"
		>
			<TabsList className="bg-muted/60 h-8">
				<TabsTrigger value="curl" className="text-xs px-3 h-6">
					cURL
				</TabsTrigger>
				<TabsTrigger value="javascript" className="text-xs px-3 h-6">
					JavaScript
				</TabsTrigger>
				<TabsTrigger value="python" className="text-xs px-3 h-6">
					Python
				</TabsTrigger>
			</TabsList>

			{(["curl", "javascript", "python"] as const).map((lang) => (
				<TabsContent key={lang} value={lang} className="mt-2">
					<div className="relative rounded-lg bg-black dark:bg-black border border overflow-hidden">
						<button
							type="button"
							onClick={() => copyToClipboard(examples[lang], lang)}
							className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-[#c9d1d9] transition-colors z-10"
							aria-label="Copy code"
						>
							{copied === lang ? (
								<Check className="size-3.5 text-emerald-400" />
							) : (
								<Copy className="size-3.5" />
							)}
						</button>
						{renderedExamples?.[lang] ? (
							<div className="[&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!border-0">
								{renderedExamples[lang]}
							</div>
						) : (
							<pre className="p-4 pr-12 overflow-x-auto text-sm font-mono text-[#c9d1d9] leading-relaxed">
								<code>{examples[lang]}</code>
							</pre>
						)}
					</div>
				</TabsContent>
			))}
		</Tabs>
	);
}
