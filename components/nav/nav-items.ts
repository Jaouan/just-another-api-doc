import { Activity, Github, Milestone } from "lucide-react";

export default {
	navMain: [
		{
			title: "Github",
			url: "https://github.com/Jaouan/just-another-api-doc",
			icon: Github,
			/*items: [
				{ title: "Foo", url: "#" },
				{ title: "Bar", url: "#" },
			],*/
		},
		{
			title: "Roadmap",
			url: "/roadmap",
			icon: Milestone,
		},
		{
			title: "Status",
			url: "/status",
			icon: Activity,
		},
	],
};
