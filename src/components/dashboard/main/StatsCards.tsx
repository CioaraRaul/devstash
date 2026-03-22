import { getStats } from "@/lib/data-helpers";
import { STAT_CONFIG } from "@/lib/constants";

export function StatsCards() {
  const stats = getStats();

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {STAT_CONFIG.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{label}</p>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <p className="mt-2 text-2xl font-bold">{stats[key]}</p>
        </div>
      ))}
    </div>
  );
}
