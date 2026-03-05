"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import mermaid from "mermaid";

const darkThemeVars = {
	darkMode: true,
	background: "transparent",
	primaryColor: "#3b82f6",
	primaryTextColor: "#e2e8f0",
	primaryBorderColor: "#475569",
	lineColor: "#64748b",
	secondaryColor: "#1e293b",
	tertiaryColor: "#0f172a",
	fontFamily: "Inter, sans-serif",
};

const lightThemeVars = {
	darkMode: false,
	background: "transparent",
	primaryColor: "#3b82f6",
	primaryTextColor: "#1e293b",
	primaryBorderColor: "#cbd5e1",
	lineColor: "#b5b5b5ff",
	secondaryColor: "#f1f5f9",
	tertiaryColor: "#e2e8f0",
	fontFamily: "Inter, sans-serif",
};

export function MermaidDiagram({
	chart,
	className,
}: {
	chart: string;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	useEffect(() => {
		if (!ref.current || !mounted) return;

		const isDark = resolvedTheme === "dark";

		mermaid.initialize({
			startOnLoad: false,
			theme: isDark ? "dark" : "neutral",
			securityLevel: "loose",
			themeVariables: isDark ? darkThemeVars : lightThemeVars,
		});

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
	}, [chart, resolvedTheme, mounted]);

	return <div ref={ref} className={className} />;
}
