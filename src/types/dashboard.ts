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
  item: import("@/lib/db/items").DashboardItem;
}

export interface ItemListProps {
  items: import("@/lib/db/items").DashboardItem[];
}

export interface SidebarTypesProps {
  itemTypes: import("@/lib/db/sidebar").SidebarItemType[];
}

export interface SidebarCollectionsProps {
  collections: import("@/lib/db/sidebar").SidebarCollection[];
}

export interface SidebarUserProps {
  user: import("@/lib/db/sidebar").SidebarUser;
}

export interface SidebarContentProps {
  itemTypes: import("@/lib/db/sidebar").SidebarItemType[];
  collections: import("@/lib/db/sidebar").SidebarCollection[];
  user: import("@/lib/db/sidebar").SidebarUser;
}

export interface DashboardShellProps {
  children: React.ReactNode;
  itemTypes: import("@/lib/db/sidebar").SidebarItemType[];
  collections: import("@/lib/db/sidebar").SidebarCollection[];
  user: import("@/lib/db/sidebar").SidebarUser;
}
