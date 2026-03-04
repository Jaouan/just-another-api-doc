"use client";

import { useIsDark } from "@/hooks/use-is-dark";
import { MeshGradient as PaperMeshGradient } from "@paper-design/shaders-react";
import type { FC } from "react";

const meshProps = {
	dark: {
		colors: ["#303030", "#000000", "#000000"],
	},
	light: {
		colors: ["#FFFFFF", "#BFBFBF", "#FFFFFF"],
	},
};

export const MeshGradient: FC = () => {
	const currentProps = useIsDark() ? meshProps.dark : meshProps.light;
	return (
		<PaperMeshGradient
			className="size-full"
			distortion={0.5}
			swirl={0.7}
			grainMixer={0}
			speed={0.8}
			grainOverlay={0.2}
			{...currentProps}
		/>
	);
};
