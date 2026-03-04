import { useTheme } from "next-themes";

export const useIsDark = () => {
	const { resolvedTheme } = useTheme();
	return resolvedTheme === "dark";
};
