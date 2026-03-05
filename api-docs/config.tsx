import type { ComponentType } from "react";
import type { IconBaseProps } from "react-icons";
import { FaPaw, FaStore, FaUser } from "react-icons/fa";

export type GroupConfig = {
    title: string;
    icon?: ComponentType<IconBaseProps>;
};

const apiDocsConfig = {
    groups: {
        pet: { title: "Pet Management", icon: FaPaw },
        store: { title: "Store", icon: FaStore },
        user: { title: "User", icon: FaUser },
    } as Record<string, GroupConfig>,
};

export default apiDocsConfig;
