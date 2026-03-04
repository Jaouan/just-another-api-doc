import { ChevronRight, type LucideIcon } from "lucide-react";

import {
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import Link from "next/link";
import { NavCollapsible } from "./NavCollapsible";
import type { FC } from "react";

type NavGenericProps = {
	title: string;
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
};

export const NavGeneric: FC<NavGenericProps> = ({ title, items }) => (
	<SidebarGroup>
		<SidebarGroupLabel>{title}</SidebarGroupLabel>
		<SidebarMenu>
			{items.map((item) => {
				const hasSubItems = item.items && item.items.length > 0;

				if (!hasSubItems) {
					return (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
								className="text-foreground/70 hover:bg-foreground/5"
							>
								<Link href={item.url}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				}

				return (
					<NavCollapsible
						key={item.title}
						asChild
						defaultOpen={item.isActive}
						className="group/collapsible"
						links={item.items?.map((sub) => sub.url)}
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton
									tooltip={item.title}
									className="text-foreground/70 cursor-pointer hover:bg-foreground/5"
								>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
									<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									{item.items?.map((subItem) => (
										<SidebarMenuSubItem key={subItem.title}>
											<SidebarMenuSubButton
												asChild
												className="text-foreground/70"
												hasLink={subItem.url}
											>
												<Link href={subItem.url}>
													<span>{subItem.title}</span>
												</Link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</NavCollapsible>
				);
			})}
		</SidebarMenu>
	</SidebarGroup>
);
