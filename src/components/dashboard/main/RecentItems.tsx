import { ItemCard } from "./ItemCard";
import type { ItemListProps } from "@/types/dashboard";

export function RecentItems({ items }: ItemListProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Items</h2>
        <span className="text-sm text-muted-foreground">
          {items.length} items
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
