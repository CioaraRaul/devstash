import type { LucideIcon } from "lucide-react";

export interface TopBarProps {
  onToggleSidebar: () => void;
}

export interface StatConfig {
  key: "totalItems" | "totalCollections" | "favoriteItems" | "favoriteCollections";
  label: string;
  icon: LucideIcon;
  color: string;
}

export interface ItemCardProps {
  item: import("@/lib/mock-data").Item;
}
