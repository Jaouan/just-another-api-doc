import { cn, PropsWithStyle } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";
import { TbApi } from "react-icons/tb";

export const HeaderLogo: FC<PropsWithStyle> = ({ className }) => (
	<Link
		href="/"
		className={cn(
			"cursor-pointer flex items-center justify-start gap-3 text-lg w-full font-bold text-nowrap",
			className,
		)}
	>
		<TbApi className="size-6!" />
		<div className="group-data-[state=collapsed]:hidden">
			Just another API doc
		</div>
	</Link>
);
