"use client";

import { FC, useEffect, useState } from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Kbd, KbdKey } from "../ui/shadcn-io/kbd";
import { cn, PropsWithStyle } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearchStore } from "@/stores/useSearchStore";
import { redirect } from "next/navigation";
import { MethodBadge } from "@/components/api-docs/MethodBadge";

export const SearchInput: FC<PropsWithStyle> = ({ className }) => {
	const isMobile = useIsMobile();
	const [open, setOpen] = useState(false);
	const items = useSearchStore((state) => state.items);
	const apiItems = useSearchStore((state) => state.apiItems);

	useEffect(() => {
		if (isMobile) return;
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [isMobile]);

	if (isMobile) return null;

	return (
		<>
			<div
				className={cn("relative w-full", className)}
				onFocus={() => setOpen(true)}
			>
				<Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
				<Input name="search-input" placeholder="Search" className="px-8" />
				<Kbd className="pointer-events-none absolute end-2 top-2.5 h-4">
					<KbdKey aria-label="Meta">⌘</KbdKey>
					<KbdKey>K</KbdKey>
				</Kbd>
			</div>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Pages">
						{items?.filter(Boolean).map((item, index) => (
							<CommandItem
								key={index}
								onSelect={() => {
									setOpen(false);
									redirect(item.url);
								}}
							>
								{item.title}
							</CommandItem>
						))}
					</CommandGroup>
					<CommandGroup heading="API Endpoints">
						{apiItems.map((item, index) => (
							<CommandItem
								key={index}
								value={`${item.method} ${item.path} ${item.title} ${item.summary || item.description}`}
								onSelect={() => {
									setOpen(false);
									redirect(item.url);
								}}
								className="flex flex-col items-start gap-1 py-2.5"
							>
								<span className="text-sm font-medium truncate w-full first-letter:capitalize">
									{item.summary || item.title || item.description || "Endpoint"}
								</span>
								<div className="flex items-center gap-2">
									<MethodBadge
										method={item.method || ""}
										className="text-[9px] px-1.5 py-0 h-4 scale-[0.9] shrink-0"
									/>
									<span className="font-mono text-xs text-muted-foreground truncate">
										{item.path}
									</span>
								</div>
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
};
