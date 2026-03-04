import { MeshGradient } from "@/components/effects/MeshGradient";
import { LandingNavBar } from "@/components/nav/LandingNavBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const _imageLogos = [
	{
		src: "/google-brand.svg",
		alt: "Company 1",
		href: "https://company1.com",
	},
];

export default function HomePage() {
	return (
		<main className="relative">
			<LandingNavBar />
			<div className="p-8 min-h-screen flex flex-col items-center justify-center ">
				<div className="absolute h-screen inset-0 -z-10">
					<MeshGradient />
					<div className="pointer-events-none z-1 w-full h-[20%] absolute bottom-0 left-0 bg-[linear-gradient(180deg,transparent_0%,var(--background)_100%)]"></div>
				</div>
				<div className="mb-8">
					<h1
						id="main-title"
						className="text-4xl font-bold tracking-tight text-foreground text-center sm:text-6xl lg:text-7xl"
					>
						Just <strong>another</strong> <br />
						API <em className="italic">documentation</em>
					</h1>
				</div>
				<img
					src="/hand-arrow.svg"
					alt="arrow"
					className="w-30 my-4 dark:invert"
				/>
				<Button asChild>
					<Link href="/docs/api">Explore the API</Link>
				</Button>
			</div>
		</main>
	);
}
