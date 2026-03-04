import { create } from "zustand";
import navItems from "@/components/nav/nav-items";
import { getAllOperations } from "@/lib/swagger";

type SearchItem = {
	title: string;
	url: string;
	/** HTTP method for API endpoints */
	method?: string;
	/** Endpoint path for API endpoints */
	path?: string;
	/** Short description */
	description?: string;
};

type SearchState = {
	items: SearchItem[];
	apiItems: SearchItem[];
};

const apiEndpoints: SearchItem[] = getAllOperations().map((op) => ({
	title: op.summary || op.operationId,
	url: `/docs/api/${op.operationId}`,
	method: op.method.toUpperCase(),
	path: op.path,
	description: op.description || op.summary,
}));

export const useSearchStore = create<SearchState>(() => ({
	items: navItems.navMain.flatMap(
		(item: {
			title: string;
			url: string;
			items?: { title: string; url: string }[];
		}) => (item.items ? item.items : [{ title: item.title, url: item.url }]),
	),
	apiItems: apiEndpoints,
}));
