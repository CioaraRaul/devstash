import Link from "next/link";
import { Star } from "lucide-react";
import {
  getAllCollections,
  getCollectionItemTypeSlugs,
  getItemTypeBySlug,
} from "@/lib/data-helpers";
import { ITEM_TYPE_ICONS } from "@/lib/icons";

export function CollectionsGrid() {
  const collections = getAllCollections();

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Collections</h2>
        <span className="text-sm text-muted-foreground">
          {collections.length} collections
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => {
          const typeSlugs = getCollectionItemTypeSlugs(collection.id);
          return (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="group rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium">{collection.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {collection.description}
                  </p>
                </div>
                {collection.isFavorite && (
                  <Star className="ml-2 h-4 w-4 shrink-0 fill-yellow-500 text-yellow-500" />
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {typeSlugs.map((slug) => {
                    const itemType = getItemTypeBySlug(slug);
                    if (!itemType) return null;
                    const Icon = ITEM_TYPE_ICONS[itemType.icon];
                    if (!Icon) return null;
                    return (
                      <Icon
                        key={slug}
                        className="h-4 w-4"
                        style={{ color: itemType.color }}
                      />
                    );
                  })}
                </div>
                <span className="text-xs text-muted-foreground">
                  {collection.itemIds.length} items
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
