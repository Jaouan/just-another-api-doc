import { FC, PropsWithChildren } from "react";
import { SidebarProvider } from "../ui/sidebar";
import { MobileNavBar } from "../nav/MobileNavBar";
import { AppSidebar } from "../nav/AppSidebar";

export const PrivateLayout: FC<PropsWithChildren> = ({ children }) => (
	<SidebarProvider>
		<MobileNavBar />
		<AppSidebar />
		<main className="px-4 sm:px-8 py-4 max-md:pt-18 w-full min-w-0">
			{children}
		</main>
	</SidebarProvider>
);
