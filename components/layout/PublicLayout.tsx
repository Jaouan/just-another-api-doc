import { FC, PropsWithChildren } from "react";
import { LandingNavBar } from "../nav/LandingNavBar";

export const PublicLayout: FC<PropsWithChildren> = ({ children }) => (
	<>
		<LandingNavBar />
		<main className="min-h-screen flex flex-col items-center justify-center p-8">
			{children}
		</main>
	</>
);
