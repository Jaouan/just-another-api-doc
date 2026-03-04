import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Just Another API Doc",
	description:
		"A modern, fast and flexible Next.js boilerplate for your web projects.",
	keywords: ["Next.js", "Boilerplate", "React", "TypeScript", "TailwindCSS"],
	openGraph: {
		title: "Just Another API Doc",
		description:
			"A modern, fast and flexible Next.js boilerplate for your web projects.",
		url: "https://just-another-api-doc.pages.dev/",
		siteName: "Just Another API Doc",
		images: [
			{
				url: "https://just-another-api-doc.pages.dev/landing-shot.webp",
				alt: "Just Another API Doc OG Image",
			},
		],
		locale: "en_US",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
