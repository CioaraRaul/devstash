import { StatsCards } from "@/components/dashboard/main/StatsCards";
import { CollectionsGrid } from "@/components/dashboard/main/CollectionsGrid";
import { PinnedItems } from "@/components/dashboard/main/PinnedItems";
import { RecentItems } from "@/components/dashboard/main/RecentItems";
import {
  getAllCollections,
  getCollectionStats,
  getItemStats,
} from "@/lib/db/collections";
import { getPinnedItems, getRecentItems } from "@/lib/db/items";

export default async function DashboardPage() {
  const [collections, collectionStats, itemStats, pinnedItems, recentItems] =
    await Promise.all([
      getAllCollections(),
      getCollectionStats(),
      getItemStats(),
      getPinnedItems(),
      getRecentItems(10),
    ]);

  const stats = { ...itemStats, ...collectionStats };

  return (
    <div className="flex flex-col gap-8">
      <StatsCards stats={stats} />
      <CollectionsGrid collections={collections} />
      <PinnedItems items={pinnedItems} />
      <RecentItems items={recentItems} />
    </div>
  );
}
