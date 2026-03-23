import type { LucideIcon } from "lucide-react";

export interface TopBarProps {
  onToggleSidebar: () => void;
}

export type Stats = {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
};

export interface StatConfig {
  key: keyof Stats;
  label: string;
  icon: LucideIcon;
  color: string;
}

export interface ItemCardProps {
  item: import("@/lib/mock-data").Item;
}
