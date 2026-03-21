import Link from "next/link";
import { Folder, Star } from "lucide-react";
import { getFavoriteCollections, getRecentCollections } from "@/lib/data-helpers";

export function SidebarCollections() {
  const favoriteCollections = getFavoriteCollections();
  const recentCollections = getRecentCollections();

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
              <Folder className="h-4 w-4 shrink-0" />
              {collection.name}
            </span>
            <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-500 text-yellow-500" />
          </Link>
        ))}
        {recentCollections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.id}`}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Folder className="h-4 w-4 shrink-0" />
            <span className="truncate">{collection.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
