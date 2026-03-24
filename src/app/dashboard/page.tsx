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
import { getCurrentUser } from "@/lib/db/sidebar";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const [collections, collectionStats, itemStats, pinnedItems, recentItems] =
    await Promise.all([
      getAllCollections(user.id),
      getCollectionStats(user.id),
      getItemStats(user.id),
      getPinnedItems(user.id),
      getRecentItems(user.id, 10),
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
