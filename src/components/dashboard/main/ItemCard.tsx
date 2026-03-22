import Link from "next/link";
import { Pin, Star } from "lucide-react";
import { getItemTypeBySlug } from "@/lib/data-helpers";
import { ITEM_TYPE_ICONS } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import type { ItemCardProps } from "@/types/dashboard";

export function ItemCard({ item }: ItemCardProps) {
  const itemType = getItemTypeBySlug(item.typeSlug);
  const Icon = itemType ? ITEM_TYPE_ICONS[itemType.icon] : null;

  return (
    <Link
      href={`/items/${item.typeSlug}/${item.id}`}
      className="group flex rounded-lg border border-border bg-card transition-colors hover:bg-accent"
    >
      <div
        className="w-1 shrink-0 rounded-l-lg"
        style={{ backgroundColor: itemType?.color }}
      />
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {Icon && (
              <Icon
                className="h-4 w-4 shrink-0"
                style={{ color: itemType?.color }}
              />
            )}
            <h3 className="truncate font-medium">{item.title}</h3>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {item.isPinned && (
              <Pin className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            {item.isFavorite && (
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
            )}
          </div>
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
          {item.description}
        </p>
        {item.content && (
          <pre className="mt-2 rounded bg-muted/50 p-2 text-xs text-muted-foreground line-clamp-3 overflow-hidden font-mono">
            {item.content}
          </pre>
        )}
        {item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
