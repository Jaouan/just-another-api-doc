import { HeaderLogo } from "@/components/ui/HeaderLogo";
import { ThemeSwitcher } from "../theme/ThemeSwitcher";
import type { FC } from "react";

export const LandingNavBar: FC = () => (
	<nav className="fixed top-0 left-0 w-full p-3 md:p-6 flex justify-center z-2">
		<div className="overflow-hidden w-full max-w-250 z-50 backdrop-blur-xl bg-background/50 border flex items-center justify-between gap-4 p-2 rounded-2xl ">
			<HeaderLogo className="ms-2 max-sm:[&>div]:hidden w-fit" />
			<div className="flex items-center gap-2">
				<ThemeSwitcher className="max-sm:hidden me-1.5" />
			</div>
		</div>
	</nav>
);
