import type { FC } from "react";
import { cn } from "@/lib/utils";

type SectionContainerProps = {
	className?: string;
	children: React.ReactNode;
};

export const SectionContainer: FC<SectionContainerProps> = ({
	className,
	children,
}) => (
	<section
		className={cn("w-full px-4 py-16 flex flex-col items-center", className)}
	>
		{children}
	</section>
);
