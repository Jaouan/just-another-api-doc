import type { FC } from "react";

type FeatureItemProps = {
	title: string;
	description: React.ReactNode;
};

export const FeatureItem: FC<FeatureItemProps> = ({ title, description }) => (
	<div className="p-8 flex flex-col items-start">
		<h3 className="font-medium text-base mb-2 text-foreground">{title}</h3>
		<p className="text-sm text-muted-foreground">{description}</p>
	</div>
);
