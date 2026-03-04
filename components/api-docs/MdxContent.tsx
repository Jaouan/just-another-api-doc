import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

const mdxComponents = {
	h1: (props: React.ComponentProps<"h1">) => (
		<h1 className="text-2xl font-bold tracking-tight mt-6 mb-3" {...props} />
	),
	h2: (props: React.ComponentProps<"h2">) => (
		<h2 className="text-xl font-semibold tracking-tight mt-5 mb-2" {...props} />
	),
	h3: (props: React.ComponentProps<"h3">) => (
		<h3 className="text-lg font-semibold mt-4 mb-2" {...props} />
	),
	p: (props: React.ComponentProps<"p">) => (
		<p className="text-muted-foreground leading-relaxed mb-3" {...props} />
	),
	ul: (props: React.ComponentProps<"ul">) => (
		<ul
			className="list-disc list-inside text-muted-foreground mb-3 space-y-1"
			{...props}
		/>
	),
	ol: (props: React.ComponentProps<"ol">) => (
		<ol
			className="list-decimal list-inside text-muted-foreground mb-3 space-y-1"
			{...props}
		/>
	),
	li: (props: React.ComponentProps<"li">) => (
		<li className="leading-relaxed" {...props} />
	),
	code: (props: React.ComponentProps<"code">) => {
		// Don't apply inline styles if inside a pre (handled by rehype-pretty-code)
		const isInline = !props.className?.includes("language-");
		if (isInline) {
			return (
				<code
					className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
					{...props}
				/>
			);
		}
		return <code {...props} />;
	},
	pre: (props: React.ComponentProps<"pre">) => (
		<pre
			className="bg-black border border rounded-lg p-4 overflow-x-auto mb-3 text-sm font-mono [&>code]:bg-transparent [&>code]:p-0"
			{...props}
		/>
	),
	a: (props: React.ComponentProps<"a">) => (
		<a
			className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
			{...props}
		/>
	),
	blockquote: (props: React.ComponentProps<"blockquote">) => (
		<blockquote
			className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground mb-3"
			{...props}
		/>
	),
	table: (props: React.ComponentProps<"table">) => (
		<div className="overflow-x-auto mb-3">
			<table className="w-full text-sm border-collapse" {...props} />
		</div>
	),
	th: (props: React.ComponentProps<"th">) => (
		<th
			className="text-left font-semibold p-2 border-b bg-muted/50"
			{...props}
		/>
	),
	td: (props: React.ComponentProps<"td">) => (
		<td className="p-2 border-b border-border/50" {...props} />
	),
};

const rehypeOptions = {
	theme: "dark-plus",
	keepBackground: false,
};

export function MdxContent({ source }: { source: string }) {
	return (
		<div className="mdx-content">
			<MDXRemote
				source={source}
				components={mdxComponents}
				options={{
					mdxOptions: {
						rehypePlugins: [[rehypePrettyCode, rehypeOptions]],
					},
				}}
			/>
		</div>
	);
}
