import Link from "next/link";
import { ITEM_TYPE_ICONS } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import type { SidebarTypesProps } from "@/types/dashboard";

const PRO_TYPE_SLUGS = new Set(["files", "images"]);

export function SidebarTypes({ itemTypes }: SidebarTypesProps) {
  return (
    <div className="mb-4">
      <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Types
      </p>
      <nav className="flex flex-col gap-0.5">
        {itemTypes.map((type) => {
          const Icon = ITEM_TYPE_ICONS[type.icon];
          return (
            <Link
              key={type.id}
              href={`/items/${type.slug}`}
              className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <span className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4" style={{ color: type.color }} />}
                <span>{type.label}s</span>
              </span>
              <span className="flex items-center gap-1.5">
                {PRO_TYPE_SLUGS.has(type.slug) && (
                  <Badge variant="outline" className="h-4 px-1 text-[10px] font-semibold tracking-wide text-muted-foreground">
                    PRO
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">{type.count}</span>
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
