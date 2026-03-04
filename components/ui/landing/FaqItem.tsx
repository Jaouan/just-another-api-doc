import type { FC } from "react";

type FaqItemProps = {
	question: string;
	answer: React.ReactNode;
};

export const FaqItem: FC<FaqItemProps> = ({ question, answer }) => (
	<div className="p-6">
		<h3 className="font-medium text-base mb-2 text-foreground">{question}</h3>
		<p className="text-sm text-muted-foreground">{answer}</p>
	</div>
);
