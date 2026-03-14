import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import roadmapData from "../../public/roadmap.yml";
import { Badge } from "@/components/ui/badge";
import {
	Rocket,
	Bug,
	Wrench,
	Sparkles,
	FileText,
	ArrowUpCircle,
	Milestone,
} from "lucide-react";

type NoteType =
	| "feature"
	| "bugfix"
	| "refactor"
	| "enhancement"
	| "docs"
	| "other";

interface Note {
	type: NoteType;
	title: string;
	description: string;
}

interface Release {
	version: string;
	status: "next" | "current" | "previous";
	date: string;
	notes: Note[];
}

const typeIconMap: Record<NoteType, React.ElementType> = {
	feature: Sparkles,
	bugfix: Bug,
	refactor: Wrench,
	enhancement: ArrowUpCircle,
	docs: FileText,
	other: Rocket,
};

const typeColorMap: Record<NoteType, string> = {
	feature: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
	bugfix: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25",
	refactor:
		"bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25",
	enhancement:
		"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
	docs: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/25",
	other: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/25",
};

const releases: Release[] = roadmapData as Release[];

function ReleaseCard({ release }: { release: Release }) {
	return (
		<Card className="flex flex-col">
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<CardTitle className="text-xl">{release.version}</CardTitle>
					<div className="flex items-center gap-2">
						{release.status === "current" && (
							<Badge
								variant="outline"
								className="bg-primary/10 text-primary border-primary/20"
							>
								Current
							</Badge>
						)}
						{release.status === "next" && (
							<Badge
								variant="outline"
								className="bg-amber-500/10 text-amber-600 border-amber-500/20"
							>
								Next
							</Badge>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4 flex-1">
				{release.notes.map((note, idx) => {
					const Icon = typeIconMap[note.type] || typeIconMap.other;
					const colorClass = typeColorMap[note.type] || typeColorMap.other;

					return (
						<div key={idx} className="flex gap-3">
							<div className="mt-0.5 shrink-0">
								<div className={`p-1.5 rounded-md border ${colorClass}`}>
									<Icon className="size-3.5" />
								</div>
							</div>
							<div className="flex flex-col gap-0 min-w-0">
								<h4 className="text-sm font-medium leading-none mt-1">
									{note.title}
								</h4>
								<p className="text-sm text-muted-foreground mt-0.5">
									{note.description}
								</p>
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}

export default function RoadmapPage() {
	const currentRelease = releases.find((r) => r.status === "current");
	const nextRelease = releases.find((r) => r.status === "next");
	const previousReleases = releases.filter((r) => r.status === "previous");

	return (
		<div className="space-y-10">
			{/* Header */}
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<Milestone className="size-7 text-primary" />
					<h1 className="text-3xl font-bold tracking-tight">Roadmap</h1>
				</div>
				<p className="text-muted-foreground">
					Stay up to date with our latest releases and what's coming next.
				</p>
			</div>

			{/* Current & Next */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{currentRelease && <ReleaseCard release={currentRelease} />}
				{nextRelease && <ReleaseCard release={nextRelease} />}
			</div>

			{/* Previous Releases */}
			{previousReleases.length > 0 && (
				<section className="space-y-6 pt-4 border-t">
					<h2 className="text-xl font-semibold">Previous Releases</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{previousReleases.map((release) => (
							<ReleaseCard key={release.version} release={release} />
						))}
					</div>
				</section>
			)}
		</div>
	);
}
