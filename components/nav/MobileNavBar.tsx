import { FC } from "react";
import { HeaderLogo } from "../ui/HeaderLogo";
import { SidebarTrigger } from "../ui/sidebar";

export const MobileNavBar: FC = () => {
	return (
		<header className="md:hidden fixed flex flex-row items-center top-0 z-10 px-2 w-full h-fit backdrop-blur-lg transition-colors bg-background/50">
			<HeaderLogo className="px-2 py-3" />
			<SidebarTrigger />
		</header>
	);
};
