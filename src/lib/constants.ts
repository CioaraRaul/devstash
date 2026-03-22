import { Package, FolderOpen, Star, Heart } from "lucide-react";
import type { StatConfig } from "@/types/dashboard";

export const STAT_CONFIG: StatConfig[] = [
  { key: "totalItems", label: "Items", icon: Package, color: "text-blue-400" },
  { key: "totalCollections", label: "Collections", icon: FolderOpen, color: "text-green-400" },
  { key: "favoriteItems", label: "Favorite Items", icon: Heart, color: "text-pink-400" },
  { key: "favoriteCollections", label: "Favorite Collections", icon: Star, color: "text-yellow-400" },
];
