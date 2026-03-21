import Link from "next/link";
import { LayoutGrid } from "lucide-react";

export function SidebarNav() {
  return (
    <div className="mb-4">
      <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Navigation
      </p>
      <Link
        href="/dashboard"
        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent"
      >
        <LayoutGrid className="h-4 w-4" />
        All Items
      </Link>
    </div>
  );
}
