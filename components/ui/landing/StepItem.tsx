import type { FC } from "react";

type StepItemProps = {
	number: number;
	title: string;
	description: React.ReactNode;
};

export const StepItem: FC<StepItemProps> = ({ number, title, description }) => (
	<li className="p-6 flex flex-col gap-2">
		<span className="font-medium text-base text-foreground">
			{number}. {title}
		</span>
		<span className="text-sm text-muted-foreground">{description}</span>
	</li>
);
