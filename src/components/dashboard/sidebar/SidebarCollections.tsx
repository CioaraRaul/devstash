import Link from "next/link";
import { Star } from "lucide-react";
import type { SidebarCollectionsProps } from "@/types/dashboard";

export function SidebarCollections({ collections }: SidebarCollectionsProps) {
  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = collections.filter((c) => !c.isFavorite).slice(0, 3);

  return (
    <div className="mb-4">
      <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Collections
      </p>
      <nav className="flex flex-col gap-0.5">
        {favoriteCollections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.id}`}
            className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <span className="flex items-center gap-2 truncate">
              <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-500 text-yellow-500" />
              {collection.name}
            </span>
          </Link>
        ))}
        {recentCollections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.id}`}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: collection.dominantColor || "#6b7280" }}
            />
            <span className="truncate">{collection.name}</span>
          </Link>
        ))}
      </nav>
      <Link
        href="/collections"
        className="mt-2 block px-2 text-xs text-muted-foreground hover:text-foreground"
      >
        View all collections
      </Link>
    </div>
  );
}
