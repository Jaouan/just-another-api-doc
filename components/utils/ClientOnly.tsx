"use client";

import { useIsMounted } from "@/hooks/use-is-mounted";
import { FC, PropsWithChildren } from "react";

type ClientOnlyProps = PropsWithChildren & {
	fallback?: React.ReactNode;
};
export const ClientOnly: FC<ClientOnlyProps> = ({
	children,
	fallback = null,
}) => {
	const isMounted = useIsMounted();
	if (!isMounted) return fallback;
	return children;
};
