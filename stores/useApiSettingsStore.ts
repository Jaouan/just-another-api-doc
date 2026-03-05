import { create } from "zustand";
import { getSchemes, getHost, getBasePath } from "@/lib/swagger";

type ApiSettingsState = {
	baseUrl: string;
	authToken: string;
	setBaseUrl: (url: string) => void;
	setAuthToken: (token: string) => void;
	hydrate: () => void;
};

const defaultBaseUrl = `${getSchemes()[0] || "http"}://${getHost()}${getBasePath()}`;

export const useApiSettingsStore = create<ApiSettingsState>((set) => ({
	baseUrl: defaultBaseUrl,
	authToken: "",
	setBaseUrl: (url: string) => {
		set({ baseUrl: url });
		localStorage.setItem("dev-portal-base-url", url);
	},
	setAuthToken: (token: string) => {
		set({ authToken: token });
		localStorage.setItem("dev-portal-auth-token", token);
	},
	hydrate: () => {
		const savedBaseUrl = localStorage.getItem("dev-portal-base-url");
		const savedToken = localStorage.getItem("dev-portal-auth-token");
		set({
			baseUrl: savedBaseUrl || defaultBaseUrl,
			authToken: savedToken || "",
		});
	},
}));
