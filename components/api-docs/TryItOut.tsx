"use client";

import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { SwaggerOperation } from "@/lib/swagger";
import { getHost, getBasePath, getSchemes, resolveSchema } from "@/lib/swagger";
import {
	Play,
	Loader2,
	CheckCircle2,
	XCircle,
	ChevronDown,
	Copy,
	Check,
} from "lucide-react";

type ParamValues = Record<string, string>;

export function TryItOut({ operation }: { operation: SwaggerOperation }) {
	const [paramValues, setParamValues] = useState<ParamValues>(() => {
		const defaults: ParamValues = {};
		for (const p of operation.parameters) {
			if (p.in !== "body") {
				defaults[`${p.in}:${p.name}`] = p.default?.toString() || "";
			}
		}
		return defaults;
	});

	const bodyParam = operation.parameters.find((p) => p.in === "body");
	const bodySchema = bodyParam?.schema ? resolveSchema(bodyParam.schema) : null;

	const [bodyValue, setBodyValue] = useState(() => {
		if (!bodySchema) return "";
		return "{}";
	});

	const [isLoading, setIsLoading] = useState(false);
	const [response, setResponse] = useState<{
		status: number;
		statusText: string;
		headers: Record<string, string>;
		body: string;
		duration: number;
	} | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [copied, setCopied] = useState(false);
	const [authToken, setAuthToken] = useState("");

	const defaultBaseUrl = `${getSchemes()[0] || "http"}://${getHost()}${getBasePath()}`;
	const [customBaseUrl, setCustomBaseUrl] = useState(defaultBaseUrl);

	useEffect(() => {
		const savedToken = localStorage.getItem("dev-portal-auth-token");
		if (savedToken) {
			setAuthToken(savedToken);
		}

		const savedBaseUrl = localStorage.getItem("dev-portal-base-url");
		if (savedBaseUrl) {
			setCustomBaseUrl(savedBaseUrl);
		}
	}, []);

	const setParam = useCallback((key: string, value: string) => {
		setParamValues((prev) => ({ ...prev, [key]: value }));
	}, []);

	const buildPathAndQuery = useCallback(() => {
		let path = operation.path;

		// Replace path params
		for (const p of operation.parameters.filter((p) => p.in === "path")) {
			const val = paramValues[`path:${p.name}`] || `{${p.name}}`;
			path = path.replace(`{${p.name}}`, encodeURIComponent(val));
		}

		// Add query params
		const queryParams = operation.parameters
			.filter((p) => p.in === "query" && paramValues[`query:${p.name}`])
			.map(
				(p) =>
					`${encodeURIComponent(p.name)}=${encodeURIComponent(paramValues[`query:${p.name}`])}`,
			)
			.join("&");

		return queryParams ? `${path}?${queryParams}` : path;
	}, [operation, paramValues]);

	const buildUrl = useCallback(() => {
		const baseUrl = customBaseUrl.replace(/\/$/, "");
		return `${baseUrl}${buildPathAndQuery()}`;
	}, [customBaseUrl, buildPathAndQuery]);

	const safeDecodeURI = (uri: string) => {
		try {
			return decodeURI(uri);
		} catch (_e) {
			return uri;
		}
	};

	const sendRequest = async () => {
		setIsLoading(true);
		setResponse(null);
		setError(null);

		const url = buildUrl();
		const headers: Record<string, string> = {};

		// Add Authorization header
		if (authToken.trim()) {
			headers.Authorization = `Bearer ${authToken.trim()}`;
		}

		// Add header params
		for (const p of operation.parameters.filter((p) => p.in === "header")) {
			const val = paramValues[`header:${p.name}`];
			if (val) headers[p.name] = val;
		}

		if (bodyParam && bodyValue) {
			headers["Content-Type"] = "application/json";
		}

		const start = performance.now();

		try {
			const res = await fetch(url, {
				method: operation.method,
				headers,
				body:
					bodyParam && bodyValue && operation.method !== "GET"
						? bodyValue
						: undefined,
			});

			const duration = Math.round(performance.now() - start);
			const responseHeaders: Record<string, string> = {};
			res.headers.forEach((value, key) => {
				responseHeaders[key] = value;
			});

			let body: string;
			const contentType = res.headers.get("content-type") || "";
			if (contentType.includes("json")) {
				const json = await res.json();
				body = JSON.stringify(json, null, 2);
			} else {
				body = await res.text();
			}

			setResponse({
				status: res.status,
				statusText: res.statusText,
				headers: responseHeaders,
				body,
				duration,
			});
		} catch (err) {
			setError(
				err instanceof Error
					? `Request failed: ${err.message}`
					: "Request failed",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const copyResponse = () => {
		if (response?.body) {
			navigator.clipboard.writeText(response.body);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const nonBodyParams = operation.parameters.filter((p) => p.in !== "body");
	const statusCategory = response
		? response.status < 300
			? "success"
			: response.status < 400
				? "redirect"
				: "error"
		: null;

	return (
		<div className="rounded-xl border-2 border-dashed border-primary/20 overflow-hidden transition-all">
			{/* Header toggle */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between p-4 hover:bg-primary/[0.03] transition-colors cursor-pointer"
			>
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center size-8 rounded-lg bg-primary/10">
						<Play className="size-4 text-primary" />
					</div>
					<div className="text-left">
						<h3 className="font-semibold text-sm">Try it out</h3>
						<p className="text-xs text-muted-foreground">
							Send a live request to the API
						</p>
					</div>
				</div>
				<ChevronDown
					className={`size-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{isOpen && (
				<div className="px-4 pb-4 space-y-4 gap-4 flex flex-col border-t border-primary/10">
					{/* Endpoint */}
					<div className="space-y-3 mt-6">
						<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Endpoint
						</h4>
						<div className="flex items-center font-mono text-sm rounded-md border border-input overflow-hidden">
							<div className="flex items-center px-3 bg-muted/30 border-r h-9 shrink-0 font-bold">
								{operation.method}
							</div>
							<input
								type="text"
								value={customBaseUrl}
								onChange={(e) => {
									setCustomBaseUrl(e.target.value);
									localStorage.setItem("dev-portal-base-url", e.target.value);
								}}
								className="h-9 bg-transparent px-2 sm:px-3 outline-none text-muted-foreground w-[120px] xs:w-[150px] sm:w-[260px] shrink-0 border-r focus:bg-muted/10 transition-all hover:bg-muted/20 focus:bg-muted/20"
								placeholder="https://api.example.com"
								spellCheck={false}
								aria-label="Base URL"
							/>
							<div className="flex-1 px-3 py-2 overflow-x-auto whitespace-nowrap font-medium h-9 flex items-center bg-muted/30 text-foreground leading-none">
								{safeDecodeURI(buildPathAndQuery())}
							</div>
						</div>
					</div>

					{/* Authorization */}
					<div className="space-y-3">
						<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Authorization
						</h4>
						<div className="flex flex-col sm:flex-row sm:items-start sm:pt-1 gap-2 sm:gap-4 group">
							<div className="flex items-center gap-2 sm:w-[200px] shrink-0">
								<Badge
									variant="outline"
									className="text-[9px] font-mono px-1.5 py-0 h-4 shrink-0"
								>
									header
								</Badge>
								<label
									className="text-sm font-mono font-medium break-all mt-0.5"
									htmlFor="Authorization"
								>
									Authorization
								</label>
							</div>
							<div className="flex-1 flex items-center h-9 w-full min-w-0 rounded-md border border-input bg-transparent dark:bg-input/30 shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 overflow-hidden">
								<span className="pl-3 text-sm text-muted-foreground select-none shrink-0 pr-2 pb-[1px]">
									Bearer
								</span>
								<input
									type="text"
									value={authToken}
									onChange={(e) => {
										setAuthToken(e.target.value);
										localStorage.setItem(
											"dev-portal-auth-token",
											e.target.value,
										);
									}}
									placeholder="your-token-here"
									className="flex-1 h-full w-full bg-transparent pr-3 py-1 text-base md:text-sm font-mono outline-none placeholder:text-muted-foreground"
								/>
							</div>
						</div>
					</div>

					{/* Parameters */}
					{nonBodyParams.length > 0 && (
						<div className="space-y-3">
							<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								Parameters
							</h4>
							<div className="grid gap-4 sm:gap-2">
								{nonBodyParams.map((p) => {
									const key = `${p.in}:${p.name}`;
									return (
										<div
											key={key}
											className="flex flex-col sm:flex-row sm:items-start sm:pt-1 gap-2 sm:gap-4 group"
										>
											<div className="flex items-center gap-2 sm:w-[200px] shrink-0">
												<Badge
													variant="outline"
													className="text-[9px] font-mono px-1.5 py-0 h-4 shrink-0"
												>
													{p.in}
												</Badge>
												<label
													htmlFor={key}
													className="text-sm font-mono font-medium break-all mt-0.5"
												>
													{p.name}
												</label>
												{p.required && (
													<span className="text-red-500 text-[10px]">*</span>
												)}
											</div>
											<Input
												id={key}
												type="text"
												placeholder={p.description || p.type || "value"}
												value={paramValues[key] || ""}
												onChange={(e) => setParam(key, e.target.value)}
												className="h-8 text-sm font-mono bg-background flex-1 min-w-0"
											/>
										</div>
									);
								})}
							</div>
						</div>
					)}

					{/* Request body */}
					{bodyParam && (
						<div className="space-y-2">
							<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								Request Body
							</h4>
							<textarea
								value={bodyValue}
								onChange={(e) => setBodyValue(e.target.value)}
								className="w-full h-40 rounded-lg bg-black border border p-3 text-sm font-mono text-[#c9d1d9] resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
								spellCheck={false}
							/>
						</div>
					)}

					{/* Send button */}
					<button
						type="button"
						onClick={sendRequest}
						disabled={isLoading}
						className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground h-10 px-4 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
					>
						{isLoading ? (
							<>
								<Loader2 className="size-4 animate-spin" />
								Sending…
							</>
						) : (
							<>
								<Play className="size-4" />
								Send Request
							</>
						)}
					</button>

					{/* Error */}
					{error && (
						<div className="flex items-start gap-2 rounded-lg border border-red-500/25 bg-red-500/5 p-3">
							<XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
							<p className="text-sm text-red-500">{error}</p>
						</div>
					)}

					{/* Response */}
					{response && (
						<div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
							{/* Status bar */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									{statusCategory === "success" ? (
										<CheckCircle2 className="size-4 text-emerald-500" />
									) : (
										<XCircle className="size-4 text-red-500" />
									)}
									<Badge
										variant="outline"
										className={`font-mono text-xs font-bold ${
											statusCategory === "success"
												? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25"
												: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/25"
										}`}
									>
										{response.status} {response.statusText}
									</Badge>
									<span className="text-xs text-muted-foreground">
										{response.duration}ms
									</span>
								</div>
								<button
									type="button"
									onClick={copyResponse}
									className="p-1.5 rounded-md hover:bg-muted transition-colors"
									aria-label="Copy response"
								>
									{copied ? (
										<Check className="size-3.5 text-emerald-500" />
									) : (
										<Copy className="size-3.5 text-muted-foreground" />
									)}
								</button>
							</div>

							{/* Response body */}
							<div className="rounded-lg bg-black border border overflow-hidden">
								<pre className="p-4 overflow-x-auto text-sm font-mono text-[#c9d1d9] leading-relaxed max-h-80 overflow-y-auto">
									<code>{response.body}</code>
								</pre>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
