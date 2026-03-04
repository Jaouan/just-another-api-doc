import * as React from "react";
import { NavGeneric } from "@/components/nav/NavGeneric";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { ThemeSwitcher } from "../theme/ThemeSwitcher";
import type { FC } from "react";
import navItems from "./nav-items";
import { HeaderLogo } from "../ui/HeaderLogo";
import { SearchInput } from "./SearchInput";
import { NavApiEndpoints } from "@/components/api-docs/ApiSidebar";

export const AppSidebar: FC<React.ComponentProps<typeof Sidebar>> = (props) => (
	<Sidebar collapsible="icon" variant="sidebar" {...props}>
		<SidebarHeader>
			<HeaderLogo className="px-2 py-3" />
			<SearchInput className="group-data-[state=collapsed]:hidden" />
		</SidebarHeader>
		<SidebarContent>
			<NavGeneric title="Just a group" items={navItems.navMain} />
			<NavApiEndpoints />
		</SidebarContent>
		<SidebarFooter>
			<div className="transition-all flex justify-start ms-3 group-data-[state=collapsed]:ms-1">
				<ThemeSwitcher />
			</div>
		</SidebarFooter>
		<SidebarRail />
	</Sidebar>
);
