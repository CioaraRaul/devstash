import Link from "next/link";
import { mockItemTypes } from "@/lib/mock-data";
import { ITEM_TYPE_ICONS } from "@/lib/icons";
import { getItemCountByType } from "@/lib/data-helpers";

export function SidebarTypes() {
  return (
    <div className="mb-4">
      <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Types
      </p>
      <nav className="flex flex-col gap-0.5">
        {mockItemTypes.map((type) => {
          const Icon = ITEM_TYPE_ICONS[type.icon];
          const count = getItemCountByType(type.slug);
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
              <span className="text-xs text-muted-foreground">{count}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
