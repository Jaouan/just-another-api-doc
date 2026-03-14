"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getTags, getOperationsByTag } from "@/lib/swagger";
import { MethodBadge } from "./MethodBadge";
import { BookOpen, ChevronRight, GitGraph } from "lucide-react";
import { TbApi } from "react-icons/tb";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { NavCollapsible } from "@/components/nav/NavCollapsible";
import apiDocsConfig from "@/api-docs/config";

export function NavApiEndpoints() {
	const pathname = usePathname();
	const tags = getTags();
	const operationsByTag = getOperationsByTag();

	return (
		<SidebarGroup>
			<SidebarGroupLabel>API Reference</SidebarGroupLabel>
			<SidebarMenu>
				{/* Overview link */}
				<SidebarMenuItem>
					<SidebarMenuButton
						asChild
						tooltip="Overview"
						className={cn(
							"text-foreground/70 cursor-pointer hover:bg-foreground/5",
							pathname === "/docs/api" && "bg-foreground/10 text-foreground",
						)}
					>
						<Link href="/docs/api">
							<BookOpen />
							<span>Overview</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>

				{/* Diagram link */}
				<SidebarMenuItem>
					<SidebarMenuButton
						asChild
						tooltip="Architecture"
						className={cn(
							"text-foreground/70 cursor-pointer hover:bg-foreground/5",
							pathname === "/docs/api/diagram" &&
								"bg-foreground/10 text-foreground",
						)}
					>
						<Link href="/docs/api/diagram">
							<GitGraph />
							<span>Architecture</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>

				{/* Tag groups */}
				{tags.map((tag) => {
					const ops = operationsByTag[tag.name] || [];
					const tagKey = tag.name.toLowerCase();
					const groupCfg = apiDocsConfig.groups[tagKey];
					const displayTitle = groupCfg?.title || tag.name;
					const IconComponent = groupCfg?.icon || TbApi;
					const isActive =
						pathname === `/docs/api/tags/${tagKey}` ||
						ops.some((op) => pathname === `/docs/api/${op.operationId}`);

					return (
						<NavCollapsible
							key={tag.name}
							asChild
							defaultOpen={isActive}
							className="group/collapsible"
							links={[
								`/docs/api/tags/${tagKey}`,
								...ops.map((op) => `/docs/api/${op.operationId}`),
							]}
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton
										tooltip={displayTitle}
										className="text-foreground/70 cursor-pointer hover:bg-foreground/5"
									>
										<IconComponent className="shrink-0" />
										<Link
											href={`/docs/api/tags/${tagKey}`}
											className="truncate hover:text-foreground transition-colors"
											onClick={(e) => e.stopPropagation()}
										>
											{displayTitle}
										</Link>
										<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{ops.map((op) => {
											const active = pathname === `/docs/api/${op.operationId}`;
											return (
												<SidebarMenuSubItem key={op.operationId}>
													<SidebarMenuSubButton
														asChild
														className={cn(
															"text-foreground/70 gap-1 !h-auto py-1",
															active && "text-foreground bg-foreground/5",
														)}
														hasLink={`/docs/api/${op.operationId}`}
													>
														<Link href={`/docs/api/${op.operationId}`}>
															<div className="flex flex-col gap-0.5 w-full">
																<span className="text-sm font-medium truncate w-full first-letter:capitalize">
																	{op.summary || op.operationId || "Endpoint"}
																</span>
																<div className="flex items-center gap-1">
																	<span className="min-w-[2.5rem] inline-flex justify-start shrink-0 scale-[0.8]">
																		<MethodBadge
																			method={op.method}
																			className="text-[9px] px-1.5 py-0 h-4"
																		/>
																	</span>
																	<span className="font-mono text-[10px] text-muted-foreground/70 truncate">
																		{op.path}
																	</span>
																</div>
															</div>
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											);
										})}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</NavCollapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
