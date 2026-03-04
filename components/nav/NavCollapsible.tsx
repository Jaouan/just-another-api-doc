"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { usePathname } from "next/navigation";
import type { FC } from "react";

export const NavCollapsible: FC<
	React.ComponentProps<typeof CollapsiblePrimitive.Root> & { links?: string[] }
> = ({ ...props }) => {
	const path = usePathname();
	return (
		<CollapsiblePrimitive.Root
			data-slot="collapsible"
			defaultOpen={props.links?.includes(path)}
			{...props}
		/>
	);
};
