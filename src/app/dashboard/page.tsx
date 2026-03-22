import { StatsCards } from "@/components/dashboard/main/StatsCards";
import { CollectionsGrid } from "@/components/dashboard/main/CollectionsGrid";
import { PinnedItems } from "@/components/dashboard/main/PinnedItems";
import { RecentItems } from "@/components/dashboard/main/RecentItems";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <StatsCards />
      <CollectionsGrid />
      <PinnedItems />
      <RecentItems />
    </div>
  );
}
