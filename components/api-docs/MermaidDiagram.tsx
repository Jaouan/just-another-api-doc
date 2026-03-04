"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
	startOnLoad: false,
	theme: "dark",
	securityLevel: "loose",
	themeVariables: {
		darkMode: true,
		background: "transparent",
		primaryColor: "#3b82f6",
		primaryTextColor: "#e2e8f0",
		primaryBorderColor: "#475569",
		lineColor: "#64748b",
		secondaryColor: "#1e293b",
		tertiaryColor: "#0f172a",
		fontFamily: "Inter, sans-serif",
	},
});

export function MermaidDiagram({
	chart,
	className,
}: {
	chart: string;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!ref.current) return;
		const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
		ref.current.innerHTML = "";

		mermaid
			.render(id, chart)
			.then(({ svg }) => {
				if (ref.current) {
					ref.current.innerHTML = svg;
				}
			})
			.catch(console.error);
	}, [chart]);

	return <div ref={ref} className={className} />;
}
